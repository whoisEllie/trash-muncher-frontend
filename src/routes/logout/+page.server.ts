import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async (event) => {
	
	/*let url = "http://127.0.0.1:8000/api/users/logout/"

	const packet: RequestInit = {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Authorization": `Bearer ${event.cookies.get('AccessToken')}`
		},
		method: "POST",
		mode: "cors"
	}

	await event.fetch(url, packet).then((response) => response.json()).then((out) => {
		console.log(out)
	})*/

	event.cookies.delete('AccessToken');	
	event.cookies.delete('RefreshToken');

	throw redirect(301, '/');

}) satisfies PageServerLoad;
