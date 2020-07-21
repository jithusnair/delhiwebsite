<script>
    import NewSubject from './NewSubject.svelte';
	import Subjects from './Subjects.svelte';

	export let testPackId;
	export let testSetId;
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
        <NewSubject
			{testSetId}
            {testPackId}
			on:save
		/>
	</div>

	<div class="righthalf">
        <Subjects
			{testSetId}
            {testPackId}
            on:update
            on:delete
        />
	</div>
</div>