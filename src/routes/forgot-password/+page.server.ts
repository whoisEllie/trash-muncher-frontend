import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({request}) => {

		const formData = await request.formData();	
		var sendMessage, success;
		
		// get api endpoint
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

		try {
			await fetch(url, packet).then((response) => response.json()).then((out) => {
				// get response, check message thrown
				var message = out['email']
			
				if (typeof message !== 'undefined') {
					sendMessage = "Email does not match any user. Please try again."
					success = false
				} else if (out["status"] == "OK"){
					// if successful
					sendMessage = "Success. Check your email and follow the link from there."
					success = true
				} else {
					sendMessage = "An error has occurred."
					success = false
				}
			})
			
			// return to display on page
			return {
				message: sendMessage,
				success: success
			}
		} catch(error) {
			sendMessage = "An error has occurred."
			success = false
			
			return {
				message: sendMessage,
				success: success
			}
		}
	}
}
