<script lang="ts">
	import { authStoreSub, createRoom, type AuthUser } from '../store';
	import SignIn from '../components/signIn.svelte';
	import { goto } from '$app/navigation';

	let isLoggedIn: boolean = false;
	let user: AuthUser = null;
	authStoreSub((data) => {
		if (data.isLoggedIn && data.user) {
			user = data.user;
			isLoggedIn = data.isLoggedIn;
		}
	});
	async function playFriendly() {
		if (!user) return;
		const docRef = await createRoom({
			user1: user.uid,
			fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
		});
		goto(docRef.id);
	}
</script>

<h1>Hello</h1>
<button><a href="/ai">Play with ai </a> </button>

{#if isLoggedIn && user != null}
	<p>{user.email}</p>
	<button on:click={playFriendly}>Play a friendly match</button>
{:else}
	<SignIn />
{/if}
