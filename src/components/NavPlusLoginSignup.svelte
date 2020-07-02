<script>
    import Nav from '../components/nav/Nav.svelte';
    import SignUp from '../components/signinandup/SignUp.svelte';
    import Login from '../components/signinandup/Login.svelte';
    import VerifyCode from '../components/signinandup/VerifyCode.svelte';
    import SignUpResults from '../components/signinandup/SignUpResults.svelte';
    import ForgotEmail from '../components/signinandup/ForgotEmail.svelte';
    import ForgotSuccess from '../components/signinandup/ForgotSuccess.svelte';

    import { goto, stores } from '@sapper/app';
    import { createEventDispatcher } from 'svelte';

    const { session } = stores();

    const dispatch = createEventDispatcher()

    export let displayLogIn = false;
    export let displaySignUp = false;
    
    // location to redirect to after signup or login operation 
    // completes successfully. Can be set from outside.
    export let redirection = '/user';
    
    let displayForgotEmail = false;
    let displayForgotSuccess = false;
    let forgotEmailSuccess;

    let displaySignUpResults = false;
    let displayVerifyCode = false;
    let email;
    let signUpSession;
    let verifyResults;
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
    on:sentcode = {(event) => {
        email = event.detail.email;
        signUpSession = event.detail.session;
        displaySignUp = false;
        displayVerifyCode = true;
        }
    }
/>

<VerifyCode
    display={displayVerifyCode}
    {email}
    on:success={(event)=>{
        displayVerifyCode = false;
        displaySignUpResults=true;
        verifyResults = {session: signUpSession , msg:event.detail};
    }}
    on:close={()=>{
        displayVerifyCode = false;
        goto(redirection);
        session.set(signUpSession); 
    }}
/>

<SignUpResults
    display = {displaySignUpResults}
    gotoURL = {redirection}
    {verifyResults}
    on:ok={() => displaySignUpResults = false}
/>

<ForgotEmail
    display = {displayForgotEmail}
    on:forgotclose={() => displayForgotEmail = false}
    on:forgotemailsuccess = {(event) => {
        forgotEmailSuccess = event.detail;
        displayForgotEmail = false;
        displayForgotSuccess = true;
        }
    }
/>

<ForgotSuccess
    message = {forgotEmailSuccess}
    display = {displayForgotSuccess}
    on:forgotclose={() => displayForgotSuccess = false}
/>