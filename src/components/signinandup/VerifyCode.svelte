<script>
    import Modal from '../ui/Modal.svelte';
    import Error from '../ui/Error.svelte';

    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    export let display;

    export let email;

    let digit1 = '';
    let digit2 = '';
    let digit3 = '';
    let digit4 = '';

    let input1;
    let input2;
    let input3;
    let input4;

    let verifyErr;

    function verify() {
       let data = { code: digit1+digit2+digit3+digit4 };
       console.log(data)

        fetchWithTimeout('user/account/verify', {
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
                    dispatch('success', data.msg);
                }
                else if (data.err) {
                    verifyErr = data.err;
                }
                // for now just display on the modal itself.
                // Maybe later a better alert/snackbar/something else can be shown
                else if (data.serverErr) {
                    verifyErr = data.serverErr;
                }
            })
            .catch((error) => {
                loading = false;
                if (error.name === 'AbortError') {
                    verifyErr = 'Server taking too long to respond! Request Timed out';
                }
                console.error('Error:', error);
            }); 
    }

    function inputUX(id, event) {
        if(id == 0) {
            if(event.keyCode == 8) {
                digit1 = '';
                input1.focus();
                return
            }
            let validate = inputValidate(event.key);
            if(validate) {
                digit1 = event.key;
                input2.focus();
            }
            return
        }
        if(id == 1) {
            if(event.keyCode == 8) {
                digit2 = '';
                input1.focus();
                return
            }
            let validate = inputValidate(event.key);
            if(validate) {
                digit2 = event.key;
                input3.focus();
            }
            return
        }
        if(id == 2) {
            if(event.keyCode == 8) {
                digit3 = '';
                input2.focus();
                return
            }
            let validate = inputValidate(event.key);
            if(validate) {
                digit3 = event.key;
                input4.focus();
            }
            return
        }
        if(id == 3) {
            if(event.keyCode == 8) {
                digit4 = '';
                input3.focus();
                return
            }
            let validate = inputValidate(event.key);
            if(validate) {
                digit4 = event.key;
                input4.focus();
            }
            return
        }
    }

    // 0 => backspace event
    // true => input value is fine
    // false => input value is shit
    function inputValidate(value) {
        let regex = new RegExp('[0-9]');
        return regex.test(value);
    }

    function cleanUpClose() {
        digit1 = '';
        digit2 = '';
        digit3 = '';
        digit4 = '';
        verifyErr = null;
        dispatch('close');
    }
</script>

<style>
    .verifyCode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 300px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: auto;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }

    p {
        margin: 1rem auto 0 auto;
        padding: 1rem;
        font-family: 'Roboto', sans-serif;
        text-align: center;
    }

    .verifyCode h3 {
        margin: 1.5rem auto 0 auto;
    }

    .verifyCode button {
        margin-bottom: 1.5rem;
    }

    .verifyCode form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    input {
        margin: 0 1rem 2rem 1rem;
        outline: 0;
        padding:1rem;
        border-width: 0 0 2px;
        border-radius: 0;
        width: 4rem;
        border-color: var(--nav-color);
        font-size: 3rem;
    }
    input:focus {
        border-color: var(--blue);
    }

    /* REMOVE ARROWS FROM NUMBER INPUT */
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    button {
        text-align: center;
        width: 50%;
    }

    .closeBtn {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        font-size: 2rem;
        cursor: pointer;
    }
    .error-message {
        font-size: 1rem;
        line-height: 1rem;
        margin: 0 auto;
    }
</style>

<Modal displayModal={display}>
    <div transition:scale|local={{duration: 500}} class="verifyCode">
        <h3>Verify</h3>
        <p>
            A verification code has been sent to <strong>{email}</strong>
        </p>
        <form on:submit|preventDefault={verify}>
            <Error showErr={verifyErr? true: false}>
                <p class="error-message">{verifyErr}</p>
            </Error>
            <div>
                <input 
                    bind:this={input1}
                    on:keydown|preventDefault={(e)=>{inputUX(0, e)}} 
                    bind:value={digit1} type="number"
                >
                <input 
                    bind:this={input2}
                    on:keydown|preventDefault={(e)=>inputUX(1, e)} 
                    bind:value={digit2} type="number"
                >
                <input 
                    bind:this={input3}
                    on:keydown|preventDefault={(e)=>inputUX(2, e)} 
                    bind:value={digit3} type="number"
                >
                <input 
                    bind:this={input4}
                    on:keydown|preventDefault={(e)=>inputUX(3, e)} 
                    bind:value={digit4} type="number"
                >
            </div>
            <button>Verify</button>
            <div on:click={cleanUpClose} class="closeBtn">
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
        </form>
    </div>
</Modal>