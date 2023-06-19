<script lang="ts">
	import { onMount } from 'svelte';
	import { Chessground } from 'chessgroundx';
	import { Chess } from 'chess.js';
	import type { Api, Config } from 'chessgroundx';
	import type { Square } from 'chess.js';

	import './board.css';
	import { updateChessStore, type ChessStore } from '../store/chess';
	import Piece from './piece.svelte';

	let board: HTMLElement;
	let capturedPieces: ChessStore['capturedPieces'];
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
		},
		addPieceZIndex: true,
		premovable: {
			enabled: true
		}
	};
	onMount(() => {
		cg = Chessground(board, config);
		const events: Config['events'] = {
			async move(orig, dest, capturedPiece) {
				const move = `${orig}-${dest}`;
				chess.move(move);
				let capturedPiecesNew = capturedPieces || [];
				if (capturedPiece) {
					capturedPiecesNew.push(capturedPiece);
					captureSound.play();
				} else moveSound.play();
				updateChessStore({ fen: chess.fen(), capturedPieces: capturedPiecesNew });

				//call for ai move
				triggerAiMove(chess.fen());

				cg.set({
					check: chess.isCheck()
				});

				if (chess.isCheckmate()) {
					alert('Check Mate');
				} else if (chess.isDraw()) {
					alert('Draw');
				} else if (chess.isStalemate()) {
					alert('Stalemate');
				}
			},
			select(key) {
				if (color && color[0] != (chess.turn() as string)) {
					return;
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

	async function triggerAiMove(fen: ChessStore['fen']) {
		const res = await fetch('http://127.0.0.1:8000/next', {
			method: 'POST',
			body: JSON.stringify({ fen }),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
		const { next_move } = await res.json();
		const move = `${next_move.slice(0, 2)}-${next_move.slice(2)}`;
		chess.move(move);
		cg.set({ fen: chess.fen(), check: chess.isCheck() });

		if (chess.isCheckmate()) {
			alert('Check Mate');
		} else if (chess.isDraw()) {
			alert('Draw');
		} else if (chess.isStalemate()) {
			alert('Stalemate');
		}
	}
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
		align-items: center;
		user-select: none;
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
