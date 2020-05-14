<script>
    import Modal from '../ui/Modal.svelte';
    import Loading from '../ui/Loading.svelte';
    import Error from '../ui/Error.svelte';

    import { scale } from 'svelte/transition';
    
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let forgotPassToken = '';

    export let forgotTokenSuccess;

    export let display = false;
</script>

<style>
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
    
    p {
        margin: 1.5rem;
        text-align: center;
    }

    .forgotPassword h3 {
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
    <div transition:scale={{duration: 500}} class="forgotPassword">
        <h3>Forgot Password</h3>
        <p><strong>{forgotTokenSuccess}</strong></p>
        <button on:click = {()=> dispatch('forgotclose')}>Ok</button>
    </div>
</Modal>