import type { PageServerLoad } from "./$types"
import type { Actions } from './$types'

let authkey;

export const load = (async (event) => {
	let url = "http://38.242.137.81:8000/api/images/list-images/"
	// get authkey to pass after load
	authkey = `Bearer ${event.cookies.get('AccessToken')}`
	
	const packet: RequestInit = {
	headers: {
		"content-type": "application/json; charset=UTF-8",
		"Authorization": `Bearer ${event.cookies.get('AccessToken')}`
	},
	method: "GET",
	mode: "cors"
	}

	const key = event.cookies.get('AccessToken')
	const imageData = await event.fetch(url, packet).then((response) => response.json());
	
	return {
		// return images for client side
		images: imageData,
		auth: key
	}
})

export const actions : Actions = {
	accept: async ({ request }) => {
		// get form data to pass into API
		const data = await request.formData();
		let pack = {
			"id": Number(data.get("id"))
		}
		await fetch("http://38.242.137.81:8000/api/images/delete-image/", {
			method: 'POST',
			body: JSON.stringify(pack),
			mode: "cors",
			headers: {
				"content-type": "application/json; charset=UTF-8",
				"Authorization": authkey
			}
		})
	},
	deny: async ({ request }) => {
		let success;
		const data = await request.formData();
		let pack = {
			"id": Number(data.get("id"))
		}
		await fetch("http://38.242.137.81:8000/api/images/delete-image/", {
			method: 'POST',
			body: JSON.stringify(pack),
			mode: "cors",
			headers: {
				"content-type": "application/json; charset=UTF-8",
				"Authorization": authkey
			}
		}).then((response) => response.json()).then(out => {
			if (out["message"] == "Image with specified ID does not exist") {
				success = false;
			} else {
				success = true;
			}
		});

		// updates team score based on given team
		let team
		if (Number(data.get("team")) == 1) {
			team = "T1Score"
		} else if (Number(data.get("team")) == 2){
			team = "T2Score"
		} else {
			team = "T3Score"
		}

		let pack2 = {
			"TM_ID": Number(data.get("tm")),
			[team]: 1
		}
		
		if(success) {
			// sends request
			await fetch("http://38.242.137.81:8000/api/monsters/remove-score", {
				method: 'POST',
				body: JSON.stringify(pack2),
				mode: "cors",
				headers: {
					"content-type": "application/json; charset=UTF-8",
					"Authorization": authkey
				}
			})
		}
	}
}