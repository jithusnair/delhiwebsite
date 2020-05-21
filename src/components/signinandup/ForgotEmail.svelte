<script>
    import Modal from '../ui/Modal.svelte';
    import Loading from '../ui/Loading.svelte';
    import Error from '../ui/Error.svelte';

    import { scale } from 'svelte/transition';
    
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let forgotPassEmail = '';

    let forgotPassEmailErr = '';

    $:  if(forgotPassEmailErr) {
            setTimeout(() => {
                forgotPassEmailErr = false;
            }, 2000);
        }

    export let display = false;

    let loading = false;

    function cleanUpClose () {
        forgotPassEmail = '';
        forgotPassEmailErr = '';
        dispatch('forgotclose');
    }

    function forgotEmail() {
        loading = true;
        let data = {email: forgotPassEmail};

        fetch('user/account/forgotemail', {
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
                    let email = forgotPassEmail;
                    cleanUpClose();
                    dispatch('forgotemailsuccess', 
                        {
                            forgotPassEmail: email, 
                            msg:data.msg
                        });
                }
                else if(!data.success && data.err) {
                    forgotPassEmailErr = data.err;
                }
                else if(!data.success && data.serverErr) {
                    forgotPassEmailErr = data.serverErr;
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            }); 
    }
</script>

<style>
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

    .forgotPassword {
        width: 300px;
        padding: 0 10px 0 10px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: 250px;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }

    input {
        margin-top: 1rem;
    }

    .forgotPassword form {
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .forgotPassword div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .forgotPassword div p {
        margin: 1.5rem;
    }

    .forgotPassword h3 {
        margin: 2rem auto 1rem auto;
        text-align: center;
    }

    button {
        margin-top: 1rem;
    }

    .forgotPassword div .error-message {
        font-size: 1rem;
        margin:0;
    }

    .closeBtn {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        font-size: 2rem;
        cursor: pointer;
    }
</style>

<Modal displayModal={display}>
    <div transition:scale={{duration: 500}} class="forgotPassword">
        <h3>Forgot Password</h3>
        <!-- Loading Spinner -->
        {#if loading}
            <div class="loading"><Loading/></div>  
        {/if}
        <form on:submit|preventDefault={forgotEmail}>
            <p><strong>Please provide your email</strong></p>
            <Error showErr={forgotPassEmailErr? true: false}>
                <p class="error-message">{forgotPassEmailErr}</p>
            </Error>
            <input
                type='email'
                value = {forgotPassEmail}
                placeholder= "Email"
                on:input={event => (forgotPassEmail = event.target.value)}
                />
            <button>Next</button>
            <div on:click={cleanUpClose} class="closeBtn">
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
        </form>
    </div>
</Modal>