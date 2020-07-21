<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    
    export let displayModal = false;

    let initialisedScroll;
    onMount(()=> {
        enableScroll();
        initialisedScroll = true;
    })

    $:  if(displayModal) disableScroll();
        else if(initialisedScroll) enableScroll();

    function disableScroll() {
        // Get the current page scroll position 
        let scrollTop =
            window.pageYOffset || document.documentElement.scrollTop; 
        let scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft; 

        // if any scroll is attempted, 
        // set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        };
    } 

    function enableScroll() {
        if(window) window.onscroll = function() {}; 
    }
</script>

<style>
    .background {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        position:fixed;
        top: 0;
        left:0;
        z-index: 1002;
    }
</style>

{#if displayModal}
    <div transition:fade|local={{duration: 500}} class="background">
        <slot></slot>
    </div>
{/if}