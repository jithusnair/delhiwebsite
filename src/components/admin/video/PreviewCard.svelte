<script>
    import { scale } from 'svelte/transition';

    export let data;
</script>

<style>
    /* Override the global button properties */
    button {
        margin: 0 auto 0 auto;
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: auto;
        text-align:center;
        cursor: default;
        pointer-events:none;
    }

	img {
        object-fit: cover;
		width: 100%;
        height: 37.5%;
        border-top-left-radius: 1.5rem;
        border-top-right-radius: 1.5rem;
    }

	.course {
		width: 300px;
		margin: 5rem auto;
		border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        position: relative;
		height: 450px;
		text-align: left;
        z-index: -1;
	}

	.content {
		padding: 1rem 3rem;
		height: 282px;
	}

    .plan-features {
        align-self: flex-start;
        margin: 0 0 1rem 0;
    }
    .plan-features div {
        display: flex;
        margin-bottom: 0.5rem
    }
    .tick {
        color: #4aae5e;
        line-height: 2.6rem !important;
        font-size: 2rem !important;
    }

    .plan-features p {
        font-size: 1.6rem;
        line-height: 2.6rem;
    }

    h4 {
        position: relative;
        text-align: center;
        margin: 0 auto;
    }
</style>

{#if data}
    <div class="course" id="img-1" transition:scale|local="{{duration: 400}}" >
        <img src="/images/cards/thumbnail.png" alt="">
        <div class="content">
            {#if data.courseTitle}
                <h4>{data.courseTitle}</h4>
            {/if}
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
            <button 
                onclick="" 
                class="btn"
                >
                Enroll Today
            </button>
        </div>
    </div>
{/if}