<script>
    import Nav from '../components/nav/Nav.svelte';
    import SignUp from '../components/signinandup/SignUp.svelte';
    import Login from '../components/signinandup/Login.svelte';
    import SignUpResults from '../components/signinandup/SignUpResults.svelte';
    import ForgotEmail from '../components/signinandup/ForgotEmail.svelte';
    
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let displayLogIn = false;
    export let displaySignUp = false;
    
    let displayForgot = false;

    let displaySignUpResults = false;
    let signUpResults;
</script>

<Nav on:navlogin/>

<Login 
    display = {displayLogIn}
    on:signupopen
    on:loginclose
    on:forgotopen = {()=> {
            displayForgot = true;
        }
    }
/>

<SignUp
    display = {displaySignUp}
    on:loginopen
    on:signupclose
    on:signupsuccess = {(event) => {
        signUpResults = event.detail;
        displaySignUpResults = true;
        }
    }
/>

<SignUpResults
    display = {displaySignUpResults}
    {signUpResults}
    on:close={() => displaySignUpResults = false}
/>

<ForgotEmail
    display = {displayForgot}
    on:forgotclose={() => displayForgot = false}
/>