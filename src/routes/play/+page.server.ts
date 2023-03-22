import {redirect, type RequestHandler} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"
import type { Actions } from './$types'
//import { json } from '@sveltejs/kit'

let authkey;
export const load = (async (event) => {

	let login_status: Boolean = false;
	let username: String = ""
	let team;
	let monsters= [];
	authkey = `Bearer ${event.cookies.get('AccessToken')}`

	let url = "http://38.242.137.81:8000/api/users/me"

	const packet: RequestInit = {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Authorization": `Bearer ${event.cookies.get('AccessToken')}`
		},
		method: "GET",
		mode: "cors"
		}

	
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
				if (out['code'] === "user_not_found")
				{
					throw redirect(302, '/login')
					return;
				}
				if (out['user'].is_gamekeeper == true)
				{
					throw redirect(302, '/')
					return;
				}	
				

				username = out['user']['username']
				team = out['team']['name']
				
				login_status = true;

				url="http://38.242.137.81:8000/api/monsters/get-tms"
				await event.fetch(url,packet).then((response) => response.json().then((out) => {
					monsters=out;
				}))
			})
			return {
				logged_in: login_status,
				username: username,
				monsters: monsters,
				team_id: team,
				cookie: authkey
			};
		
		
		
}) satisfies PageServerLoad;



export const actions: Actions = {
	addScore: async ({cookies, request}) => {
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
		await fetch(url, packet)
	},
	
	uploadImage: async ({cookies, request}) => {
		
		const data = await request.formData();
		let inRange = false
		let success, message
		if (data.get('image') != "" && data.get("tm") != "undefined"){
			let team, teamID
			if (data.get("team") == "Red") {
				team = "T1Score"
				teamID = 1
			} else if (data.get("team") == "Green"){
				team = "T2Score"
				teamID = 2
			} else {
				team = "T3Score"
				teamID = 3
			}
			let pack = {
				"TM_ID": Number(data.get("tm")),
				[team]: 1
			}
			let location = {
				"TM_ID": Number(data.get("tm")),
				"o-lat": data.get("lat"),
				"o-long": data.get("lng")
			}

			await fetch("http://38.242.137.81:8000/api/monsters/verify-distance", {
			method: 'POST',
			body: JSON.stringify(location),
			mode: "cors",
			headers: {
				"content-type": "application/json; charset=UTF-8",
				"Authorization": authkey
				}
			}).then((response) => response.json()).then(out => {
				if (out == true) {
					inRange = true
				}
			})
		
			if (inRange) {
							
				let pack2 = {
					"b64_img": data.get("image"),
					"monster_id": data.get("tm"),
					"team": teamID
				}
				
				const formData  = new FormData();
				for (const name in pack2) {
					formData.append(name, pack2[name]);
				}
				
				let url = "http://38.242.137.81:8000/api/images/submit-image/"
				const packet: RequestInit = {
					headers: {
						"Authorization": authkey
					},
					body: formData,
					method: "POST",
					mode: "cors"
				}
				
				try {
					await fetch(url, packet).then((response) => {
						console.log(response)
						if (response["status"] == 429) {
							success = false
							message = "Please wait at least 8 hours between image submissions!"
						} else if (response["status"] == 201) {
							success = true
							message = "Image successfully uploaded!"
						} else {
							success = false
							message = "An error has occurred. Please try again"
						}
					})
					if(success==false){
					return {
						image: data.get("image"),
						success: success,
						message: message
					}
				}
				} catch(error) {
					success = false
					return {
						image: data.get("image"),
						success: false,
						message: "An error has occurred. Please try again"
					}
				}
				if (success == true) {
					await fetch("http://38.242.137.81:8000/api/monsters/add-score", {
					method: 'POST',
					body: JSON.stringify(pack),
					mode: "cors",
					headers: {
						"content-type": "application/json; charset=UTF-8",
						"Authorization": authkey
						}
					})
				}
			} else {
				return {
					image: data.get("image"),
					success: false,
					message: "Too far away from selected monster!"
				}
			}
		}else{
			return {
				image: data.get("image"),
				success: false,
				message: "Please select both an image and monster!"
			}
		}
	}
}
