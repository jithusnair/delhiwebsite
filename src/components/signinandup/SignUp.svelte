<script>
    import { isEmpty, isSecure, isMobile, isValidEmail } from "../../_helpers/validation.js";
    
    import Modal from '../ui/Modal.svelte';
    import Loading from '../ui/Loading.svelte';
    import Error from '../ui/Error.svelte';
    
    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let display = false;

    let fullname = '';
    let username = '';
    let email = '';
    let mobile = '';
    let password = '';

    let touchedName = false;
    let touchedUsername = false
    let touchedEmail = false;
    let touchedMobile = false;
    let touchedPassword = false;

    let signUpErr = '';
    let signUpResult = '';

    // FIND A MORE ELEGANT SOLUTION THAN THIS
    // --------------------------------------
    // Just to avoid auto-redirection by home-page ('/') preload due to 
    // setting session store after a user sign-up and therefore resulting in MODE=2 not
    // being displayed properly. 
    // Therefore, temporarily save to session to signUpSession and set the
    // session store only when the button in MODE=2 is clicked.
    let signUpSession;

    // Loading spinner control
    let loading = false

    $: fullnameValid = isEmpty(fullname);
    $: emailValid = isValidEmail(email);
    $: mobileValid = isMobile(mobile);
    $: passwordValid = isSecure(password);
    $: usernameValid = isEmpty(username)
    $: formIsValid =
        fullnameValid &&
        emailValid &&
        mobileValid &&
        passwordValid;

    function signUp() {
        loading = true
        let data = {
                    username: username,
                    password: password, 
                    fullname: fullname,
                    email: email, 
                    mobile: mobile,
                };

        fetch('user/account/signup', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network failed');
                }
                loading = false;
                return response.json()
            })
            .then(data => {
                if (data.signUpErr) {
                    if(data.signUpErr.message) {signUpErr = data.signUpErr.message}
                    else {signUpErr = data.signUpErr}
                }
                else if (data.success && data.signUpResult) {
                    signUpResult = data.signUpResult;
                    signUpFinish();
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    function signUpFinish() {
        let data = {username: username, password: password};

        fetch('user/account/loginlogout', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                signUpSession = {user:{...data.user}};
                cleanUpClose();
                dispatch('signupsuccess', {session: signUpSession, msg:signUpResult});
            })
            .catch((error) => {
            console.error('Error:', error);
            }); 
    }

    function cleanUpClose () {
        touchedName = false;
        touchedUsername = false
        touchedEmail = false;
        touchedMobile = false;
        touchedPassword = false;
        fullname = '';
        username = '';
        email = '';
        mobile = '';
        password = '';
        dispatch('signupclose');
    }

</script>

<style>
    .signUp {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 300px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: 550px;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }

    .signUp form button {
        margin-top: 1rem;
    }

    .signUp input {
        margin-top: 0.25rem;
        font-family: 'Roboto', sans-serif;
        font-size: 1.5rem;
        margin-top: 1rem;
    }

    .signUp form {
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .signUp form button:disabled {
        background-image: none;
        background-color: grey;
        cursor: default;
    }

    .switchModal {
        color: #3D0CFF;
    }

    .switchModal:hover {
        cursor: pointer;
        color: green;
    }

    .switchStatement {
        margin: 2rem auto;
        font-family: 'Roboto', sans-serif;
        font-size: 1.25rem
    } 

    h3 {
        margin: 2rem auto 0 auto;
    }

    .closeBtn {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        font-size: 2rem;
        cursor: pointer;
    }

    .error-message {
        font-size: 1rem;
    }

    .input-error {
        color: red;
        font-size: 1rem;
    }
</style>

<Modal displayModal={display}>
    <div transition:scale={{duration: 500}} class="signUp">
        <!-- Loading Spinner -->
        {#if loading}
            <div class="loading"><Loading/></div>  
        {/if}
        <h3>Sign Up for free</h3>

        <form on:submit|preventDefault={signUp}>

        <Error showErr={signUpErr? true: false}>
                <p class="error-message">{signUpErr}</p>
        </Error>

            <!-- Name -->
            <input id="name" class:invalid={!fullnameValid && touchedName} 
                type='text'
                name = 'fullname'
                value = {fullname}
                placeholder="Full Name"
                on:input={event => (fullname = event.target.value)}
                on:blur={() => touchedName = true}
                />
            {#if !fullnameValid && touchedName}
                <p class="input-error">Cannot be empty</p>
            {/if}

            <!-- Username  -->
            <input id="username" class:invalid={!usernameValid && touchedUsername} 
                type='text'
                name = 'username'
                value = {username}
                placeholder="Username"
                on:input={event => (username = event.target.value)}
                on:blur={() => touchedUsername= true} 
                />
            {#if !usernameValid && touchedUsername}
                <p class="input-error">Cannot be empty</p>
            {/if}

            <!-- Email  -->
            <input id="email" class:invalid={!emailValid && touchedEmail} 
                type='email'
                name = 'email'
                value = {email}
                placeholder="Email"
                on:input={event => (email = event.target.value)}
                on:blur={() => touchedEmail = true} 
                />
            {#if !emailValid && touchedEmail}
                <p class="input-error">Invalid Email</p>
            {/if}

            <!-- Mobile  -->
            <input id="mobile" class:invalid={!mobileValid && touchedMobile} 
                type='text'
                name = 'mobile'
                value = {mobile}
                placeholder="Mobile Number"
                on:input={event => (mobile = event.target.value)}
                on:blur={() => touchedMobile = true} 
                />
            {#if !mobileValid && touchedMobile}
                <p class="input-error">Invalid! Type in number without country code</p>
            {/if}

            <!-- Password  -->
            <input id="password" class:invalid={!passwordValid && touchedPassword} 
                type='password'
                name = 'password'
                value = {password}
                placeholder="Password"
                on:input={event => (password = event.target.value)}
                on:blur={() => touchedPassword = true} 
                />
            {#if !passwordValid && touchedPassword}
                <p class="input-error">Should be atleast 8 characters</p>
            {/if}
            
            <button disabled={!formIsValid}>Submit</button>
            <p class="switchStatement">Already registered? 
                <span on:click={() => dispatch('loginopen')} class="switchModal">Sign In</span>
            </p>

            <!-- Close Button -->
            <div on:click={cleanUpClose} class="closeBtn">
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
        </form>
    </div>
</Modal>