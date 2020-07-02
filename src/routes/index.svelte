<script context="module">
    export async function preload(page, session) {
		const { user } = session;

		if (user) {
            if(user.isAdmin) return this.redirect(302, '/admin');
            else return this.redirect(302,'/user');
        }
	}
</script>

<script>
    import NavPlusLoginSignup from '../components/NavPlusLoginSignup.svelte';
    import ForgotSuccess from '../components/signinandup/ForgotSuccess.svelte';
    import Slide from '../components/ui/Slide.svelte';

    let displayLogIn = false;
    let displaySignUp = false;
</script>

<style>
    .btn {
        border:none;
        border-radius: 50px;
        box-shadow: 0 2px 3px 0 rgba(91,22,170,.3);
        -webkit-appearance:none;
        text-align:center;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 2rem;
        padding: 1.15rem 2.7rem;
        background-image:linear-gradient(to right,rgb(208, 55, 255),rgb(91, 72, 255),rgb(91, 72, 255),rgb(208, 55, 255));
        background-size:300% 100%;
        -moz-transition:all .4s ease-in-out;
        -o-transition:all .4s ease-in-out;
        -webkit-transition:all .4s ease-in-out;
        transition:all .4s ease-in-out;
    }

    .btn:hover {
        background-position:100% 0;
        -moz-transition:all .4s ease-in-out;
        -o-transition:all .4s ease-in-out;
        -webkit-transition:all .4s ease-in-out;
        transition:all .4s ease-in-out;
    }

    p,a,button{
        font-size: 1.6rem;
        line-height: 2.6rem;
        color: var(--text);
    }

    button{
        font-family: 'Roboto', sans-serif;
        outline: none;
        cursor: pointer;
    }

    a{
        text-decoration: none;
    }

    ::placeholder{
        font-family: 'Roboto', sans-serif;  
    }

    .main-section{
        padding: 0 10%;
        height: 100vh;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .main-content{
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 10;
    }
    .heading{
        color: var(--heading);
        font-size: 5rem;
        font-weight: 700;
        line-height: 5.5rem;
        padding: 0 0 4rem 0;
    }
    .hero-text{
        z-index: 5;
    }
    .btn-container{
        padding: 4rem 0;
    }
    .register-btn{
        margin-right: 4rem;
        background: #3D0CFF;
        border-radius: 5px;
        box-shadow: none;
    }
    .course-link{
        font-weight: 600;
    }
    .hero-img{
        width: 70%;
    }
    /* End Of Main Section Styles */

    @media screen and (max-width: 850px){
        /*main section style*/
        .main-content{
            width: 100%;
            padding: 5% 0;
            align-items: center;
            text-align: center;
            justify-content: flex-start;
        }
        .hero-img{
            width: 100%;
            max-width: 80%;
        }
        .heading{
            font-size: 3.5rem;
            padding: 2.5rem 0;
        }
        .btn-container{
            padding: 2.5rem 0;
        }

        .main-section {
            margin: 10rem auto;
            height: auto;
            flex-direction: column-reverse;
        }
        /*End of Main section*/
    }
    @media screen and (max-width: 500px){
        /*Main Section*/
        .main-section{
            padding: 0 5% 40px 5%;
        }
        .main-content{
            align-items: center;

        }
        .heading{
            line-height: 4rem;
        }
        .hero-img{
            top: 15%;
            height: 30%;
        }
        .btn-container{
            padding: 2rem 0;

        }
        /*End of main section*/
    }

    @media screen and (min-width: 1300px) {
        .main-section {
            height: 80vh;
        }
    }
</style>

<NavPlusLoginSignup
    {displayLogIn}
    {displaySignUp}
    on:navlogin={() => displayLogIn = true}
    on:signupopen = { () => {
        displayLogIn = false;
        displaySignUp = true;
    }}
    on:loginclose={() => displayLogIn = false}
    on:loginopen = { () => {
        displaySignUp = false;
        displayLogIn = true;
    }}
    on:signupclose={() => displaySignUp = false}
/>

<Slide data={[{img:'/images/slideshow/1.jpg', link:'/onlineclass/5ef5945f83cdb410551501a3'},{img:'/images/slideshow/2.jpg'}]}/>

<!-- Start of Main section -->
<section class="section main-section">   
	<div class="main-content">
		<h2 class="heading">Watch, Learn, Succeed</h2>
		<p class="hero-text">
        Online video courses in the market designed by experts 
        to make your competatitve exam preparations a cakewalk. 
        <br>
        What are you waiting for? Join today!</p>
		<div class="btn-container">
			<button 
                class="btn register-btn"
                on:click={() => displaySignUp = true}
                >
                Register Now
            </button>
			<a href="/onlineclass" class="course-link">View Courses</a>
		</div>
	</div>
	<img src="/images/index/covid_special.jpg" alt="video course" class="hero-img">
</section>
<!-- End Of Main Section -->