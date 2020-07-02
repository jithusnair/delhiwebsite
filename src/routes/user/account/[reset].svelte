<script context='module'>
    export async function preload({ params, query }) {
        //reset token
		const { reset } = params;

		let tokenId;

        let userId;
        
        let serverErr;

		await this.fetch(`/user/account/reset?token=${reset}`,
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
				tokenId = data.token;
				userId = data.user;
            }
            else if(data.err) {
                serverErr = false; 
            }
            else if(data.serverErr) {
                serverErr = true;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
		});

		if (tokenId && userId) {
			return { tokenId, userId }
		}
		else if(serverErr){
			this.error(500, 'Something went wrong on our end');
        }
        else if(!serverErr) {
            this.error(400, 'Invalid link! Link may have expired');
        }
	}
</script>

<script>
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';
    import Error from '../../../components/ui/Error.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';
    import { isSecure } from '../../../_helpers/validation.js';

    let newPassword;
    let confirmPassword;

    export let tokenId;
    export let userId;

    let formDisplay = true;
    let success = false;
    let tokenAbsentError;
    
    let resetErr;
    let timeOutErr;

    $: if(resetErr) {
        setTimeout(() => {
            resetErr = false;
        }, 5000);
    }

    function resetPassword() {
        let newPassInvalid = !newPassword || !isSecure(newPassword);
        let confirmPassInvalid = !confirmPassword || !isSecure(confirmPassword);
        if( newPassInvalid || confirmPassInvalid) {
            resetErr = 'Password must be at least 8 characters';
            return
        }
        else if(newPassword != confirmPassword) {
            resetErr = 'Passwords do not match';
            return
        }

        let data = {token:tokenId, user:userId, newPassword: newPassword};
        
        fetchWithTimeout('user/account/reset', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
            },
            10000)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formDisplay = false;
                    success = true;
                }
                else if (data.serverErr) {
                    resetErr = data.serverErr;
                }
                else if (data.err) {
                    formDisplay = false;
                    tokenAbsentErorr = true;
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    timeOutErr = 'Server taking too long to respond! Request Timed out';
                }
                console.error('Error:', error);
            });
    }
</script>

<style>
    .reset {
        position: fixed;
        width: 300px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .logo{
        background: rgb(34,39,73);
		padding:1rem 2vw 1rem 0;
        width: inherit;
		color: var(--white);;
		display: flex;
        justify-content: center;
        margin-bottom: 2rem;
	}

    .logo-img {
		width: 4rem;
		margin-right: 10px;
	}

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #heading {
        text-align: center;
        margin: 2rem;
    }

    input {
        margin: 1rem auto 2rem auto;
    }

    p {
        font-size: 1rem;
    }

    .logo-name {
        text-transform: uppercase;
        color: #fff;
        line-height: 2.3rem;
    }

    .academy {
		letter-spacing: 0.83rem;
	}
</style>

<div class="reset">
    <div class="logo">
        <img src="images/nav/logo.png" alt="" class="logo-img">
        <div class="logo-text">
            <h3 class="logo-name">Direction</h3>
            <h5 class="logo-name"><span class="academy">Academy</span></h5>
        </div>
    </div>
    {#if formDisplay}
        <h3 id="heading">Reset Password</h3>
        <form on:submit|preventDefault={resetPassword}>
            <Error showErr={resetErr? true: false}>
                <p class="error-message">{resetErr}</p>
            </Error>
            <input 
                bind:value={newPassword} 
                type="password" 
                placeholder="New Password"
            >
            <input 
                bind:value={confirmPassword} 
                type="password" 
                placeholder="Confirm New Password">
            <button id="loginBtn">Reset Password</button>
        </form>
    {:else if success}
        <h3 id="heading">Success</h3>
        <p>Password has been reset successfully. 
        You can now go to our website to login using the new password. </p>
    {:else if tokenAbsentError}
        <h3 id="heading">Failed</h3>
        <p>Something is wrong. 
        It is possible that you kept open this page for far too long and 
        that the link we sent via email has expired.</p>
    {/if}
</div>

<ErrorSnackbar show={timeOutErr? true: false}>
    <p>{timeOutErr}</p>
</ErrorSnackbar>