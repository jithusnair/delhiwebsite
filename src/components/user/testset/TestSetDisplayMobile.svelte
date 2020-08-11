<script>
    import { purchasedStore } from '../../../store/testsets-controller-user.js';

    import { createEventDispatcher } from 'svelte';
    
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
    .quiz-head{
        font-size: 2.3rem;
        text-align: center;
        margin-bottom: 1rem;
        color: var(--black-color);
    }

    .data{
        display: flex;
        justify-content: space-between;
    }

    .data-key, .data-value {
        color: var(--quiz-question-color);
        font-size: 1.7rem;
    }

    .ruler{
        background-color: var(--ruler-backgroud);
        height: 0.1rem;
        width: 100%;
        margin: 0.6rem auto;
    }

    .start-btn{
        color: var(--white);
        margin: 3rem auto 2rem auto;
        display: flex;
        justify-content: center;
    }

    .attempt {
        width: auto;
        background: rgb(93, 91, 255);
        box-shadow: none;
    }

    i {
        color: white;
    }
</style>

<h2 class="quiz-head">{testSet.testSetTitle}</h2>
<div class="ruler"></div>
<div class="data">
    <p class="data-key">Questions</p>
    <p class="data-value">{testSet.totalQuestions}</p>
</div>
<div class="data">
    <p class="data-key">Total Time</p>
    <p class="data-value">{testSet.examDuration}</p>
</div>
<div class="data">
    <p class="data-key">Total Marks</p>
    <p class="data-value">{testSet.totalMarks}</p>
</div>
<div class="ruler"></div>
<div class="start-btn">
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