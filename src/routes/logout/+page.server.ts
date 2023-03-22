import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async (event) => {
	
	let url = "http://38.242.137.81:8000/api/users/logout/"

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
