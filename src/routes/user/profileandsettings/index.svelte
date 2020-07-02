<script context='module'>
    export async function preload() {
        let orderData;
        let userData;

        let getError;

		await this.fetch('/user/profileandsettings/getprofiledata',
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
				orderData = data.order;
				userData = data.user;
			}
			else if (data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
		});

		if (userData) {
			return { userData, orderData }
		}
		else {
			this.error(500, 'Something is wrong');
		}
	}
</script>

<script>
    import Transactions from '../../../components/user/account/Transactions.svelte';
    import ChangePassword from '../../../components/user/account/ChangePassword.svelte';
    import UserProfile from '../../../components/user/account/UserProfile.svelte';
    import ResendVerification from '../../../components/user/account/ResendVerification.svelte';

    import { slide } from 'svelte/transition'

    export let userData;
    export let orderData;

    let profileSelected = true;
    let settingsSelected;
</script>

<style>
    .container {
        width:90%;
        margin: 0 auto;
    }

    .btn-container {
        width:100%;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 3rem;
    }

    .tabBtn {
        cursor: pointer;
    }

    #profile-btn {
        margin-right: 5rem;
    }
    
    .active {
        border-bottom: 2px solid var(--nav-color);
    }

    @media only screen and (max-width: 1000px) {
        .container {
            width: 80%;
        }
    }

    @media only screen and (max-width: 600px) {
        .container {
            width: 95%;
        }

        .btn-container {
            justify-content: center;
        }
        h3 {
            margin-left: 2rem;
        }
    } 
</style>

<div class="container">
    <!--User dashboard-->
    <div class="btn-container">
        <h4 
            class="tabBtn {profileSelected? 'active': ''}" 
            id="profile-btn"
            on:click={()=>{profileSelected = true; settingsSelected=false}}
        >
            Profile
        </h4>
        <h4 
            class="tabBtn {settingsSelected? 'active': ''}" 
            id="settings-btn"
            on:click={()=>{profileSelected = false; settingsSelected=true}}
        >
            Settings
        </h4>
    </div>
    {#if profileSelected}
        <div transition:slide|local={{duration:200}} class="profile">
            <!--Profile -->
            <h3>Profile</h3>
            <UserProfile data={userData}/>
            
            <h3>Transactions</h3>
            <Transactions docs={orderData}/>

        </div>
    {:else if settingsSelected}  
        <!--Settings-->
        <div transition:slide|local={{duration:200}} class="settings">
            <h3>Change Password</h3>
            <ChangePassword/>

            <ResendVerification isVerified={userData.isVerified}/>
        </div>
    {/if}
</div>

    <!--User dashboard ends-->