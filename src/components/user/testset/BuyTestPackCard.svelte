<script>
    import { goto } from '@sapper/app';
    import { createEventDispatcher } from 'svelte';

    import { testPackStore } from '../../../store/testsets-controller-user.js';

    let dispatch = createEventDispatcher();
</script>

<style>
    .validity {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 500;
    }

    /* new card styling */
    .card-head{
        text-align: center;
        margin-bottom: .5rem;
        color: var(--black-color);
    }
    .price-new{
        text-align: center;
        color: var(--quiz-question-color);
    }
    .gst {
        font-size: 1rem;
        color: grey;
    }
    
    .card-text p{
        font-size: 1.4rem;
        text-align: left;
    }
    .ruler{
        background-color: var(--ruler-backgroud);
        height: 0.1rem;
        width: 100%;
        margin: 1rem auto;
    }
    .card{
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding:23px;
        border-radius: 8px;
        margin-bottom: 5rem;
        width: 30rem;
        min-width: 23rem;
        height: 38rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: var(--white);
    }
    .start-btn{
        margin: 2rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .start-btn .btn{
        width: 70%;
        margin-top: .5rem;
    }
</style>

{#if $testPackStore != 0}
    <div class="card">
        <div class="card-head">
            <h3 class="card-head">{$testPackStore.testPackTitle}</h3>
            <h5 class="price-new">
                <span>&#8377;</span>&nbsp;{$testPackStore.price}
                <span class="gst">
                    + ₹{Math.floor(parseInt($testPackStore.price)*18)/100} GST
                </span>
            </h5>
            <div class="ruler"></div>
        </div>

        <div class="card-text">
            {#each $testPackStore.features as feature}
                {#if feature}
                    <p>{feature}</p>
                {:else}
                    <p>&nbsp;</p>
                {/if}
            {/each}
        </div>
        
        <div class="start-btn">
            <div class="ruler"></div>
            <button class="btn" on:click={() => dispatch('buy')}>
                Buy Now <i class="fa fa-shopping-bag" aria-hidden="true"></i>
            </button>
            <p class="validity">Validity: {$testPackStore.validity} days</p>
        </div>
    </div>
{/if}