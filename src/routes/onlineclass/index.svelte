<script context='module'>
    export async function preload() {
		let dbCourseData;

        let getError;
        let serverErr;

		await this.fetch('/readwrite/getvideocourse', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				dbCourseData = data.data;
            }
            else if (data.serverErr) {
				getError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                getError = 'Server taking too long to respond! Request timed out';
			}
            console.error('Error:', error);
        });
        if (dbCourseData) {
			return { dbCourseData }
		}
		else {
			this.error(404, getError)
        }
    }
</script>

<script>
    import ErrorSnackbar from '../../components/ui/ErrorSnackbar.svelte';
    import Cards from '../../components/videocourse/Cards.svelte';

    let getError;
    
    export let dbCourseData;

	$: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}
</script>

<style>
    .jumbotron {
        width: 90%;
        height: calc(100vh - 7rem);
        margin: 0 auto;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    h1 {
        margin-bottom: 1rem;
    }

    h3 {
        margin-left: 10rem;
    }

    .tag {
        text-align: center;
    }

    img {
        width: 50%;
    }

    @media only screen and (max-width:900px){
        .jumbotron {
            flex-direction: column;
            justify-content: flex-start;
            height: auto;
            margin-bottom: 5rem;
        }
        
        .text {
            margin-bottom: 2rem;
        }

        h1 {
            font-size: 4rem;
            margin-top: 2rem;
        }

        img {
            width: 90%;
            margin: 2rem auto;
        }
    }
</style>

<div class="jumbotron">
    <div class="text">
        <h1>Online Classes</h1>
        <p class="tag">Watch and Learn from experts. <br>Learn at ease.</p>
    </div>
    <img src="/images/course/coursebanner.jpg" alt="Boy sitting in front of computer">
</div>

<h3>Explore Courses</h3>
<Cards docs={dbCourseData}/>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>