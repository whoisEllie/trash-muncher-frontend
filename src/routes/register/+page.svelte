<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<form class="form" method="POST" use:enhance>
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
  { #if form?.error }
    <div class="notice-error">
      {form.error}
    </div>
  {/if}
</form>

<style>
	
	.form {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

</style>
