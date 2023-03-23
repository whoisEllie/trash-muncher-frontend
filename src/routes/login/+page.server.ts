import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({cookies, request}) => {

		const formData = await request.formData();	

		let url = "https://api.trashmunchers.co.uk/api/users/login/"
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

		let success, message

		try {
			await fetch(url, packet).then((response) => response.json()).then((out) => {
	
				if (out['message'] === 'Invalid username or password!!') {
					success = false;
					message = "Invalid username or password!"
				} else {
					try{
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
					}
					catch{
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
					}	
					if (out["message"] == "Logged in successfully") {
						throw redirect(302, '/');
					} else {
						success = false;
						message = "An error has occurred."
					}
				}
			})	
			if (success == false) {
				return {
					success: success,
					message: message
				}
			}
		} catch(error) {
			if (error["status"] == 302) {
				throw redirect(302, '/')
			} else {
				return {
					success: false,
					message: "Unexpected error!"
				}
			}
		}
	}
}
