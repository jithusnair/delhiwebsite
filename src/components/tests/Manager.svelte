<script>
    import TestPacks from './TestPacks.svelte';
    import Sectors from './Sectors.svelte';
    import Exams from './Exams.svelte';
</script>

<style>
    .container {
        width: 90%;
        margin: 1rem auto;
        display: grid;
        grid-template-columns: 20rem auto;
        grid-template-rows: 5rem auto;
        grid-template-areas: 
        ". sectors"
        "exams tests";
    }

    .sectors {
        grid-area: sectors;
    }

    .exams {
        grid-area: exams;
    }

    .tests {
        grid-area: tests;
    }
  
    @media screen and (max-width: 600px){
        .container {
            width: 95%;
            margin: 1rem auto;
            display: grid;
            grid-template-columns: auto;
            grid-template-rows: 5rem 5rem auto;
            grid-template-areas: 
            "sectors"
            "exams"
            "tests";
        }
    }
</style>

<div class="container">
    <div class="sectors">
        <Sectors/>
    </div>
    <div class="exams">
        <Exams/>
    </div>
    <div class="tests">
        <TestPacks/>
    </div>
</div>