<script>
import Order from './order.svelte';

export let data;
</script>

<style>
    .container {
        width: 95%;
        margin: 0 auto;
    }

    .column-head {
        display: grid;
        width: 1000px;
        margin: 1rem auto;
        grid-template-columns: 175px 125px 125px 100px 125px 225px;
        grid-gap: 2rem;
        padding: 2rem;
        border-radius: 1rem;
    }

    p {
        text-align: left;
        color:var(--blue);
    }
    #empty {
        margin-left: 2.5rem;
        color: var(--text);
    }
</style>

<div class="container">
    <div class="column-head">
        <p>Order ID</p>
        <p>Customer</p>
        <p>Course</p>
        <p>Amount</p>
        <p>Status</p>
        <p>Last Updated & Valid Till</p>
    </div>
</div>

{#if data && data.length!=0}
    {#each data as order (order._id)}
        <Order data={order}/>
    {/each}
{:else}
    <p id="empty">No orders</p>
{/if}