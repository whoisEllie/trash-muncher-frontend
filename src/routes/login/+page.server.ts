import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({cookies, request}) => {

		const formData = await request.formData();	

		let url = "http://127.0.0.1:8000/api/users/login/"
		let data = {
			"username" : formData.get('username'),
			"password" : formData.get('password') 
		}

		const packet: RequestInit = {
			headers: { "content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}


		await fetch(url, packet).then((response) => response.json()).then((out) => {
			console.log(out);

			if (out['message'] === 'Invalid username or password!!') {
				console.log("Invalid username and shit lol")
				return;
			}

			cookies.set('AccessToken', `${out['access']}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 86400 /* 1 day */
			})
		
			cookies.set('RefreshToken', `${out['refresh']}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 86400 /* 1 day */
			})

			throw redirect(302, '/');
		})			
	}
}
