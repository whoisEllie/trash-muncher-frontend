<script lang="ts">
	import type { LayoutData } from "../$types";	
	import { onMount } from 'svelte';
	export let form
	
	onMount(async () => {
		window.location.replace('/')
	});
</script>
