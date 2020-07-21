<script>
    import { subjectStore } from '../../../../store/subject.js';
    import { questionStore } from '../../../../store/question.js';
    import { selectedSubject, 
             questionNumber, 
             questionDisplay } from '../../../../store/controller.js'

    function selection(i) {
        questionDisplay.set($questionStore[$selectedSubject][i]);
        questionNumber.set(i);
    }
</script>

<style>
    .container {
        display: grid;
        grid-template-columns: 3rem 3rem 3rem 3rem 3rem;
        grid-template-rows: repeat(auto-fill, 3rem);
        grid-gap: 2.7rem;
        justify-content: center;
        padding: 5rem 0;
        height: 500px;
    }

    .active {
        background: rgb(204, 19, 19);
        color: white;
    }

    .inactive { 
        background-color: var(--body-background);
    }

    .qnNo {
        padding: 1rem;
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 1rem;
        text-align: center;
        cursor: pointer;
    }
</style>

{#if questionStore != 0}
    <div class="container">
        {#if $selectedSubject != 0}
            {#each $questionStore[$selectedSubject] as question, i}
                <p 
                    class="{$questionNumber == i? 'active': 'inactive'} qnNo"
                    on:click = {() => selection(i)}
                >
                    {question.qnNumber}
                </p>
            {/each}
        {/if}
    </div>
{/if}