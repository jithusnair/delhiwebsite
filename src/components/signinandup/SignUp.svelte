<script>
    import { isEmpty, isSecure, isMobile, isValidEmail } from "../../_helpers/validation.js";
    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

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

    $:  if(signUpErr) {
        setTimeout(() => {
            signUpErr = false;
        }, 10000);
    }

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
        usernameValid &&
        emailValid &&
        mobileValid &&
        passwordValid;

    function signUp() {
        loading = true
        let data = {
                    username: username.trim(),
                    password: password, 
                    fullname: fullname.trim(),
                    email: email.trim(), 
                    mobile: mobile.trim(),
                };

        fetchWithTimeout('user/account/signup', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
            },
            30000)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network failed');
                }
                loading = false;
                return response.json()
            })
            .then(data => {
                if (data.signUpErr) {
                    signUpErr = data.signUpErr
                }
                else if (data.email) {
                    signUpSession = {user:{...data.session}};
                    cleanUpClose();
                    dispatch('sentcode', {session: signUpSession, email:data.email});
                }
                // for now just display on the modal itself.
                // Maybe later a better alert/snackbar/something else can be shown
                else if (data.serverErr) {
                    signUpErr = data.serverErr;
                }
            })
            .catch((error) => {
                loading = false;
                if (error.name === 'AbortError') {
                    signUpErr = 'Server taking too long to respond! Request Timed out';
                }
                else if (error.name === 'TypeError') {
                    signUpErr = 'No Internet!';
                }
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
        padding: 0 10px;
        width: 300px;
        position: fixed;
        top: 4rem;
        left: 50%;
        background-color: white;
        height: 500px;
        transform: translateX(-50%);
        border-radius: 2rem;
        z-index: 1003;
    }

    .loading {
        z-index: 1005;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.2);
        width: 100%;
        height: 100%;
        border-radius: inherit;
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
        line-height: 1rem;
    }

    .input-error {
        color: red;
        font-size: 1rem;
        line-height: 1rem;
    }

    .hide {
        visibility: hidden;
    }

    .show {
        visibility: visible;
    }
</style>

<Modal displayModal={display}>
    <div transition:scale|local={{duration: 500}} class="signUp">
        <!-- Loading Spinner -->
        {#if loading}
            <div class="loading"><Loading/></div>  
        {/if}
        <h3>Sign Up for free</h3>

        <Error showErr={signUpErr? true: false}>
            <p class="error-message">{signUpErr}</p>
        </Error>

        <form on:submit|preventDefault={signUp}>

            <!-- Name -->
            <input id="name" class:invalid={!fullnameValid && touchedName} 
                type='text'
                name = 'fullname'
                value = {fullname}
                placeholder="Full Name"
                on:input={event => (fullname = event.target.value)}
                on:blur={() => touchedName = true}
                />
            <p 
                class="input-error {!fullnameValid && touchedName? 'show': 'hide'}"
            >
                Cannot be empty
            </p>
            <!-- Username  -->
            <input id="username" class:invalid={!usernameValid && touchedUsername} 
                type='text'
                name = 'username'
                value = {username}
                placeholder="Username"
                on:input={event => (username = event.target.value)}
                on:blur={() => touchedUsername= true} 
            />
            <p 
                class="input-error {!usernameValid && touchedUsername? 'show': 'hide'}"
            >
                Cannot be empty
            </p>
            <!-- Email  -->
            <input id="email" class:invalid={!emailValid && touchedEmail} 
                type='email'
                name = 'email'
                value = {email}
                placeholder="Email"
                on:input={event => (email = event.target.value)}
                on:blur={() => touchedEmail = true} 
                />
            <p 
                class="input-error {!emailValid && touchedEmail? 'show': 'hide'}"
            >
                Invalid Email
            </p>
            <!-- Mobile  -->
            <input id="mobile" class:invalid={!mobileValid && touchedMobile} 
                type='text'
                name = 'mobile'
                value = {mobile}
                placeholder="Mobile Number"
                on:input={event => (mobile = event.target.value)}
                on:blur={() => touchedMobile = true} 
                />
            <p 
                class="input-error {!mobileValid && touchedMobile? 'show': 'hide'}"
            >
                Invalid! Type in number without country code
            </p>

            <!-- Password  -->
            <input id="password" class:invalid={!passwordValid && touchedPassword} 
                type='password'
                name = 'password'
                value = {password}
                placeholder="Password"
                on:input={event => (password = event.target.value)}
                on:blur={() => touchedPassword = true} 
                />
            <p 
                class="input-error {!passwordValid && touchedPassword? 'show': 'hide'}"
            >
                Should be atleast 8 characters
            </p>
            
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