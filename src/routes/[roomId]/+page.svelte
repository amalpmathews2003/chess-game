<script lang="ts">
	import { authStoreSub, type AuthUser } from '../../store';
	import Board from '../../components/board.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let user: AuthUser = null;
	let isLoggedIn: boolean = false;
	authStoreSub((data) => {
		if (data.isLoggedIn && data.user) {
			user = data.user;
			isLoggedIn = data.isLoggedIn;
		}
	});
</script>

<Board />
<p>{data.room.id}</p>
