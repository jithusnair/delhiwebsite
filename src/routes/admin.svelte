<script>
    import { goto } from '@sapper/app';
    import { stores } from '@sapper/app';
    
    import Loading from '../components/ui/Loading.svelte';
    import Error from '../components/ui/Error.svelte';

    import { fetchWithTimeout } from '../_helpers/fetchWithTimeout.js';

    const { session } = stores();

    let username='';
    let password='';

    let errorMsg = '';

     $:  if(errorMsg) {
            setTimeout(() => {
                errorMsg = false;
            }, 10000);
        }

    let loading = false;

    function login() {
        loading = true;
        let data = {username: username, password: password};

        fetchWithTimeout('/admin/loginlogout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        },
        10000)
        .then(response => {
            loading = false;
            return response.json()
        })
        .then(data => {
            if(data.success) {
                goto('/admin/');
                session.set({user:{...data.user}});
            }
            else if (data.loginErr) {
                errorMsg = data.loginErr;
            }
            else if (data.serverErr) {
                errorMsg = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                loading = false;
                errorMsg = 'Server taking too long to respond! Request timed out';
            }
            else {
                console.error('Error:', error);
            }
        });
    }
</script>

<style>
    div {
        height: 100%;
        width: 100%;
        position: fixed; 
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    form {
        margin: 0 auto;
        height: 100%;
        width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #username, #password {
        margin-top: 2rem;
    }

    .error-message {
        font-size: 1rem;
    }

    .background {
        z-index: 1005;
        background: rgba(0, 0, 0, 0.2);
        width: 100%;
        height: 100%;
        border-radius: inherit;
    }

    button {
        margin-top: 2rem;
    }
</style>

<div>
    {#if loading}
        <div class="background">
            <Loading/>
        </div>
    {/if}
    <form on:submit|preventDefault={login}>
        <Error showErr={errorMsg? true: false}>
            <p class="error-message">{errorMsg}</p>
        </Error>
        <input bind:value={username} id="username" type="text" name="username" placeholder="Username">
        <input bind:value={password} id='password' type="password" name='password' placeholder="Password">
        <button>Submit</button>
    </form>
</div>