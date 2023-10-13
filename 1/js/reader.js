import {
    getConfig
} from './prod.js';
import {
    getNotes,
    getTime,
    getNote
} from './common.js';

const config = getConfig();
const Notes = getNotes();
const Note = getNote();
const notes = new Notes(JSON.parse(localStorage.getItem('notes')).notes);

function prepReader() {
    const index = document.getElementById('index');
    index.setAttribute('onclick', `location.href='${String(config.index_url)}'`);

    const note_objects = notes.getNotes();
    const new_note_objects = [];
    note_objects.forEach((note) => {
        const note_object = new Note(note.note, 'reader');
        note_object.createNote(note.noteDivId);
        new_note_objects.push(note_object);
    });
    notes.setNotes(new_note_objects);
}

async function saveNotesAsync() {
    while (true) {
        const currentNotes = JSON.parse(localStorage.getItem('notes')).notes;
        const oldNotes = notes.getNotes();
        oldNotes.forEach((note) => {
            const exists = currentNotes.some((obj) => obj.noteDivId === note.noteDivId);
            if (!exists) {
                const remove = document.getElementById(note.noteDivId);
                if (remove) {
                    remove.remove();
                }
            }
        });
        notes.setNotes(currentNotes);
        const note_objects = notes.getNotes();
        note_objects.forEach((note) => {
            const textArea = document.querySelector(`#${note.noteDivId} #note`);
            if (textArea) {
                textArea.value = note.note;
            } else {
                const note_object = new Note(note.note, 'reader');
                note_object.createNote(note.noteDivId);
            }
        });
        const time = document.getElementById('time');
        time.textContent = getTime()();
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
}

prepReader();
saveNotesAsync();