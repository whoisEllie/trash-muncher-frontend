import type { LayoutServerLoad } from "./$types"
import type { Actions } from "@sveltejs/kit";

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

		await event.fetch(url, packet).then((response) => response.json()).then((out) => {
			console.log(out)

			if (out['detail'] === 'Authentication credentials were not provided.')
			{
				return;
			}
			if (out['code'] === "token_not_valid")
			{
				return;
			}
				
			username = out['user']['username']
			login_status = true;
			console.log(username)
		})

		return {
			logged_in: login_status,
			username: username 
		};

}) satisfies LayoutServerLoad;
