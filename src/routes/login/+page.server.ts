import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (event) => {
	const user = event.locals.user;

	if (user) {
		throw redirect(302, '/guarded');
	}
}

export const actions: Actions = {
	default: async (event) => {
		let url = "http://127.0.0.1:8000/api/users/login/"
		let data = {
			"username" : "ellie",
			"password" : "pdC5s9QzGyKRVypYxvrvxnEUPu57WLFmgbH6SF5RXW244Sd6MgLCeZ6kBY7j5oTS"
		}

		const packet = {
			headers: { "content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}


		await event.fetch(url, packet).then((response) => response.json()).then((out) => {
			console.log(out);

			event.cookies.set('AccessToken', `${out['access']}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 86400 /* 1 day */
			})
		
			event.cookies.set('RefreshToken', `${out['refresh']}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 86400 /* 1 day */
			})
		})
	}
}
