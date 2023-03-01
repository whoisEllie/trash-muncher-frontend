<script lang="ts">
	import { post, browserSet, brwoserGet } from '$lib/requestUtils';
	import { BASE_API_URI } from '$lib/constants'
	import { onMount } from 'svelte';

	let email = '',
			password = '',
			error;

	const handleLogin = async () => {
		if (brwoserGet('refreshToken')) {
			localStorage.removeItem('refreshToken');
		}
		const [jsonRes, err] = await post(fetch, `${BASE_API_URI}/login/`, {
			user: {
				email: email,
				password: password
			});	
		}

</script>
