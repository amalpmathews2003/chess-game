<script lang="ts">
	import { onMount } from 'svelte';

	let isOnline: boolean = false;

	function toggle(e: Event) {
		isOnline = e.type == 'online' ? true : false;
	}
	onMount(() => {
		isOnline = window.navigator.onLine;
		window.addEventListener('offline', toggle);
		window.addEventListener('online', toggle);
    return ()=>{
      window.removeEventListener('offline',toggle)
      window.removeEventListener('online', toggle);
    }
	});
</script>

<div class="isOnline {isOnline && 'online'}" />

<style>
	.isOnline {
		width: 100vw;
		height: 100px;
		background-color: red;
	}
	.online {
		background-color: green;
	}
</style>
