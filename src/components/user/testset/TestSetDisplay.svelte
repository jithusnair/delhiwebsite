<script>
    import { createEventDispatcher } from 'svelte';

    import TestSetDisplayMobile from './TestSetDisplayMobile.svelte';
    import { purchasedStore } from '../../../store/testsets-controller-user.js';

    let dispatch = createEventDispatcher();
    
    export let testSet;

    function eventManager() {
        if($purchasedStore) {
            // goto('') some location to do the tests
        } else {
            dispatch('unlock');
        }
    }
</script>

<style>
    .main-container {
        margin: 2rem 5rem;
        border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: 50rem;
        height: 15rem;
    }

    .main-container div {
        position: relative;
        padding: 2rem;
    }

    button {
        position: absolute;
        top: 50%;
        right: 5%;
        transform: translateY(-50%);
    }

    i {
        color: grey;
        font-size: 2rem;
    }

    .info {
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 2rem;
    }

    .mobile-container {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 20px;
        border-radius: 20px;
        border-top-left-radius: 0px;
        margin: auto 4rem;
        width: auto;
        min-width: 23rem;
        height: 45rem;
        display: none;
    }

    .attempt {
        width: auto;
        background: rgb(93, 91, 255);
        box-shadow: none;
    }

    i {
        color: white;
    }

    @media only screen and (max-width: 500px) {
        .main-container {
            display: none;
        }

        .mobile-container {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly; 
        }
    }
</style>

{#if testSet}
    <div class="main-container">
        <div>
            <h4>{testSet.testSetTitle}</h4>
            <button 
                class="btn {$purchasedStore? 'attempt': ''}"
                on:click={eventManager}
            >
                {#if !$purchasedStore}
                    Unlock&nbsp;
                    <i class="fa fa-unlock-alt" aria-hidden="true"></i>
                {:else}
                    Attempt
                {/if}
            </button>
        </div>
        <div class="info">
            <i class="fa fa-question-circle-o" aria-hidden="true"></i>
            <p>Questions: {testSet.totalQuestions}</p>
            <i class="fa fa-check-square-o" aria-hidden="true"></i>
            <p>Marks: {testSet.totalMarks}</p>
            <i class="fa fa-clock-o" aria-hidden="true"></i>
            <p>Time: {testSet.examDuration} mins</p>
        </div>
    </div>
    <div class="mobile-container">
        <TestSetDisplayMobile {testSet} />
    </div>
{/if}
