import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async (event) => {
	
	let url = "https://api.trashmunchers.co.uk/api/users/logout/"

	const packet: RequestInit = {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Authorization": `Bearer ${event.cookies.get('RefreshToken')}`
		},
		method: "GET",
		mode: "cors"
	}

	await event.fetch(url, packet)
	
	//delete cookies from browser
	event.cookies.delete('AccessToken');	
	event.cookies.delete('RefreshToken');

}) satisfies PageServerLoad;
