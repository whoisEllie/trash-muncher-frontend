<script lang="ts">
  import type { PageData } from "../$types";

  export let data: PageData;
</script>

<form class="form" method="POST">
  <h1>{data.tastyCookie}</h1>
  <label>
   	Username 
    <input name="username" type="text">
  </label>
  <label>
   	First Name	
    <input name="username" type="text">
  </label>
  <label>
   	Last Name	
    <input name="username" type="text">
  </label>
  <label>
    Password
    <input name="password" type="password">
  </label>
  <label>
   	Confirm Password 
    <input name="confirm-password" type="password">
  </label>
	<label>
		Choose a team!
		<select name="team">
			<option type="">Red</option>
			<option type="">Blue</option>
			<option type="">Green</option>
		</select>
	</label>
  <button>Register</button>
</form>

<style>
	
	.form {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

</style>
