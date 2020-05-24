<script>
    import {onMount} from 'svelte';
    import Plyr from 'plyr';

    onMount(() => {
        const player = new Plyr('#player');
        player.on('ended', event => {
            ended = player.ended
        });
    });

    export let videoLink;
</script>

<style>
    #video-container {
        margin: auto;
	    width: 100%;
        height: 100%;
    }
</style>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css" />
</svelte:head>

{#if videoLink}
    <div id="video-container">
        <div id="player" data-plyr-provider="youtube" data-plyr-embed-id="{videoLink}"></div>
    </div>
{/if}