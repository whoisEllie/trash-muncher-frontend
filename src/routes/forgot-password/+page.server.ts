import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({request}) => {

		const formData = await request.formData();	
		var message;

		let url = "http://38.242.137.81:8000/api/users/password-reset/"
		let data = {
			"email": formData.get('email')
		}

		const packet: RequestInit = {
			headers: { "content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}

		await fetch(url, packet).then((response) => response.json()).then((out) => {
			if (out['message'] === 'No user with that email') {
				return {
					success: true,
					message: message
				}
			} else {
				message = "Success. Check your email and follow the link from there."
				return {
					success: true,
					message: message
				}
			}
		})
		
		message = "Success. Check your email and follow the link from there."
		return {
			success: true,
			message: message
		}
	}
}
