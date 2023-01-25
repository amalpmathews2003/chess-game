<script lang="ts">
	import { authStoreSub, type AuthUser } from '../../store';
	import Board from '../../components/board.svelte';
	import type { PageData } from './$types';
	import { handleRoom } from '../../../src/store/firebase';
	import { chessStoreSub } from '../../../src/store/chess';

	export let data: PageData;

	let user: AuthUser = null;
	let isLoggedIn: boolean = false;
	let me: AuthUser, opponent: string;
	let fen: string;
	authStoreSub((authData) => {
		if (authData.isLoggedIn && authData.user) {
			user = authData.user;
			isLoggedIn = authData.isLoggedIn;
			handleRoom(data?.room?.id, user);
		}
	});
	chessStoreSub((chessData) => {
		if (chessData.opponent) {
			opponent = chessData.opponent;
		} else {
			opponent = 'waiting for opponent to join';
		}
		if (chessData.me) me = chessData.me;
		if (chessData.fen) fen = chessData.fen;
	});
</script>

<Board roomId={data.room.id} />
<p>{data.room.id}</p>
<p>{me}</p>
<p>{opponent}</p>
<p>{fen}</p>
