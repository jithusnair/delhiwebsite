import { writable } from 'svelte/store';

export let sectorStore = writable(0);

export let examStore = writable(0);

export let selectedSectorStore = writable(0);

export let selectedExamStore = writable(0);

export let examDisplayStore = writable(0);

export let testPacksDisplayStore = writable(0);