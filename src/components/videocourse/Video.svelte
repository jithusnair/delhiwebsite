<script context="module">
	let current;
</script>

<script>
    import { slide, scale } from 'svelte/transition';
    import Playr from './Playr.svelte';

    export let videoData;

    let clickedButton = false;

    let button;

    function showVideo() {
        console.log(current);
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

    button {
        position: absolute;
        top: 50%;
        right: 5%;
        transform: translateY(-50%);
    }

    .player {
        width: 100%;
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

        .main-container div {
            padding: 1rem;
        }

        button {
            padding: 1.15rem 2rem;
            right: 2%;
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
            <button bind:this={button} on:click={showVideo}>
                {clickedButton && videoData.link? 'Close': 'Watch'}
            </button>
        </div>
        {#if clickedButton}
            <div class="player" transition:slide|local="{{delay: 250, duration: 300}}">
                <Playr videoLink={videoData.link}/>
            </div>
        {/if}
    </div>
{/if}
