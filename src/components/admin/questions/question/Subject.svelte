<script>
    import { questionStore } from '../../../../store/question.js';
    import { selectedSubject,
             questionSubjects,
             questionNumber, 
             questionDisplay } from '../../../../store/controller.js';
    import { onMount } from 'svelte';

    onMount(() => {
        if($selectedSubject == 0) {
            selection($questionSubjects[0]._id);
        }
    })

    function selection(selected) {
        selectedSubject.set(selected);
        questionDisplay.set($questionStore[selected][0]);
        questionNumber.set(0);
    }
</script>

<style>
    .subject {
        padding: 0.5rem 0.75rem;
        text-align: center;
        border-radius: 5px;
        cursor: pointer;
    }

    .active {
        background: var(--nav-color);
        color: white;
    }
</style>

{#if $questionSubjects != 0}
    {#each $questionSubjects as subject, i}
        <p
            class="subject {$selectedSubject == subject._id? 'active': ''}" 
            on:click = {() => selection(subject._id)}
        >
            {subject.subjectTitle}
        </p>
    {/each}
{/if}