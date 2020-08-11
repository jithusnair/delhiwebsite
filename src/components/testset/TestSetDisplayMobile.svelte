<script>
    export let testSet
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
    <button class="btn">Unlock</button>
</div>