import {redirect} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"
import type { Actions } from './$types'

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
				team_id: team
			};
		} catch (error) {
			throw redirect(302, '/login')
		}
		
		
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
				await fetch("http://38.242.137.81:8000/api/monsters/add-score", {
				method: 'POST',
				body: JSON.stringify(pack),
				mode: "cors",
				headers: {
					"content-type": "application/json; charset=UTF-8",
					"Authorization": authkey
					}
				})
				
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
	
	
				await fetch(url, packet).then((response) => response.json().then((out) => {
					console.log("success!")
				}))
			} else {
				console.log("not in distance")
			}
		}else{
			console.log("dne")
		}
	}
}
