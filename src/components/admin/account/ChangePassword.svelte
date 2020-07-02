<script>
    import Error from '../../ui/Error.svelte';

    import { isSecure } from '../../../_helpers/validation.js';
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    let oldPassword = '';
    let newPassword = '';
    let confirmPassword = '';
    let changeErr;
    let changeSuccess;
    let touchedNew = false;
    let touchedConfirm = false;
    
    $: newPassValid = isSecure(newPassword);
    $: confPassValid = isSecure(confirmPassword);
    $: fullValid = newPassValid && confPassValid;

    $: if(changeSuccess && (oldPassword != '' || newPassword != '' || confirmPassword != '')) {
       changeSuccess = null; 
    }

    function changePassword() {
        if(newPassword != confirmPassword) {
            changeErr = 'The new passwords are not the same.'
        }
        else {
        let data = {old: oldPassword, new:newPassword, confirm:confirmPassword};
        fetchWithTimeout('admin/account/changepassword', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
            },
            30000)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    changeSuccess = data.msg;
                    oldPassword = '';
                    newPassword = '';
                    confirmPassword = '';
                    changeErr = null;
                    newPassValid = null;
                    confPassValid = null;
                    touchedNew = false;
                    touchedConfirm = false;
                    fullValid = false;
                }
                else if(!data.success) {
                    changeErr = data.err;
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    changeErr = 'Server taking too long to respond! Request Timed out';
                }
                console.error('Error:', error);
            });
        }
    }
</script>

<style>
    .changePassword form{
        display: flex;
        flex-direction: column;
        width: 300px;
    }

    .success {
        color: green;
    }

    input {
        margin-top: 0.25rem;
        font-family: 'Roboto', sans-serif;
        font-size: 1.5rem;
        margin-top: 1rem;
    }

    .error {
        color: red;
        font-size: 1rem;
        line-height: 1rem;
        margin-top: 1rem;
    }

    button {
        width: 50%;
        margin: 2rem auto;
    }

    button:disabled {
        background: grey;
        cursor: initial;
    }
</style>

<div class="changePassword">
    <form on:submit|preventDefault={changePassword}>
        <Error showErr={changeErr? true: false}>
            <p class="error-message">{changeErr}</p>
        </Error>
        <input name='old' type="password" placeholder="Old Password" bind:value={oldPassword}>
        <input 
            class:invalid={!newPassValid && touchedNew}  
            type="password" 
            placeholder="New Password" 
            bind:value={newPassword}
            on:blur={() => touchedNew = true} 
        >
        {#if !newPassValid && touchedNew}
            <p class="error">Should be atleast 8 characters</p>
        {/if}
        <input 
            class:invalid={!confPassValid && touchedConfirm}  
            type="password" 
            placeholder="Confirm Password" 
            bind:value={confirmPassword}
            on:blur={() => touchedConfirm = true} 
            >
        {#if !confPassValid && touchedConfirm}
            <p class="error">Should be atleast 8 characters</p>
        {/if}
        <button disabled={!fullValid}>Submit</button>
    </form>
    {#if changeSuccess}
        <p class="success">{changeSuccess}</p>
    {/if}
</div>