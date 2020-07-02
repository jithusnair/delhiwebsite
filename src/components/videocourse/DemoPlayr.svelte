<script>
    import { onMount } from 'svelte';
    import Plyr from 'plyr';

    onMount(() => {
        const player = new Plyr('#demo');
    });

    export let videoLink;
</script>

<style>
    #demo-container {
	    width: 70%;
        height: auto;
        margin: 0 auto; 
    }

    @media only screen and (max-width: 1000px) {
        #demo-container {
            width: 85%;
        }
    }
</style>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.2/plyr.css" />
</svelte:head>

{#if videoLink}
    <div id="demo-container">
        <div id="demo" data-plyr-provider="youtube" data-plyr-embed-id="{videoLink}"></div>
    </div>
{/if}