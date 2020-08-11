<script>
    import { 
        sectorStore, 
        selectedSectorStore, 
        selectedExamStore, 
        examStore,
        examDisplayStore,
        testPacksDisplayStore 
        } 
        from '../../../store/tests-controller.js';

    function selection(selected) {
        selectedExamStore.set(selected);
        if(selected === 'all') {
            testPacksDisplayStore.set($examStore[$selectedSectorStore][selected]);
        } 
        else {
            testPacksDisplayStore.set($examStore[$selectedSectorStore][selected].testPacks);
        }
    }
</script>

<style>
    .exam-btn{
        width: min-content;
        margin-bottom: 1rem;
        padding: .5rem 2rem;
        background-color: var(--body-background);
        font-weight: bold;
        color: black;
        box-shadow: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
    }

    .active {
        background-color: var(--nav-color);
        color: white;
    }

    .heading {
        margin-bottom: 3rem;
        text-align: center;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media screen and (max-width: 600px){
        .container {
            margin: 0 auto;
            display: grid;
            width: 36rem;
            grid-template-columns: repeat(20, auto);
            overflow-x: scroll;
        }

        .heading {
            display:none;
        }

        .exam-btn {
            margin: 2rem 0;
        }
    }
</style>
<!--  -->
<!-- on:click = {() => selection(subject._id)} -->

<div class="container">
    {#if $examDisplayStore && $examDisplayStore.length !=0}
        <h3 class="heading">Exams:</h3>
        <p 
            class="exam-btn {$selectedExamStore == 'all'? 'active': ''}"
            on:click = {() => selection('all')}
        >
            All
        </p>
        {#each $examDisplayStore as exam, i}
            <p 
                class="exam-btn {$selectedExamStore == i? 'active': ''}"
                on:click = {() => selection(i)}
            >
                {exam.examShortTitle.toUpperCase()}
            </p>
        {/each}
    {/if}
</div>
