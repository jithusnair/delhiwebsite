<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

    const dispatch = createEventDispatcher()

    export let orderDetails;

    // name of the collection in DB just to know where to redirect to
    export let collection;
    export let courseID;

    function loadedScript() {
        var options = {  
            "key": "rzp_live_gwdkXhoeqxJdpy", 
            "amount": parseInt(orderDetails.amount)*100,
            "currency": orderDetails.currency,
            "name": "Direction Academy",
            "image": 'https://direction-academy.com/logo.jpg',
            "description": "Test Transaction",
            "order_id": orderDetails.orderID,
            "handler": function (response){
                checkPaymentStatus(response);
            },
            "theme": {
                "color": "#222749"
            }
        };
        let razorpay = new Razorpay(options);
        razorpay.open()
    }

    // On the server end, a webhook is received which confirms the payment.
    // However, if for some reason, the webhook did not reach our servers the
    // user's cash will be captured but our server won't be updated. 
    // Therefore, just to be sure, we can use the client side handler to 
    // send the response to server to update payment status IF it did not 
    // receive one from razorpay already.
    // This is to verify the status immediately for the client. If the webhook
    // did fail, Razorpay actually does try again and again for the next 24hrs.
    // So chances of this happening is pretty low.
    function checkPaymentStatus(data) {
        let coursePaidFor;
        let errorMessage = 'Sorry, something went wrong!<br>'+
        'If the amount was deducted from your account the payment might '+
        'have been successful.<br><br>Please logout and login to your account and '+
        'check again.'

        if(collection=='VideoCourseDetail') {
            coursePaidFor = 'videocourse';
        }
        else {
            //depending on which DB collection, set the payment URL accordingly
            // for now this else part is left as is. 
            // This might be expanded in future.
        }
        fetchWithTimeout(`/user/payment/${coursePaidFor}/${courseID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data)
            },
            30000)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    dispatch('success');
                    gtag_report_conversion();
                }
                else if (data.paymentErr) {
                    dispatch('fail', data.msg);
                }
                else {
                    dispatch('error', data.msg);
                }
            })
            .catch((error) => {
                // Here we don't need to distinguish between timeout errors
                // or other errors, either way, the same error message has 
                // to be sent
                console.log('Client Side Error: ', error);
                dispatch('error', errorMessage);
        });
    }

</script>

<svelte:head>
    <script 
        type="text/javascript" 
        src="https://checkout.razorpay.com/v1/checkout.js"
        on:load={loadedScript}
    >
    </script>
</svelte:head>