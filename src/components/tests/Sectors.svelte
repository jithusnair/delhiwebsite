<script>
    import { 
        sectorStore, 
        selectedSectorStore, 
        selectedExamStore, 
        examStore,
        examDisplayStore,
        testPacksDisplayStore
        } 
        from '../../store/tests-controller.js';

    function selection(selected) {
        selectedSectorStore.set(selected);
        examDisplayStore.set($examStore[$selectedSectorStore]);
        selectedExamStore.set('all');
        testPacksDisplayStore.set($examStore[$selectedSectorStore].all);
    }
</script>

<style>
    .exam-btn{
        width: min-content;
        margin-right: 2rem;
        padding: .5rem 2rem;
        background-color: var(--body-background);
        color: black;
        box-shadow: none;
        font-weight: bold;
        border-radius: 10px;
        border: none;
        cursor: pointer;
    }

    .active {
        background-color: var(--nav-color);
        color: white;
    }

    .container {
        display: flex;
    }
    h3 {
        margin-right: 3rem;
    }

    @media screen and (max-width: 800px) and (min-width: 600px){
        .container {
            margin: 0 auto;
            display: grid;
            width: 40rem;
            grid-template-columns: repeat(20, auto);
            overflow-x: scroll;
        }

        .exam-btn {
            margin-right: 0;
            margin-bottom: 2rem;
        }
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
            display: none;
        }

        .exam-btn {
            margin-right: 0;
            margin-bottom: 2rem;
        }
    }
</style>

<div class="container">
    <h3 class="heading">Departments:</h3>
    {#if $sectorStore && $sectorStore.length != 0}
        {#each $sectorStore as sector}
            <p 
                on:click = {() => selection(sector._id)}
                class="exam-btn {$selectedSectorStore == sector._id? 'active': ''}"
            >
                {sector.sectorTitle}
            </p>
        {/each}
    {/if}
</div>