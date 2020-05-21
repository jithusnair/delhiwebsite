<script>
    import PreviewCard from '../../../components/admin/video/PreviewCard.svelte';
    import CourseNewAndEdit from '../../../components/admin/video/CourseNewAndEdit.svelte';

    let data;
</script>

<style>
    .topContainer {
		width: 80%;
		margin: 10rem auto 2rem auto;
		display: flex;
		justify-content: space-evenly;
		border-top: grey solid 1px;
	}

	.bottomContainer {
		width: 80%;
		margin: 2rem auto;
	}
	
	.lefthalf, .righthalf {
		width: 50%;
		text-align: center;
		height: 600px;
		border-bottom: 1px solid black; 
	}

	.righthalf {
		border-left: 1px solid black;
	}
</style>

<div class="topContainer">
	<div class="lefthalf">
		<h1>Online Courses</h1>
		<CourseNewAndEdit/>
	</div>

	<div class="righthalf">
		<h1>Preview</h1>
		<div>
			<PreviewCard {data}/>
		</div>
	</div>
</div>


