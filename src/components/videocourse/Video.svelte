<script context="module">
	let current;
</script>

<script>
    import { scale } from 'svelte/transition';

    export let videoData;

    let clickedButton = false;

    let button;

    function showVideo() {
        if (current) {
            if(current === button) toggleButton();
            else if (current !== button) {
                current.stop();
                current = button;
                current.stop = stop;
                start();
            }
        }
        else {
            current = button;
            current.stop = stop;
            start();
        }
    }

    function start() {
        clickedButton = true;
    }

    function stop() {
        clickedButton = false;
    }

    function toggleButton() {
        if(videoData.link) {
            clickedButton = !clickedButton;
        }
    }
</script>

<style>
    .main-container {
        margin: 2rem auto 5rem auto;
        border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: 90%;
        height: auto;
    }

    .main-container div {
        position: relative;
        padding: 2rem;
        height: 100%;
    }

    h3, p {
        width: 60%;
        text-align: left;
    }

    @media only screen and (max-width: 1000px) {
        .main-container {
            width: 100%;
            margin: 5rem auto;
        }
        
        h3, p {
            width: 70%;
        }
    }
</style>

{#if videoData}
    <div transition:scale|local="{{ duration: 400 }}" class="main-container">
        <div>
            <h3>{videoData.title}</h3>
            <p>{videoData.description}</p>
        </div>
    </div>
{/if}
