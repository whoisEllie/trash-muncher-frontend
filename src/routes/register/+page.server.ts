import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({request}) => {

		const formData = await request.formData();

		let url = "http://38.242.137.81:8000/api/users/player-register/"
		let data = {
			"user": {
				"username": formData.get('username'),
				"first_name": formData.get('fname'),
				"last_name": formData.get('lname'),
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

		await fetch (url, packet).then((response) => response.json()).then((out) => {
			console.log(out);
		
			throw redirect(302, '/login');
		});
	}
}
