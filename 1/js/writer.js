import {
    getConfig
} from './dev.js';
import {
    getNotes,
    getTime,
    getNote
} from './common.js';

const config = getConfig();
const Notes = getNotes();
const Note = getNote();
const notes = new Notes(JSON.parse(localStorage.getItem('notes')).notes);

function prepWriter() {
    const index = document.getElementById('index');
    index.setAttribute('onclick', `location.href='${String(config.index_url)}'`);

    const note_objects = notes.getNotes();
    const new_note_objects = [];
    note_objects.forEach((note) => {
        const note_object = new Note(note.note, 'writer');
        note_object.createNote();
        removeNote(note_object);
        new_note_objects.push(note_object);
    });
    notes.setNotes(new_note_objects);
}

function addNote() {
    const add = document.getElementById('add');
    add.addEventListener('click', () => {
        const note = new Note('', 'writer');
        note.createNote();
        notes.setNote(note);
        removeNote(note);
    });
}

function removeNote(note) {
    const remove = document.querySelector(`#${note.noteDivId} #remove`);
    remove.addEventListener('click', () => {
        notes.removeNote(note);
    });
}

async function saveNotesAsync() {
    while (true) {
        const note_objects = notes.getNotes();
        note_objects.forEach((note) => {
            const textArea = document.querySelector(`#${note.noteDivId} #note`);
            const content = textArea.value.trim();
            note.setNote(content);
        });
        localStorage.setItem('notes', JSON.stringify(notes));
        const time = document.getElementById('time');
        time.textContent = getTime()();

        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
}

addNote();
prepWriter();
saveNotesAsync();