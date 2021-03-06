<script>
    import Manager from '../../../components/user/tests/Manager.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';
    import { 
            sectorStore, 
            examStore,
            examDisplayStore,
            testPacksDisplayStore, 
            selectedSectorStore,
            selectedExamStore,
            } from '../../../store/tests-controller.js';

    import { onMount } from 'svelte';
    import { goto } from '@sapper/app';

    let sectors;
    let exams;
    let testPacks;

    let getError;

    onMount(()=> {
        if($sectorStore == 0) {
            getTestList();
        }
    });

    function getTestList() {
        fetchWithTimeout(`user/tests/getTestPacks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        10000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				sectors = data.sectors;
                exams = data.exams;
                testPacks = data.testPacks;

                setupData();
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
    }

    function setupData() {
        let examsList = {};
        for (let i = 0; i < sectors.length; i++) {
            examsList[sectors[i]._id] = exams.filter((exam)=> exam.sectorId == sectors[i]._id)
            let testPacksInSector = [];
            for (let j = 0; j < examsList[sectors[i]._id].length; j++) {
                examsList[sectors[i]._id][j].testPacks = 
                    testPacks.filter((testPack) => testPack.examId == examsList[sectors[i]._id][j]._id);
                testPacksInSector.push(...examsList[sectors[i]._id][j].testPacks);
            }
            examsList[sectors[i]._id].all = testPacksInSector;
        }
        sectorStore.set(sectors);
        examStore.set(examsList);
        selectedSectorStore.set(sectors[0]._id);
        examDisplayStore.set($examStore[$selectedSectorStore]);
        selectedExamStore.set('all');
        testPacksDisplayStore.set($examStore[$selectedSectorStore].all);
    }
</script>

<style>
    section {
        padding: 0 2rem;
    }

    .hero-section {
        height: calc(100vh - 6rem);
        display: grid;
        grid-template-columns: auto auto;
        align-content: center;
        background-color: var(--body-background);
    }

    .main-content{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    .heading{
        color: var(--dark-blue);
        font-size: 5rem;
        font-weight: 700;
        padding: 2.5rem 0;
    }

    .hero-img{
        width: 100%;
    }

    .testpacks {
        text-align: center;
        margin-bottom: 4rem;
    }

    @media screen and (max-width: 1300px){
        /* .hero-img{
            width: 44vw;
            left: 55%;
        } */
    }

    @media screen and (max-width: 850px){
        .hero-img{
            width: 50%;
        }
        
        .hero-section{
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            justify-content: start;
            height: auto;
        }

        .main-content{
            margin-top: 0;
            width: 100%;
            align-items: center;
            text-align: center;
            justify-content: center;
            padding:1rem 0 9rem 0;
        }

        .heading{
            font-size: 3.5rem;
            line-height: normal;
            padding:0 0 2.5rem 0;
        }
    }
</style>

<section class="section hero-section">
    <div class="main-content">
        <h1 class="heading">Fastest growing Test Platform</h1>
        <div class="main-text">
            <p>Take your preparations to the next level with Direction's test series and our best in class analytics.</p>
            <p>What are you waiting for?</p>
        </div>
    </div>
    <img src="/images/tests/tests.svg" alt="Tests list banner" class="hero-img">
</section>

<h2 class="testpacks">Explore Test Packs</h2>
<Manager/>

<ErrorSnackbar show = {getError? true: false}>
    {getError}
</ErrorSnackbar>