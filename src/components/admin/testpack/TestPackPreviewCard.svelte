<script>
    import { scale } from 'svelte/transition';

    export let data;
</script>

<style>
    .price-card {
        width: 30rem;
        margin: 2rem auto;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 48rem;
        padding: 5rem 5rem 4rem 5rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .card-top {
        width: 100%;
    }

    .plan-name {
        font-size: 2rem;
        margin-bottom: 2rem;
        font-weight: 800;
    }

    .price {
        text-align: left;
        font-size: 4.5rem;
        color: rgb(93, 91, 255);
    }

    .price span {
        font-size: 3rem;
        line-height: 2.5rem;
    }

    .card-seperator {
        width: 100%;
        background-color: #85858559;
        margin: 2rem 0;
    }
    .plan-features {
        align-self: flex-start;
        margin: 0 0 3rem 0;
    }

    .plan-features div {
        display: flex;
    }

    .tick {
        color: #4aae5e;
        line-height: 2.6rem !important;
        font-size: 2rem !important;
    }

    .validity {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 500;
    }

    .buy-btn {
        margin-bottom: 1.5rem;
        justify-self: end;
        font-weight: 900;
        padding-left: 5rem;
        padding-right: 5rem;
    }
</style>

{#if data}
    <div transition:scale|local={{duration:400}} class="price-card">
        <div class="card-top">
            <h5 class="plan-name">{data.testPackTitle}</h5>
            <h2 class="price"><span>&#8377;</span>&nbsp;{data.price}</h2>
            <hr class="card-seperator">
            <div class="plan-features">
                {#each data.features as feature}
                    {#if feature}
                        <div><i class="tick fa fa-check"></i>
                            <p>&nbsp;&nbsp;</p>
                            <p>{feature}</p>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="card-bottom">
            <button class="buy-btn btn">Buy&nbsp;Now</button>
            <p class="validity">Validity: {data.validity} days</p>
        </div>
    </div>
{/if}