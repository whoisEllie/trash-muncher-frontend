import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

var success = false;
export const actions: Actions = {
	default: async ({request, query}) => {
		const formData = await request.formData();
		let path = formData.get('path')
		var message;
		
		const params = new URLSearchParams(path.substring(path.indexOf("?")))
		const token = params.get('token')
		
		if (formData.get('password') !== formData.get('cpassword')) {
			message = "Passwords must match!"
			return {
				success: false,
				message: message
			}
		}		

		let url = "http://38.242.137.81:8000/api/users/password-reset/confirm/"
		let data = {
			"password": formData.get('password'),
			"token": token
		}

		const packet: RequestInit = {
			headers: { "content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}

		await fetch(url, packet).then((response) => response.json()).then((out) => {
			var checkMessage = out['detail']
			if (typeof checkMessage !== 'undefined') {
				message = "Token not found."
				success = false;
			} else {
				message = "Success. You will be redirected to the login page shortly."
				success = true;
			}
		})
		
		return {
			success: success,
			message: message
		}
	}
}