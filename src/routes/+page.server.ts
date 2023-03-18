export const load = (async (event) => {

	let login_status: Boolean = false;
	let gamekeeper: Boolean = false;

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
				if(out["user"]["is_gamekeeper"] == true) {
					gamekeeper = true;			
				}
			})

			return {
				gamekeeper: gamekeeper 
			};
		} catch (error) {
		
		}
		
}) satisfies LayoutServerLoad;
