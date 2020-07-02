<script context='module'>
    export async function preload() {
		let purchasedCourseData;

		let getError;

		await this.fetch(`/user/purchased`,
		{	
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
			credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                purchasedCourseData = data.data;
            }
			else if (data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        if(purchasedCourseData) {
            return { purchasedCourseData }
        }
        else if (getError) {
            this.error('402', 'Authentication failed')
        }
        else {
            this.error('404', "not found");
        }
	}
</script>

<script>
    import { stores } from '@sapper/app';
    import { goto } from '@sapper/app';

    import Cards from '../../components/user/videocourse/Cards.svelte';
    import ErrorSnackbar from '../../components/ui/ErrorSnackbar.svelte';

    const { session } = stores();

    export let purchasedCourseData;
 </script>

<style>
    div {
        width: 85%;
        margin: 0 auto;
    }

    p {
        margin-bottom: 2rem;
    }

    .register-btn{
        margin-right: 4rem;
        background: #3D0CFF;
        border-radius: 5px;
        box-shadow: none;
    }
</style>
<div>
    <h2>Your Courses</h2>
    {#if purchasedCourseData && purchasedCourseData.length > 0}
        <Cards docs={purchasedCourseData}/>
    {:else}
        <p>There are no courses to display. <br> What are you waiting for? 
        Purchase a course today and start learning!</p>
        <button on:click={()=>goto('/user/onlineclass')} class="register-btn">See Courses</button>
    {/if}
</div>