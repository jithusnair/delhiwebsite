// Controls question display part of admin
import { writable } from 'svelte/store';


// Currently Selected Subject
export const selectedSubject = writable(0);

// Subjects in questions db
export const questionSubjects = writable(0);

// Currently displayed question
export const questionDisplay = writable(0);

// Question Numbers
export const questionNumber = writable(0);

