<script>
import User from './user.svelte';

export let data;
</script>

<style>
    .container {
        width: 95%;
        margin: 0 auto;
    }

    .column-head {
        display: grid;
        width: 900px;
        margin: 1rem auto;
        grid-template-columns: 150px 300px 200px 200px;
        grid-gap: 2rem;
        padding: 2rem;
        border-radius: 1rem;
    }

    p {
        text-align: left;
        color:var(--blue);
    }
</style>

<div class="container">
    <div class="column-head">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Verification Status</p>
    </div>
</div>

{#each data as user (user._id)}
    <User data={user}/>
{/each}