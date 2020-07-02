<script>
    import { stores } from '@sapper/app';
    import { goto } from '@sapper/app';

    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';

    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout';
    import Error from '../ui/Error.svelte';

    const { page, session } = stores();

    let sidenav;
    let mobileMode = false;
    let hamburgerClicked = false;

    let showUserDropDown = false;

    let mediaQuery;

    let logoutErr;

    onMount(()=>{
        mediaQuery = window.matchMedia("(max-width: 1000px)");
        checkSideNav(mediaQuery);
        mediaQuery.addListener(checkSideNav);
    })

    function checkSideNav(x) {
        if (x.matches) { // If media query matches
            sidenav.style.left = "-225px";
            mobileMode = true;
        } else {
            sidenav.style.left = "0px";
            mobileMode = false;
        }
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

    function navController() {
        hamburgerClicked = !hamburgerClicked;
        if (hamburgerClicked) {
            sidenav.style.left = '0px';
            showUserDropDown = false;
        } else {
            sidenav.style.left = '-225px';
        } 
    }

    function userProfile () {
        showUserDropDown = !showUserDropDown;
    }

    function gotoProfile() {
        if(page.path != '/user/profileandsettings'){
            goto('/user/profileandsettings');
            showUserDropDown = false;
            if(mobileMode) {
                sidenav.style.left = '-225px';
                hamburgerClicked = false;
            }
        }
    }

    function goHome() {
        goto('/user');
        if(mobileMode) {
            sidenav.style.left = '-225px';
            hamburgerClicked = false;
        }
    }

    function gotoOnlineClass() {
        goto('/user/onlineclass');
        if(mobileMode) {
            sidenav.style.left = '-225px';
            hamburgerClicked = false;
        }
    }
</script>

<style>
    .sidenav {
        height: 100%;
        width: 225px;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgb(34,39,73);
        padding-top: 10px;
        font-size: 1.5rem;
        transition: left 0.5s;
        z-index: 1000;
    }

    /* Style the sidenav links and the dropdown button */
    .sidenav p {
        padding: 6px 8px 6px 16px;
        text-decoration: none;
        color: white;
        display: block;
        border: none;
        background: none;
        width:100%;
        text-align: left;
        cursor: pointer;  
    }

    .sidenav p {
        margin-top: 1.7rem;
        margin-left: 1rem;
        margin-bottom: 1.7rem;
    }

    /* On mouse-over */

    #logo{
        padding:1.5rem;
        color: #fff;;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        margin-top: 0;
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

    #nav {
        margin-top: 1rem;
    }

    .hamburger {
        display: none;
        border-radius: 1rem;
        position: absolute;
        top: 1.2rem;
        left: 2rem;
        cursor: pointer;
    }

    i {
        color: inherit;
    }

    .user-header {
        position: absolute;
        top: 2rem;
        right: 4rem;
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
        z-index: 1001;
    }

    li, a {
        color: white;
    }

    li {
        margin: 1rem;
    }

    .profileBtn {
        cursor: pointer;
    }

    /* to avoid sticky hover problems

        https://css-tricks.com/solving-sticky-hover-states-with-media-hover-hover/
    
    */
    @media (hover: hover) {
        
        li:hover, a:hover {
            color: var(--blue);
        }
        .sidenav p:hover {
            color: rgb(136, 136, 247); 
        }

        .hamburger:hover i {
            color: var(--blue);
        }
    }

    @media only screen and (max-width: 1000px) {
        .top-section {
            position: fixed;
            top: 0;
            left: 0;
            background-color: var(--nav-color);
            width: 100%;
            height: 6rem;
            z-index: 1000;
        }

        .user-name {
            color: white;
        }

        .hamburger {
            display: block;
            color: white;
        }

        .logo-container {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }
        .logo-img {
            display:none;
        }

        .user-header {
            top: 1.5rem;
            right: 1.5rem;
        }

        .sidenav {
            margin-top: 5rem;
        }

        #logo {
            padding: 0.75rem;
        }
    }
</style>

<div class="top-section">
    <div on:click={navController} class="hamburger">
        <i class="fa fa-bars fa-3x" aria-hidden="true"></i>
    </div>
    <div class="user-header">
        <p class="user-name" on:click={userProfile}>
            <i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>
        </p>
        {#if showUserDropDown}    
            <ul transition:slide|local={{duration:400}} class="user-list">
                <li class="profileBtn" on:click={gotoProfile}>
                    Profile
                </li>
                <li class="profileBtn" on:click={logout}>Logout</li>
            </ul>
        {/if}
    </div>
</div>

<div 
    bind:this = {sidenav}
    class="sidenav"
>
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
</div>

<Error showErr={logoutErr? true: false}>
        <p class="error-message">{logoutErr}</p>
</Error>