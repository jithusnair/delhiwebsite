<script>
    import Nav from '../components/nav/Nav.svelte';
    import SignUp from '../components/signinandup/SignUp.svelte';
    import Login from '../components/signinandup/Login.svelte';

    export let displayLogIn = false;
    export let displaySignUp = false;
</script>

<Nav on:navlogin/>

<Login 
    display = {displayLogIn}
    on:signupopen
    on:loginclose
/>

<SignUp
    display = {displaySignUp}
    on:loginopen
    on:signupclose
/>