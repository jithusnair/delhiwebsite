<script>
    import { isEmpty, isValidEmail, isMobile } from "../../_helpers/validation.js";
    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

    import Loading from '../ui/Loading.svelte';
    import Error from '../ui/Error.svelte';
    import CheckMark from '../ui/CheckMark.svelte';

    import { goto } from '@sapper/app';

    let fullname = '';
    let address = '';
    let email = '';
    let date = '';
    let mobile = ''
    let job = '';

    let touchedName = false;
    let touchedEmail = false;
    let touchedAddress = false;
    let touchedDate = false;
    let touchedMobile = false;
    let touchedJob = false;

    let signUpErr = '';
    let userSignedPetition = false;

    $:  if(signUpErr) {
        setTimeout(() => {
            signUpErr = false;
        }, 10000);
    }

    let message;
    let messageDisplay = false;
    
    // Loading spinner control
    let loading = false

    $: fullnameValid = isEmpty(fullname);
    $: emailValid = isValidEmail(email);
    $: addressValid = isEmpty(address);
    $: mobileValid = isMobile(mobile);
    $: jobValid = isEmpty(job);
    $: dateValid = isEmpty(date);
    $: formIsValid =
        fullnameValid &&
        emailValid &&
        addressValid &&
        jobValid &&
        mobileValid &&
        dateValid;

    function loadedScript() {
        flatpickr("#date", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            mode: "single",
            maxDate: "today",
            disableMobile: "true",
        });
    }

    let countdown = 5;

    function startTimer() {
        let interval = setInterval(()=>{
            countdown = countdown - 1;
            if(countdown === 0) {
                clearInterval(interval);
                goto('/');
            }
        }, 1000)
    }

    function signPetition() {
        loading = true
        let data = {
                    fullname: fullname.trim(),
                    mobile: mobile.trim(),
                    email: email.trim(), 
                    date: date.trim(),
                    profession: job.trim(),
                    address: address.trim(),
        };

        fetchWithTimeout('/petition/sign', {
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
                loading = false;
                return response.json()
            })
            .then(data => {
                if (data.success) {
                    message = data.message;
                    userSignedPetition = true;                    
                }
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

</script>

<style>
    .signUp {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        width: 90%;
        height: auto;
        border-radius: 2rem;
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
        text-align: center;
    }

    .signUp input, textarea {
        margin-top: 0.25rem;
        font-family: 'Roboto', sans-serif;
        font-size: 1.5rem;
        margin-top: 1rem;
    }

    .signUp form {
        margin: 0 auto;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .signUp form button:disabled {
        background-image: none;
        background-color: grey;
        cursor: default;
    }

    h3 {
        margin: 2rem auto 0 auto;
    }

    .error-message {
        font-size: 1rem;
        line-height: 1rem;
    }

    .input-error {
        color: red;
        font-size: 1rem;
        line-height: 1.5rem;
    }

    input {
        width: 100%;
    }

    .hide {
        visibility: hidden;
    }

    .show {
        visibility: visible;
    }

    @media only screen and (min-width: 1300px) {
        .signUp {
            width: 500px;
        }
    }
</style>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script on:load={loadedScript} src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</svelte:head>

{#if !userSignedPetition}
    <div class="signUp">
        <!-- Loading Spinner -->
        {#if loading}
            <div class="loading"><Loading/></div>  
        {/if}
        <h3>Sign the Petition</h3>

        <Error showErr={signUpErr? true: false}>
            <p class="error-message">{signUpErr}</p>
        </Error>

        <form on:submit|preventDefault={signPetition}>

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
            <!-- Mobile -->
            <input id="mobile" class:invalid={!mobileValid && touchedMobile} 
                type='text'
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
            <!-- Date Picker -->
            <input id="date" class:invalid={!dateValid && touchedDate} 
                type='text'
                value = {date}
                placeholder="Date of birth - DD.MM.YYYY"
                on:change={event => (date = event.target.value)}
                on:close={() => touchedDate = true}
                />
            <p 
                class="input-error {!dateValid && touchedDate? 'show': 'hide'}"
            >
                Cannot be empty
            </p>
            <!-- Profession -->
            <input id="profession" class:invalid={!jobValid && touchedJob} 
                type='text'
                value = {job}
                placeholder="Profession"
                on:input={event => (job = event.target.value)}
                on:blur={() => touchedJob = true}
                />
            <p 
                class="input-error {!jobValid && touchedJob? 'show': 'hide'}"
            >
                Invalid! Type in number without country code
            </p>
            <!-- Address -->
            <textarea id="address" class:invalid={!addressValid && touchedAddress} 
                rows="4"
                name = 'address'
                value = {address}
                placeholder="Village, Tehsil, District"
                on:input={event => (address = event.target.value)}
                on:blur={() => touchedAddress = true}
                />
            <p 
                class="input-error {!addressValid && touchedAddress? 'show': 'hide'}"
            >
                Cannot be empty
            </p>            
            <button disabled={!formIsValid}>Sign Petition</button>
        </form>
    </div>
{:else}
    <CheckMark 
        display = true
        on:done={()=>{
            messageDisplay = true;
            startTimer();
        }
        }
    />
    {#if messageDisplay}
        <div>
            <h1>Thank You!</h1>
            <p>
                {message}
            </p>
            <p>Redirecting in {countdown}</p>
        </div>
    {/if}
{/if}