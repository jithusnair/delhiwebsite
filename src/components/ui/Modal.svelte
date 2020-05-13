<script>
    import { fade } from 'svelte/transition';
    
    export let displayModal = true;
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
    <div transition:fade={{duration: 500}} class="background">
        <slot></slot>
    </div>
{/if}