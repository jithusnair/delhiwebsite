<script>
    import TestSets from './TestSets.svelte';
    import Filter from './Filter.svelte';
    import BuyTestPackCard from './BuyTestPackCard.svelte';
    import Timer from '../../../components/ui/Timer.svelte';
    import {
        purchasedStore,
        sectionStore, 
        chapterStore, 
        testSetsStore,
        testPackStore,
    } from '../../../store/testsets-controller-user.js';
    import { onMount, onDestroy } from 'svelte';
    import moment from 'moment';

	let launched;
	let timer = {
		days: '0',
		hours: '00',
		minutes: '00',
		seconds: '00'
	};
    let interval;
    
    onMount(()=>{
        countdown();
    });

	function countdown() {
		interval = setInterval(() => {
			launched = moment($testPackStore.launchDate).startOf('day') - moment();
			if(launched>0){
				let duration = moment.duration(launched);
				timer = {
					days: duration.days(),
					hours: duration.hours(),
					minutes: duration.minutes(),
					seconds: duration.seconds(),
				}
			}
			else if(interval) clearInterval(interval);
		}, 1000);
    }

    onDestroy(()=>{
		if(interval) {
			clearInterval(interval)
		}
	});

    $: console.log($purchasedStore);
</script>

<style>
    .container {
        display: grid;
        position:relative;
        grid-template-areas: 
            'filter buynow'
            'testsets buynow';
        grid-gap: 2rem;
        width: 95%;
        justify-items: center;
        margin: 3rem auto;
    }

    .filter {
        grid-area: filter;
        width: 100%;
    }

    .buynow {
        grid-area: buynow;
    }

    .testsets {
        grid-area: testsets;
        margin-top: 2rem;
        display: grid;
        grid-template-columns: auto;
        grid-gap: 3rem;
    }

    @media screen and (max-width:850px){
        .container {
            grid-template-areas:
                'filter'
                'testsets'
                'buynow';
        }
    }
</style>

{#if $sectionStore && $chapterStore && $testSetsStore}
    <div class="container">
        {#if launched != undefined}
            {#if launched>0}
                <div class="timer">
                    <h2>Tests Will Launch In</h2>
                    <Timer {timer}/>
                </div>
            {:else}
                <div class="filter">
                    <Filter/>
                </div>
                <div class="testsets">
                    <TestSets on:unlock/>
                </div>
            {/if}
            {#if !$purchasedStore}
                <div class="buynow">
                    <BuyTestPackCard on:buy/>
                </div>
            {/if}
        {/if}
    </div>
{/if}