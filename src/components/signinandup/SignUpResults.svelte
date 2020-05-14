<script>
    import Modal from '../ui/Modal.svelte';

    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import { stores } from '@sapper/app';

    const { session } = stores();

    const dispatch = createEventDispatcher();
    
    export let display;

    export let signUpResults;
</script>

<style>
    .signUpResult {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 300px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: auto;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }

    .signUpResult p {
        margin: 1rem;
        padding: 1rem;
        font-size: 1.5rem;
        font-family: 'Roboto', sans-serif;
    }

    .signUpResult button {
        margin-bottom: 1.5rem;
    }
</style>

<Modal displayModal={display}>
    <div transition:scale={{duration: 500}} class="signUpResult">
        <p>
        {signUpResults.msg}
        </p>
        <button 
        on:click = {() => {
            session.set(signUpResults.session); 
            dispatch('signupcomplete');
            }}
            >
            Ok
        </button>
    </div>
</Modal>