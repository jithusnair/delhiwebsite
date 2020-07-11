<script>
    import NewSection from './NewSection.svelte';
	import Sections from './Sections.svelte';

    export let testPackId;
</script>

<style>
    .topContainer {
		width: 100%;
		margin: 2rem auto 2rem auto;
		display: flex;
		justify-content: space-evenly;
		border-top: grey solid 1px;
    }

	.lefthalf, .righthalf {
		width: 50%;
		text-align: center;
		height: auto;
		border-bottom: 1px solid black; 
	}

	.righthalf {
		border-left: 1px solid black;
	}
</style>

<div class="topContainer">
	<div class="lefthalf">
        <NewSection
            {testPackId}
			on:save
		/>
	</div>

	<div class="righthalf">
        <Sections
            {testPackId}
            on:update
            on:delete
        />
	</div>
</div>