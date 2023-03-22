import {redirect} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"
import type { Actions } from './$types'

let cookies;

export const load = (async (event) => {
	cookies = `Bearer ${event.cookies.get('AccessToken')}`
	let login_status: Boolean = false;
	let username: String = ""
	let monsters= [];

	let url = "http://38.242.137.81:8000/api/users/me/"

	const packet: RequestInit = {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Authorization": cookies
		},
		method: "GET",
		mode: "cors"
		}

		try {
			await event.fetch(url, packet).then((response) => response.json()).then(async (out) => {
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

				url="http://38.242.137.81:8000/api/monsters/get-tms"
				await event.fetch(url,packet).then((response) => response.json().then((out) => {
					monsters=out;
				}))
			})

			return {
				logged_in: login_status,
				username: username,
				monsters:monsters, 
			};
		} catch (error) {
			throw redirect(302, '/login')
		}
		
		
}) satisfies PageServerLoad;

export const actions: Actions = {
	//creates a new monster
	newMonster: async ({request}) => {
		let success, message
		// Returns data from the submitted form
		const formData = await request.formData();

		let url = "http://38.242.137.81:8000/api/monsters/add-tm"
		const data = {
			"TM_Name":formData.get("TM_Name"),
			"Longitude":formData.get("longitude"),
			"Latitude":formData.get("latitude")
		};

		const packet: RequestInit = {
			headers: {
				"content-type": "application/json; charset=UTF-8",
				"Authorization": cookies
			},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}
		
		try {
			await fetch(url, packet).then((response) => {
				if(response["status"] == 200) {
					success = true
					message = "Monster successfully created!"
				} else {
					success = false
					message = "An error has occurred. Please try again."
				}
			})
		} catch(error) {
			return {
				success: false,
				message: "An error has occurred. Please try again"
			}
		}
		return {
			success: success,
			message: message
		}
	},

	//changes the entire score for the monster
	updateScore: async ({cookies, request}) => {
		let success, message
		const formData = await request.formData();
		const data = {
			"TM_ID":formData.get("id"),
			"T1Score":formData.get("t1score"),
			"T2Score":formData.get("t2score"),
			"T3Score":formData.get("t3score")
		};
		let url = "http://38.242.137.81:8000/api/monsters/change-score"

		const packet: RequestInit = {
			headers: {
				"content-type": "application/json; charset=UTF-8",
				"Authorization": `Bearer ${cookies.get('AccessToken')}`
			},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}
		try {
			await fetch(url, packet).then((response) => {
				if(response["status"] == 200) {
					success = true
					message = "Score successfully updated!"
				} else {
					success = false
					message = "An error has occurred. Please try again."
				}
			})
		} catch(error) {
			return {
				success: false,
				message: "An error has occurred. Please try again"
			}
		}
		return {
			success: success,
			message: message
		}
	},
	//adds the score passed in to the monster
	addScore: async ({cookies, request}) => {
		let success, message
		const formData = await request.formData();
		const data = {
			"TM_ID":Number(formData.get("id")),
			"T1Score":Number(formData.get("t1score")),
			"T2Score":Number(formData.get("t2score")),
			"T3Score":Number(formData.get("t3score"))
		};
		let url = "http://38.242.137.81:8000/api/monsters/add-score"

		const packet: RequestInit = {
			headers: {
				"content-type": "application/json; charset=UTF-8",
				"Authorization": `Bearer ${cookies.get('AccessToken')}`
			},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}
		try {
			await fetch(url, packet).then((response) => {
				if(response["status"] == 200) {
					success = true
					message = "Score successfully added!"
				} else {
					success = false
					message = "An error has occurred. Please try again."
				}
			})
		} catch(error) {
			return {
				success: false,
				message: "An error has occurred. Please try again"
			}
		}
		return {
			success: success,
			message: message
		}
	}
	
}

