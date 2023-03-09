<script>

</script>

<div class="about-wrapper">
    <div class="split-grid">
        <div class="home_page">
            <div class="title">
              <p class="title-trash">TRASH</p>
              <p class="title-munchers">MUNCHERS</p>
            </div>
            <p class="description">A location based "cookie-clicker" type game to promote sustainability at the University of Exeter</p>
            <a class="start" href="/play">Let's go!</a>
        </div>
        <div class="about-card">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat null
            pariatur.<br><br>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br><br>This is some more dummy 
            text, nothing to see here.
        </div>
    </div>
	</div>

<style>

	* {
		/* clearing default paddings & margins */
		margin: 0px;
		padding: 0px;
	}

	.about-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		bottom: 0px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

    .split-grid {
		max-width: 1280px;
	    display: grid;
	    grid-template-columns: repeat(2, 1fr);
    }

    .about-card {
	    min-width: 300px;
			max-width: 400px;
	    height: 100%;
	    border-radius: 15px;
	    background-color: #E0E0E0;
	    padding: 15px;
	    margin: 0rem 3rem;
	    font-family: 'Montseratt', sans-serif;
	    box-shadow: 0px 0px 16px #00000044;
	 }

	.home_page {
		display: flex;
		flex-direction: column;
	}

	.title {
		display: grid;
		grid-template-rows: repeat(2, 1fr);
		font-family: "Bubbler One", sans-serif;
		font-size: 6rem;
		letter-spacing: 7px;
		text-align: center;
		margin: 15px 4rem;
	}

	.title-trash {
		font-weight: bold;
		transform: translate(-8rem, 1rem);
	}

	.title-munchers {
		transform: translate(3rem, 0rem);
	}
	
	.description {
		text-align: center;
		font-family: 'Chilanka', cursive;
		font-size: 1rem;
		letter-spacing: 0.2vw;
	}
		
	.start {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 15px;
		font-family: 'Chilanka', cursive;
		font-size: 1.5rem;
		background-color: #B5D3D2;
		box-shadow: 0px 0px 16px #00000044;
		transition: all 0.5s;
		padding: 0 50px;
		min-width: 140px;
		max-width: 540px;
		height: 70px;
		margin: 25px auto;
		text-decoration: none;
		color: black;
	}

	.start:hover {
		background-color: #DFC9B5;
		border-radius: 25px;
		transition: all 0.5s ease 0.0s;
	}

	@media screen and (max-width: 950px) {

		.about-wrapper {
			margin-bottom: 5vh;
		}

		.about-card {
			margin: 0 1rem;
		}

		.split-grid {
			display: flex;
			flex-direction: column;
		}

		.title {
			margin: 0 0;
		}
	}

	@media screen and (max-width: 600px) {
		.title {
			font-size: 4rem;
		}	

		.title-trash {
			font-weight: bold;
			transform: translate(-4.25rem, 1rem);
		}

		.title-munchers {
			transform: translate(0.75rem, 0rem);
		}

		.about-wrapper {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding-top: 100px;
			overflow-y: scroll;
			overflow-x: hidden;
			height: 70vh;
		}
	}

	@media screen and (max-width: 350px) {
		.title {
			font-size: 3rem;
		}	

		.title-trash {
			font-weight: bold;
			transform: translate(-2.5rem, 1rem);
		}

		.title-munchers {
			transform: translate(0rem, 0rem);
		}

		.start {
			font-size: 1rem;
			min-width: 80px;
			height: 60px;
		}

		.about-card {
			min-width: 100px;
			max-width: 200px;
		}
	}

</style>
