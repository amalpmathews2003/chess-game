<script lang="ts">
	import { onMount } from 'svelte';
	import { Chessground } from 'chessgroundx';
	import { Chess } from 'chess.js';
	import type { Api, Config } from 'chessgroundx';
	import type { Square } from 'chess.js';

	import './board.css';

	let board: HTMLElement;

	let moveSound: HTMLAudioElement;
	let captureSound: HTMLAudioElement;

	const chess = new Chess();
	let cg: Api;

	let orientation: Config['orientation'] = 'white';
	const config: Config = {
		orientation,
		movable: {
			showDests: true,
			free: false
		},
		highlight: {
			check: true,
			lastMove: true
		},
		draggable: {
			showGhost: true
		}
	};
	onMount(() => {
		cg = Chessground(board, config);
		const events: Config['events'] = {
			move(orig, dest, capturedPiece) {
				chess.move(`${orig}-${dest}`);
				
				if (capturedPiece) captureSound.play();
				else moveSound.play();

				if (chess.inCheck()) {
					cg.set({
						check: true
					});
				}
			},
			select(key) {
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
</script>

<div class="container">
	<div bind:this={board} />
</div>
<div class="hidden">
	<audio
		bind:this={moveSound}
		src="http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3"
	/>
	<audio
		bind:this={captureSound}
		src="http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3"
	/>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
	}
	.hidden {
		display: none;
	}
</style>
