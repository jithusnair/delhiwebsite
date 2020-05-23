<script>
    import { fade } from 'svelte/transition';

    export let showErr = false;
</script>

<style>
    .error{
		color: #D8000C;
        background-color: #FFBABA;
        border: 1px solid;
        border-radius: 1rem;
        margin: 0px;
        padding: 0px 10px;
        width: 100%;
        text-align: center;
    }
</style>

{#if showErr}
    <div transition:fade|local={{duration:500}} class="error">
        <slot>
        </slot>
    </div>
{/if}