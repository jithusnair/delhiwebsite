<script>
    import ExamDisplayAndEdit from './ExamDisplayAndEdit.svelte';

    export let exams;
    export let sectors;
</script>

<style>
    .container {
        background-color: white;
        width: 100%;
    }
</style>

<div class="container">
    {#each exams as exam}
        <ExamDisplayAndEdit 
            {sectors} 
            {exam}
            on:update
            on:delete
        />
    {/each}
</div>