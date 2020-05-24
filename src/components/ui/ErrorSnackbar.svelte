<script>
    import { fade } from 'svelte/transition';

    export let show;
</script>

<style>
    .error{
        position: fixed;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        left:50%;
        bottom:1%;
        transform: translateX(-50%);
		color: #D8000C;
        background-color: #FFBABA;
        border: 1px solid;
        border-radius: 1rem;
        margin: 0px;
        padding: 2rem;
        width: auto;
        text-align: center;
        z-index:2000;
    }

    i {
        color: red;
        margin-right:1rem;
        font-size: 4rem;
    }
</style>

{#if show}
    <div transition:fade|local={{duration:500}} class="error">
        <i class="fa fa-times-circle" aria-hidden="true"></i>
        <slot>
        </slot>
    </div>
{/if}