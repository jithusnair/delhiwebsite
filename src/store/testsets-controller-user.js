import { writable } from 'svelte/store';

export let purchasedStore = writable(0);

export let testPackStore = writable(0);

export let sectionStore = writable(0);

export let chapterStore = writable(0);

export let testSetsStore = writable(0);

export let selectedSectionStore = writable(0);

export let selectedChapterStore = writable(0);

export let chapterDisplayStore = writable(0);

export let testSetsDisplayStore = writable(0);