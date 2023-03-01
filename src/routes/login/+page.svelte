<script lang="ts">
	import { post, browserSet, browserGet} from '$lib/utils/requestUtils';
	import { goto } from '$app/navigation';
	import { variables } from '$lib/utils/constants';
	import { onMount } from 'svelte';

	import type { UserResponse } from '$lib/interfaces/user.interface';
	import type { CustomError } from '$lib/interfaces/error.interface';
	import { changeText } from '$lib/helpers/buttonText';
  import {error} from '@sveltejs/kit';

	let email = '',
			password = '',
			errors: Array<CustomError>;

	const handleLogin = async () => {
		if (browserGet('refreshToken')) {
			localStorage.removeItem('refreshToken');
		}
		const [jsonRes, err] = await post(fetch, `${variables.BASE_API_URI}/login/`, {
			user: {
				email: email,
				password: password
				}
			});	
			const response: UserResponse = jsonRes;

			if (err.length > 0) {
				errors = err;
			} else if (response.user) {
				if (response.user.tokens && response.user.tokens.refresh) {
					browserSet('refreshToken', response.user.tokens.refresh);
				}
				await goto('/');
			}
	}

</script>
