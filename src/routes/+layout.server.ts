import type { LayoutServerLoad } from "./$types"

export const load = (async (event) => {

	let login_status: Boolean = false;
	let username: String = ""

	let url = "http://38.242.137.81:8000/api/users/me/"

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
			})

			return {
				logged_in: login_status,
				username: username,
			};
		} catch (error) {
		
		}
		
}) satisfies LayoutServerLoad;
