import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({cookies, request}) => {

		const formData = await request.formData();
					
		let message, success, status
		let password = formData.get("confirm-password")
		
		if (password != formData.get('password')) {
			message = "Passwords must match!"
			return	{
				success: false,
				message: message
			}
		} else {
			let url = "http://38.242.137.81:8000/api/users/player-register/"
			let data = {
				"user": {
					"username": formData.get('username'),
					"email": formData.get('email'),
					"password": formData.get('password'),
					"is_gamekeeper": false
				},
				"team": {
					"name": formData.get('team')
				}
			};
	
			const packet: RequestInit = {
				headers: { "content-type" : "application/json; charset=UTF-8"},
				body: JSON.stringify(data),
				method: "POST",
				mode: "cors"
			};
			try {
				await fetch (url, packet).then((response) => response.json()).then((out) => {
					if (typeof out["user"] !== "undefined") {
						if (out["user"]["username"] == "A user with that username already exists.") {
							message = "User already exists!"
							success = false
						}
						else if (out["user"]["email"] == "user with this email already exists.") {
							message = "Email in use!"
							success = false
						}
					} else {
						if (out == "Invalid input.") {
							message = "Password must be more secure!"
							success = false
						} else {
							success = true
						}
					}
				});
			} catch (error) {
				message = "An error has occurred."
				return {
					message: message,
					success: false
				}
			}
			
			if (success == false) {
				return {
					message: message,
					success: false
				}
			} else {
				let url = "http://38.242.137.81:8000/api/users/login/"
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
	}
}