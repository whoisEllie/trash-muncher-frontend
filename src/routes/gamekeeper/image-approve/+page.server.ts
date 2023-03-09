export const load = (async (event) => {
	let url = "http://38.242.137.81:8000/api/images/list-images/"
	
	const packet: RequestInit = {
	headers: {
		"content-type": "application/json; charset=UTF-8",
		"Authorization": `Bearer ${event.cookies.get('AccessToken')}`
	},
	method: "GET",
	mode: "cors"
	}

	const imageData = await event.fetch(url, packet).then((response) => response.json());
	
	return {
		images: imageData
	}
})