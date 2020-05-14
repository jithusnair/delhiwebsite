<script>
    import Nav from '../components/nav/Nav.svelte';
    import SignUp from '../components/signinandup/SignUp.svelte';
    import Login from '../components/signinandup/Login.svelte';
    import SignUpResults from '../components/signinandup/SignUpResults.svelte';
    import ForgotEmail from '../components/signinandup/ForgotEmail.svelte';
    import ForgotToken from '../components/signinandup/ForgotToken.svelte';
    
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let displayLogIn = false;
    
    
    let displayForgotEmail = false;
    let displayForgotToken = false;
    let displayForgotSuccess = false;
    let forgotemailsuccess;
    let forgottokensuccess;
    

    export let displaySignUp = false;

    let displaySignUpResults = false;
    let signUpResults;
</script>

<Nav on:navlogin/>

<Login 
    display = {displayLogIn}
    on:signupopen
    on:loginclose
    on:forgotopen = {()=> {
            displayForgotEmail = true;
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
    display = {displayForgotEmail}
    on:forgotclose={() => displayForgotEmail = false}
    on:forgotemailsuccess = {(event) => {
        forgotemailsuccess = event.detail.text;
        displayForgotToken = true;
        }
    }
/>

<ForgotToken
    {forgotemailsuccess}
    display = {displayForgotToken}
    on:forgotclose={() => displayForgotToken = false}
    on:forgottokensuccess = {(event) => {
        forgottokensuccess = event.detail.text;
        displayForgotSuccess = true;
        }
    }
/>