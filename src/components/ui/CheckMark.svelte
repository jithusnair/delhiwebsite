<script>
    import { fade, scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let display;

    $: if(display) {
        setTimeout(()=>{
            display = false;
        }, 1000)
    }
</script>

<style>
    div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    i {
        font-size: 6rem;
    }
</style>

{#if display}
    <div
        in:fade|local={{duration:500}}
        out:scale|local={{duration:500}}  
        on:outroend="{() => dispatch('done') }"
    >
        <i class="fa fa-check-circle" aria-hidden="true"></i>
    </div>
{/if}