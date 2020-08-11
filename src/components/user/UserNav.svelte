<script>
    import { stores } from '@sapper/app';
    import { goto } from '@sapper/app';

    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';

    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout';
    import { navigationStore } from '../../store/navigation.js';
    import Error from '../ui/Error.svelte';

    const { session } = stores();

    let subnavDisplay = false;
    let hamburgerClicked = false;

    let showUserDropDown = false;

    let logoutErr;

    onMount(()=>{
        if($navigationStore == 0) {
            getNav();
        }
    });

    function getNav() {
        fetchWithTimeout('/nav/getNav', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        10000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				navigationStore.set(data.data);
            }
            else if (data.serverErr){
                serverErr = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
		})
	}

    function logout() {
        fetchWithTimeout('/user/account/loginlogout', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        30000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                goto('/');
                session.set({});
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                logoutErr = 'Server taking too long to respond! Request Timed out';
            }
            console.error('Error:', error);
        });
    }

    function gotoProfile() {
        if(page.path != '/user/profileandsettings'){
            goto('/user/profileandsettings');
            showUserDropDown = false;
        }
    }

    function closeAll() {
        subnavDisplay = false;
        hamburgerClicked = false;
        showUserDropDown = false;
    }
</script>

<style>
    .main-wrapper{
        display: flex;
        flex-direction: row;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1002;
    }

    .user-header {
        position: absolute;
        top: 2rem;
        right: 2rem;
        z-index: 1003;
    }
    .user-name {
        color: var(--text);
        cursor: pointer;
    }

    .user-list {
        position: absolute;
        right: 0;
        width: 10rem;
        padding: 1rem;
        background-color: var(--nav-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 1rem;
        border: 1px solid rgba(200, 206, 235, 0.644);
        z-index: 1004;
    }

    .side-nav{
        height: 100vh;
        background: var(--nav-color);
        position: sticky;
        top: 0;
        padding: 2rem;
        z-index: 1000;
    }

    .profileBtn {
        color: white;
        cursor: pointer;
        margin: 1rem;
    }

    .logo-img {
        width: 4rem;
        margin-right: 10px;
    }

    .logo-name {
        text-transform: uppercase;
        color: #fff;
        line-height: 2.3rem;
    }

    .academy {
		letter-spacing: 0.83rem;
	}

    .subnav-link {
        cursor: pointer;
    }

    .nav-lists{
        display: flex;
        flex-direction: column;
        margin-top: 3rem;
        height: 84%;
        overflow-y: auto;
    }

    .link {
        width: 23rem;
        display: block;
        color: var(--white);
        padding:1rem;
        margin: .5rem 2px;
        transition: all .2s ease;
        text-align: center;
    }
     
    .link:hover{
        border-radius: 4px;
        background: rgb(3, 1, 49);
    }

    .nav-logo{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    }

    /* second nav style */
    .second-nav{
        position: absolute;
        top: 12%;
        display: flex;
        flex-direction: column;
        height: 85vh;
        width: 100%;
        padding-top: 3rem;
        padding: 2rem;
        background: var(--nav-color);
        left: -30rem;
        overflow-y: auto;
        transition: all .5s ease;
    }

    .second-nav h4{
        color: var(--white);
    }

    .sub-links{
        color: var(--white);
        display: block;
        padding: .4rem 1.5rem;
        font-size: 1.4rem;
        border-radius: 3px;
        transition: all .1s ease;
    }

    .sub-links:hover{
        background-color: rgb(3, 1, 49);
    }

    .active{
        left: 0;
    }

    .second-nav::-webkit-scrollbar-track {
        --webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: rgb(34,39,73);
    }

    .second-nav::-webkit-scrollbar {
        width: 10px;
        background-color: rgb(18, 24, 68);
    }

    .second-nav::-webkit-scrollbar-thumb {
        background-color: rgb(48, 63, 148);
        border: 2px solid #2a2e3f;
    }

    .second-nav-head {
        cursor: pointer;
        color: var(--white);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .side-nav-button {
        cursor: pointer;
        color: var(--white);
        display: none;
        z-index: 1000000;
    }

    @media only screen and (max-width: 1100px){
        .side-nav{
            position: fixed;
            height: auto;
            width: 100%;
            height: 7rem;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center ;
        }
        .nav-lists{
            position: fixed;
            top: 0;
            margin-top: 4%;
            left: -100%;
            height: 100vh;
            width: 40vw;
            background-color: var(--nav-color);
            align-items: center;
            justify-content: center;
            transition: all .5s ease;
            z-index: 998;
        }
        .second-nav{
            position: fixed;
            top: 7rem;
            left: -100%;
            width: 40vw;
            height: 100vh;
            padding-left: 3rem;
            z-index: 999;
        }

        .user-header {
            position: fixed;
        }

        .active{
            left: 0;
        }
        .side-nav-button{
            display: block;
        }
        .nav-lists li a{
            text-align: center;
            margin: .5rem;
        }
        .visible{
            display: flex;
            left: 0;
        }

        .user-name i {
           color: white;
        }

    }

    @media only screen and (max-width: 600px){
        .nav-lists{
            width: 75vw;
        }

        .second-nav{
            width: 75vw;
        }

        .user-name i {
           color: white;
        }

        .user-header {
            position: fixed;
        }
    }
</style>

<div class="top-section">
    <div class="user-header">
        <p class="user-name" on:click={() => showUserDropDown = !showUserDropDown }>
            <i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>
        </p>
        {#if showUserDropDown}    
            <ul transition:slide|local={{duration:400}} class="user-list">
                <a on:click={closeAll} href="/user/profileandsettings">
                    <li class="profileBtn">Profile</li>
                </a>
                <li class="profileBtn" on:click={logout}>Logout</li>
            </ul>
        {/if}
    </div>
</div>
<div class="main-wrapper">
    <nav class="side-nav">
        <div 
            class="side-nav-button" 
            on:click={()=> {
                    hamburgerClicked = !hamburgerClicked;
                    subnavDisplay = false;
                }
            }>
            <i class="fa fa-bars fa-3x"></i>
        </div>
        <a href="/user" class="nav-logo" on:click={closeAll}>
            <img src="/images/nav/logo.png" alt="" class="logo-img">
            <div class="logo-container">
                <h3 class="logo-name">Direction</h3>
                <h5 class="logo-name"><span class="academy">Academy</span></h5>
            </div>
        </a>
        <ul class="nav-lists {hamburgerClicked? 'visible': ''}">
            <li><a on:click={closeAll} class="link" href="/user">Home </a></li>
            <li><a on:click={closeAll} class="link" href="/user/onlineclass">Online Class</a></li>
            <li><p class="subnav-link link" on:click={()=> subnavDisplay = true}>Exam</p></li>
            <li><a on:click={closeAll} class="link" on:click={closeAll} href="/user/tests">Tests</a></li>
        </ul>

        <div class="second-nav {subnavDisplay? 'active': ''}">
            <h3 class="second-nav-head" on:click = {() => subnavDisplay = false}>
                Exams&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-left"></i>
            </h3>
            <br><br>
            {#each $navigationStore as sector}
                <h4>{sector.sectorTitle}</h4>
                <ul>
                    {#each sector.exams as exam}
                        <li>
                            <a on:click={closeAll} class='sub-links' href={"/user/exams/" + exam.examShortTitle}>{exam.examShortTitle.toUpperCase()}</a>
                        </li>
                    {/each}
                </ul>
            {/each}            
        </div>

        <!-- header section after login  -->

        <!-- <div class="dashboard-header">
            <img src="../../public/images/user.jpeg" alt="user image" class="user-img">
            <ul class="user-list">
                <li><a href="#">profile</a></li>
                <li><a href="#">settings</a></li>
                <li><a href="#">logout</a></li>
            </ul>
        </div> -->
    </nav>
</div>

<!-- <div bind:this = {sidenav} class="sidenav">
    <div class="logo-container">
        <a href="/user" id="logo">
            <img src="/images/nav/logo.png" alt="" class="logo-img">
            <div class="logo-text">
                <h3 class="logo-name">Direction</h3>
                <h5 class="logo-name"><span class="academy">Academy</span></h5>
            </div>
        </a>
    </div>
    <div id="nav">
        <p on:click={goHome}>
            Home
        </p>
        <p on:click={gotoOnlineClass}>
            Online Classes
        </p>
    </div>
</div> -->

<Error showErr={logoutErr? true: false}>
    <p class="error-message">{logoutErr}</p>
</Error>