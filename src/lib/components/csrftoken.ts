const csrftoken = getCookie('csrftoken');

const CSRFTOKEN = () =>{
	return (
		<input name="csrfmiddlewaretoken" value={csrftoken} type="hidden"/>
	);
};
