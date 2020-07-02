<script>
    export let timer;
</script>

<style>
    .container {
        display: grid;
        grid-template-columns: 15rem 10rem 10rem 10rem;
        grid-gap: 1rem;
        margin: 3rem auto;
        width: 70%;
    }
    .timeContainer, .dayContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media only screen and (max-width: 500px) {
        .container {
            grid-template-columns: 8rem 5rem 5rem 5rem;
        }

        h1 {
            font-size: 3rem;
        }
        
        p {
            font-size: 2rem;
        }
    }
</style>

<div class="container">
    <div class="dayContainer">
        <h1>{timer.days}</h1>
        <p>Day</p>
    </div>
    <div class="timeContainer">
        <h1>{timer.hours}</h1>
        <p>Hr</p>
    </div>
    <div class="timeContainer">
        <h1>{timer.minutes}</h1>
        <p>Min</p>
    </div>
    <div class="timeContainer">
        <h1>{timer.seconds}</h1>
        <p>Sec</p>
    </div>
</div>