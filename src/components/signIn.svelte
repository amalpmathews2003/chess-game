<script lang="ts">
	import { GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth';
	import { firebaseStoreSub, updateAuthStore } from '../store';

	let auth: Auth;
	firebaseStoreSub((value) => {
		auth = value.auth;
	});
	async function loginWithGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			const res = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(res);
			if (!credential) throw Error();
			const token = credential.accessToken;
			const user = res.user;
			console.log(user);
			updateAuthStore({
				user,
				isLoggedIn: user != null
			});
		} catch (error) {
			console.log(error);
		}
	}
</script>

<button on:click={loginWithGoogle}>Sign In With Google</button>
