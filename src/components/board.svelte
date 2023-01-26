<script lang="ts">
	import { onMount } from 'svelte';
	import { Chessground } from 'chessgroundx';
	import { Chess } from 'chess.js';
	import type { Api, Config } from 'chessgroundx';
	import type { Square } from 'chess.js';

	import './board.css';
	import { chessStoreSub, updateChessStore, type ChessStore } from '../store/chess';
	import Piece from './piece.svelte';
	import { updateRoomDoc } from '../../src/store/firebase';

	export let roomId: string;

	let board: HTMLElement;
	let capturedPieces: ChessStore['capturedPieces'];
	let fen: ChessStore['fen'];
	let color: ChessStore['color'];
	let moveSound: HTMLAudioElement;
	let captureSound: HTMLAudioElement;

	const chess = new Chess();
	let cg: Api;

	let orientation: Config['orientation'] = 'white';
	const config: Config = {
		orientation,
		movable: {
			free: false
		}
	};
	onMount(() => {
		cg = Chessground(board, config);
		const events: Config['events'] = {
			async move(orig, dest, capturedPiece) {
				chess.move(`${orig}-${dest}`);
				let capturedPiecesNew = capturedPieces;
				if (capturedPiece) {
					capturedPiecesNew?.push(capturedPiece);
					captureSound.play();
				} else moveSound.play();
				updateChessStore({ fen: chess.fen(), capturedPieces: capturedPiecesNew });
				await updateRoomDoc(roomId, { fen: chess.fen(), capturedPieces: capturedPiecesNew });

				if (chess.isCheckmate()) {
					alert('Check Mate');
				} else if (chess.isDraw()) {
					alert('Draw');
				} else if (chess.isStalemate()) {
					alert('Stalemate');
				}
				if (chess.isCheck()) {
					cg.set({
						check: true
					});
				}
			},
			select(key) {
				if (color && color[0] != (chess.turn() as string)) {
					cg.unselect();
				}
				const dests = new Map();
				const possibleMoves = chess.moves({ square: key as Square, verbose: true });
				dests.set(
					key,
					possibleMoves.map((m) => m.to)
				);
				cg.set({
					movable: {
						dests
					}
				});
				cg.redrawAll();
			}
		};
		cg.set({ events });
	});
	chessStoreSub((data) => {
		capturedPieces = data.capturedPieces;
		color = color || (data.color as Config['orientation']);
		if (cg) {
			fen = data['fen'] as string;
			chess.load(fen);
			if (chess.isCheckmate()) {
				alert('Check Mate');
			} else if (chess.isDraw()) {
				alert('Draw');
			} else if (chess.isStalemate()) {
				alert('Stalemate');
			}
			if (chess.isCheck()) {
				cg.set({
					check: true
				});
			}
			cg.set({
				fen,
				orientation: color,
			});
		}
	});
</script>

<div class="container">
	<div class="container">
		<div bind:this={board} />
	</div>
	<div class="container">
		{#if capturedPieces}
			<div class="captured">
				{#each capturedPieces.filter((p) => p.color == 'black') as piece}
					<Piece {piece} />
				{/each}
			</div>
			<div class="captured">
				{#each capturedPieces.filter((p) => p.color == 'white') as piece}
					<Piece {piece} />
				{/each}
			</div>
		{/if}
	</div>
</div>
<h3>{color}</h3>
<div class="hidden">
	<audio
		bind:this={moveSound}
		src="https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3"
	/>
	<audio
		bind:this={captureSound}
		src="https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3"
	/>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin: 0 10rem;
	}
	.hidden {
		display: none;
	}
	.captured {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
