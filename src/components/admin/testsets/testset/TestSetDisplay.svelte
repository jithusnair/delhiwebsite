<script context="module">
	let current;
</script>

<script>
    import { scale } from 'svelte/transition';

    export let testSet;

    let clickedButton = false;

    let button;
</script>

<style>
    .main-container {
        margin: 2rem 5rem;
        border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: 50rem;
        height: auto;
    }

    .main-container div {
        position: relative;
        padding: 2rem;
        height: 100%;
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

    .mobile-info {
        display: none;
    }

    @media only screen and (max-width: 500px) {
        .info {
            display: none;
        }

        .mobile-info {
            display: flex;
            justify-content: space-around;
        }
    }
</style>

{#if testSet}
    <div transition:scale|local="{{ duration: 400 }}" class="main-container">
        <div>
            <h4>{testSet.testSetTitle}</h4>
            <button>Attempt</button>
        </div>
        <div class="info">
            <i class="fa fa-question-circle-o" aria-hidden="true"></i>
            <p>Questions: {testSet.totalQuestions}</p>
            <i class="fa fa-check-square-o" aria-hidden="true"></i>
            <p>Marks: {testSet.totalMarks}</p>
            <i class="fa fa-clock-o" aria-hidden="true"></i>
            <p>Time: {testSet.examDuration} mins</p>
        </div>
        <div class="mobile-info">
            <p>
                {testSet.totalQuestions} qns | 
                {testSet.totalMarks} marks | 
                {testSet.examDuration} mins
            </p>
        </div>
    </div>
{/if}
