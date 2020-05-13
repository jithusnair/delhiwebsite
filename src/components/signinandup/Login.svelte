<script>
    import Modal from '../ui/Modal.svelte';
    import Loading from '../ui/Loading.svelte';
    import Error from '../ui/Error.svelte';
    
    import { scale } from 'svelte/transition';
    
    import { createEventDispatcher } from 'svelte';
    import { stores } from '@sapper/app';

    const { session } = stores();
    
    const dispatch = createEventDispatcher();

    let loginUsername = '';
    let loginPassword = '';

    let loginErr = '';

    let loading = false;
    export let display = false;

    function login() {
        loading = true;
        let data = {username: loginUsername, password: loginPassword};

        fetch('user/account/loginlogout', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
            })
            .then(response => {
                loading = false;
                return response.json()
            })
            .then(data => {
                if(data.success) {
                    session.set({user:{...data.user}});
                    dispatch('close');
                    goto('/user');
                }
                else if (data.loginErr) {
                    loginErr = data.loginErr;
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    function cleanUpClose () {
        loginUsername = '';
        loginPassword = '';
        loginErr = null;
        dispatch('close');
    }
</script>

<style>
    .signIn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 300px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: 350px;
        transform: translate(-50%, -50%);
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
 
    .signIn form {
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .signIn #username, .signIn #password {
        margin-top: 2rem;
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

    .forgot {
        font-family: 'Roboto', sans-serif;
        font-size: 1.1rem;
        margin-left: auto;
        margin-top: 1rem;
        color: #3D0CFF;
    }

    .forgot:hover {
        cursor: pointer;
        color: green;
    }

    #loginBtn {
        margin-top: 1rem;
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
</style>

<Modal displayModal={display}>
    <!-- Loading Spinner -->
    {#if loading}
    <div class="loading"><Loading/></div>  
    {/if}
    <!-- Login Part -->
    <div transition:scale={{duration: 500}} class="signIn">
        <h3>Login</h3>
        <form on:submit|preventDefault={login}>
            <!-- {#if loginErr} -->
            <Error showErr={loginErr? true: false}>
                <p class="error-message">Missing credentials</p>
            </Error>
            <!-- {/if} -->
            <input bind:value={loginUsername} id="username" type="text" name="username" placeholder="Username">
            <input bind:value={loginPassword} id='password' type="password" name='password' placeholder="Password">
            <p class="forgot" on:click={()=> dispatch('forgot')}>Forgot password?</p>
            <button id="loginBtn">Log In</button>
            <div on:click={cleanUpClose} class="closeBtn">
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
        </form>
        <p class="switchStatement">New registration? 
            <span on:click={() => dispatch('switch')} class="switchModal">Sign Up</span>
        </p>
    </div>
</Modal>