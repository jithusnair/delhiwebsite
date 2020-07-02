<script context='module'>
    export async function preload({ params }) {
		let orderData;

		await this.fetch(`/admin/orders/getorders`,
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
                orderData = data.data;
            }
            else if (data.err) {
                this.error(401, 'Unauthorized')
            }
            else if (data.serverErr) {
                this.error(500, 'Server issues')
            }
        })
        if(orderData) return { orderData };
	}
</script>

<script>
    import Orders from '../../../components/admin/order/orders.svelte';

    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    
    export let orderData;

    let filterData = [...orderData];

    let searchText = '';

    let totalRevenue = tweened(0, {
        duration: 400,
        easing: cubicOut
	});
    

    let options = [
        { mode: "Order ID", text: `Order ID`},
		{ mode: "Customer Name", text: `Customer Name` },
        { mode: "Course", text: `Course`},
        { mode: "Status", text: `Status`}
    ];

    let selected = options[0];

    $: if(selected) {
        revenue();
        search();
    }
    // ALSO CHECK FOR PAID STATUS WHEN CALCULATING

    function revenue() {
        let sum = 0;
        for (let i = 0; i < filterData.length; i++) {
            if(filterData[i].status == 'captured') {
                sum = sum + parseInt(filterData[i].amount);
            }
        }
        $totalRevenue = sum/100;
    }

    function search() {
        if(searchText == '') filterData = [...orderData];
        let pattern = new RegExp(searchText.toLowerCase());
        if(selected.mode == 'Order ID') {
            filterData = orderData.filter((eachOrder)=>{
                return pattern.test(eachOrder.orderId.toLowerCase())
            });
        }
        else if(selected.mode == 'Customer Name') {
            filterData = orderData.filter((eachOrder)=>{
                return pattern.test(eachOrder.userId.fullname.toLowerCase())
            });
        }
        else if(selected.mode == 'Course') {
            filterData = orderData.filter((eachOrder)=>{
                return pattern.test(eachOrder.courseId.courseTitle.toLowerCase())
            });
        }
        else if(selected.mode == 'Status') {
            if ('paid'.includes(searchText.toLowerCase()) && searchText != '') {
                    pattern = new RegExp('captured');
            }
            else if (searchText.toLowerCase().includes('c')) pattern = new RegExp('created')
            filterData = orderData.filter((eachOrder)=>{
                return pattern.test(eachOrder.status);
            });
        }
        revenue();
    }
</script>

<style>
    .input-and-revenue {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 2rem;
    }

    .container {
        display: flex;
    }

    .input-icons {
        position: relative;
        width: 300px; 
        margin-bottom: 1rem; 
    } 
        
    .icon { 
        position: absolute;
        min-width: 40px;
        font-size: 2rem;
        left: 0.75rem;
        top: 40%;
        transform: translateY(-40%); 
    } 
        
    .input-field { 
        width: 100%; 
        padding-left: 3.5rem;
    }

    input:focus + .icon {
        color: var(--blue);
    }

    .orderId {
        font-family: 'Courier New', Courier, monospace;
    }

    
    /* Reset Select */
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;
        outline: 0;
        box-shadow: none;
        border: .21rem solid var(--textbox-border-color);
        background: white;
        background-image: none;
    }
    /* Remove IE arrow */
    select::-ms-expand {
        display: none;
    }
    /* Custom Select */
    .select {
        position: relative;
        display: flex;
        width: 15rem;
        height: 4rem;
        line-height: 3;
        background: white;
        overflow: hidden;
        border-radius: 5px;
        margin-left: 1rem;
    }
    select {
        flex: 1;
        padding: 0 .5rem;
        color: var(--text);
        cursor: pointer;
    }
    /* Arrow */
    .select::after {
        content: '\25BC';
        position: absolute;
        top: 0.5rem;
        right: 0;
        padding: 0 1rem;
        cursor: pointer;
        pointer-events: none;
        -webkit-transition: .25s all ease;
        -o-transition: .25s all ease;
        transition: .25s all ease;
    }
    /* Transition */
    .select:hover::after {
        color: var(--blue); 
    }

    .revenue {
        display: flex;
        flex-direction: column;
    }
</style>

<div class="input-and-revenue">
    <div class="container">
        <div class="input-icons">
            <input 
                bind:value={searchText}
                on:input={search} 
                class="input-field" 
                type="text" 
                placeholder="Search by {selected.mode}">
            <i class="fa fa-search icon" aria-hidden="true"></i> 
        </div> 

        <div class="select">
            <select bind:value={selected}>
                {#each options as option, i}
                    {#if i == 0}
                        <option class="orderId" value={option} selected>
                            {option.text}
                        </option>
                    {:else}
                        <option value={option}>
                            {option.text}
                        </option>
                    {/if} 
                {/each}
            </select>
        </div>
    </div>
    <div class="revenue">
        <h3>Revenue of Displayed</h3>
        <h1>₹{Math.floor($totalRevenue*100)/100}</h1>
    </div>
</div>


<Orders data={filterData}/>