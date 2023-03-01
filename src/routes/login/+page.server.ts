import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const actions = {
	default: async (event) => {
		let url = "http://127.0.0.1:8000/api/users/login/"
		let data = {
			"username" : "ellie",
			"password" : "pdC5s9QzGyKRVypYxvrvxnEUPu57WLFmgbH6SF5RXW244Sd6MgLCeZ6kBY7j5oTS"
		};

		const packet = {
			headers: { "content-type" : "application/json; charset=UTF-8"},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		};

		event.fetch (url, packet).then((response) => handleReturn(response.json()));
	}
}


async function handleReturn(data) {
	console.log("Data return!");
	const response = await fetch("http://127.0.0.1:8000/api/users/csrf")
	console.log(response)
}

