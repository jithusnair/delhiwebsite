<script>
    import {subjectStore} from '../../../../store/subject.js';
    import Subject from './Subject.svelte';
    import Question from './Question.svelte';
    import QuestionNumber from './QuestionNumber.svelte';
</script>

<style>
    .subjects {
        grid-area: subjects;
        display: grid;
        grid-template-columns: repeat(6, minmax(5rem, auto));
        align-items: center;
        justify-content: start;
        background-color: whitesmoke;
        border-bottom: 2px solid rgba(0,0,0, 0.2);
        border-top: 2px solid rgba(0,0,0,0.2);
        padding: 0 2rem;
        grid-gap: 1rem;
    }

    .subjectHead {
        margin-right: 2rem;
    }

    .pandq {
        grid-area: pandq;
        margin-top: 1rem;
    }

    .qn {
        grid-area: qnNo;
        overflow: scroll;
    }

    .container {
        display: grid;
        grid-template-columns: auto 30rem;
        grid-template-rows: 5rem auto;
        grid-template-areas: 
        "subjects qnNo"
        "pandq qnNo";
    }
</style>

<div class="container">
    <!-- subjects -->
    <div class="subjects">
        <p class="subjectHead">Sections</p>
        <Subject/>
    </div>
    <div class="pandq">
        <Question
            on:edit
            on:delete
        />
    </div>
    <!-- question numbers -->
    <div class="qn">
        <QuestionNumber/>
    </div>
</div>