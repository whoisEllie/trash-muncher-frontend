<script lang="ts">
	import type { LayoutData } from "../$types";	
	import { onMount } from 'svelte';
	export let form
	
	onMount(async () => {
		//throw user back to index if they enter this page
		window.location.replace('/')
	});
</script>
