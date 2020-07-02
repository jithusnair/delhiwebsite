<script>
    import Modal from '../../ui/Modal.svelte';
    import CourseNewAndEdit from './CourseNewAndEdit.svelte';

    import {createEventDispatcher} from 'svelte';

    import { scale } from 'svelte/transition';

    const dispatch = createEventDispatcher();

    export let display;
    export let data;
</script>

<style>
    .editCourse {
        background: white;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: scroll;
        height: 550px;
    }
</style>

<Modal displayModal = {display}>
    <!-- 
        Custom events other than those listed below in 
        CourseNewAndEdit component don't need to be handled 
        here because those events wont be triggered in 
        edit mode anyway 
    -->
    <div transition:scale|local="{{duration: 400}}" class="editCourse">
        <CourseNewAndEdit
            editData = {data}
            on:editSuccess={() => dispatch('reloadData')}
            on:close
        />
    </div>
</Modal>