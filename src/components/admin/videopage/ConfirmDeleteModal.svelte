<script>
    import { createEventDispatcher } from 'svelte';

    import { scale } from 'svelte/transition';

    import Modal from '../../ui/Modal.svelte';

    const dispatch = createEventDispatcher();
    
    export let display = false;

    export let videoTitle = ''

    function yes() { 
        dispatch('response', true)
    }

    function no() {
        dispatch('response', false)
    }
</script>

<style>
    #no {
        margin: 2rem auto 0 2rem;
        width: 75px;
        text-align:center;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        background: #3D0CFF;
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
    }

    #yes {
        margin: 2rem 2rem 0 auto;
        background: white;
        width: 75px;
        text-align:center;
        color: Black;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
    }

    #yes:hover {
        background: #3D0CFF;
        color: white;
    }

    .confirm {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 500px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: auto;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }

    h2 {
        margin: 0 auto 1rem auto;
    }

    #guideStatement {
        margin-top:0.75rem;
        text-align: center;
    }

</style>


<Modal displayModal={display}>
    <div transition:scale|local={{duration: 500}} class="confirm">
        <h2>Confirmation</h2>
        <p>
        Are you sure you want to delete <strong>{videoTitle}</strong> from
        the database?
        <p id="guideStatement"><strong>Press Yes to delete, No to cancel.</strong></p>
        <div class="btns">
            <button on:click={yes} id="yes">Yes</button>
            <button on:click={no} id="no">No</button>
        </div>
    </div>
</Modal>