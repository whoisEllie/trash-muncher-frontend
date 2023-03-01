<script lang="ts">
  import type { PageData } from "../$types";

  export let data: PageData;
</script>

<form class="form" method="POST">
  <label>
    Email
    <input name="email" type="email">
  </label>
  <label>
    Password
    <input name="password" type="password">
  </label>
  <button>Log in</button>
  <h1>{data.tastyCookie}</h1>
</form>

<style>
	
	.form {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

</style>
