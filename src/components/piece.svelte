<script lang="ts">
	import type { Piece } from 'chessgroundx/types';
	import './board.css';
	export let piece: Piece;
</script>

<div class={`${piece.role} ${piece.color}`} />

<style>
	div {
		background-size: contain;
		position: relative;
    height: 50px;
    width: 50px;
	}
</style>
