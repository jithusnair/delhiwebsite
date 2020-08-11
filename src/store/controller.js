// Controls question display part of admin
import { writable } from 'svelte/store';

// Currently Selected Language
export const selectedEnglish = writable(true); //if false language is Hindi

// Currently Selected Subject
export const selectedSubject = writable(0);

// Subjects in questions db
export const questionSubjects = writable(0);

// Currently displayed question
export const questionDisplay = writable(0);

// Question Numbers
export const questionNumber = writable(0);

