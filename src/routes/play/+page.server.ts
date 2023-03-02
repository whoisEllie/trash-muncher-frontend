import {redirect} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"

export const load = (async (event) => {

	let login_status: Boolean = false;
	let username: String = ""

	let url = "http://127.0.0.1:8000/api/users/me/"
	console.log(event.cookies.get('AccessToken'))

	const packet: RequestInit = {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Authorization": `Bearer ${event.cookies.get('AccessToken')}`
		},
		method: "GET",
		mode: "cors"
		}

		try {
			await event.fetch(url, packet).then((response) => response.json()).then((out) => {

				if (out['detail'] === 'Authentication credentials were not provided.')
				{
					throw redirect(302, '/login')
					return;
				}
				if (out['code'] === "token_not_valid")
				{
					throw redirect(302, '/login')
					return;
				}
					
				username = out['user']['username']
				login_status = true;
			})

			return {
				logged_in: login_status,
				username: username 
			};
		} catch (error) {
			throw redirect(302, '/login')
		}
		
}) satisfies PageServerLoad;
