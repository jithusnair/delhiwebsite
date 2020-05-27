<script>
    import Nav from '../components/nav/Nav.svelte';
    import SignUp from '../components/signinandup/SignUp.svelte';
    import Login from '../components/signinandup/Login.svelte';
    import SignUpResults from '../components/signinandup/SignUpResults.svelte';
    import ForgotEmail from '../components/signinandup/ForgotEmail.svelte';
    import ForgotToken from '../components/signinandup/ForgotToken.svelte';
    import ForgotSuccess from '../components/signinandup/ForgotSuccess.svelte';
    
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let displayLogIn = false;
    export let displaySignUp = false;
    
    export let redirection = '/user';
    
    let displayForgotEmail = false;
    let displayForgotToken = false;
    let displayForgotSuccess = false;
    let forgotEmailSuccess;
    let forgotTokenSuccess;

    let displaySignUpResults = false;
    let signUpResults;
</script>

<Nav on:navlogin/>

<Login 
    display = {displayLogIn}
    gotoURL = {redirection}
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
    gotoURL = {redirection}
    {signUpResults}
    on:close={() => displaySignUpResults = false}
/>

<ForgotEmail
    display = {displayForgotEmail}
    on:forgotclose={() => displayForgotEmail = false}
    on:forgotemailsuccess = {(event) => {
        forgotEmailSuccess = event.detail;
        displayForgotToken = true;
        }
    }
/>

<ForgotToken
    {forgotEmailSuccess}
    display = {displayForgotToken}
    on:forgotclose={() => displayForgotToken = false}
    on:forgottokensuccess = {(event) => {
        forgotTokenSuccess = event.detail;
        displayForgotSuccess = true;
        }
    }
/>

<ForgotSuccess
    {forgotTokenSuccess}
    display = {displayForgotSuccess}
    on:forgotclose={() => displayForgotSuccess = false}
/>