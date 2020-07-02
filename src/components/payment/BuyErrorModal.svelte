<script>
    import Modal from '../ui/Modal.svelte';

    import { stores, goto } from '@sapper/app';
    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    const { session } = stores();

    let forgotPassToken = '';

    export let message;

    export let error;
    // logout the user if there is some error during the payment.
    export let redirect;
    // if payment fails (not captured), user will be redirected to the page set by
    // this variable. Redirecting page is most probably the same as the BUY page 
    // from which this component is typically initiated. The only difference is 
    // that the page will be reloaded without queries in the URL.

    export let display = false;

    function logout() {
        fetch('/user/account/loginlogout', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    goto('/');
                    session.set({});
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }
</script>

<style>
    .paymentModal {
        width: 300px;
        padding: 0 10px 0 10px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: auto;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }
    
    p {
        margin: 1.5rem;
        text-align: left;
    }

    .paymentModal h3 {
        margin: 2rem auto 1rem auto;
        text-align: center;
    }

    button {
        margin: 1rem auto;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
    }

</style>

<Modal displayModal={display}>
    <div transition:scale|local={{duration: 500}} class="paymentModal">
    {#if error}
        <h3>Server Error!</h3>
        <p>{@html message}</p>
        <button on:click = {logout}>Logout</button>
    {:else if redirect}
        <h3>Payment failed!</h3>
        <p>{@html message}</p>
        <button on:click = {()=>goto({redirect})}>Close</button>
    {/if}
    </div>
</Modal>