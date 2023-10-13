const Notes = class {
    constructor(notes) {
        this.notes = notes || [];
    }

    setNote(note) {
        this.notes.push(note);
    }

    setNotes(notes) {
        this.notes = notes;
    }

    getNotes() {
        return this.notes;
    }

    removeNote(note) {
        const newNotes = this.notes.filter((item) => item !== note);
        this.setNotes(newNotes);
    }
};

const Note = class {
    static counter = 0

    constructor(note, type) {
        this.note = note;
        this.type = type;
        this.noteDivId = null;
    }

    static generateUniqueId() {
        return Note.counter++;
    }

    setNote(note) {
        this.note = note;
    }

    getNote() {
        return this.note;
    }

    createNote(id) {
        this.noteDivId = id == null ? `note${Note.generateUniqueId()}` : id;
        if (this.type == 'writer') {
            this.createWriterNote();
        } else if (this.type == 'reader') {
            this.createReaderNote();
        }
    }

    createWriterNote() {
        const noteDiv = document.createElement('div');
        noteDiv.className = `${this.type}Note`;
        noteDiv.id = this.noteDivId;

        const textarea = document.createElement('textarea');
        textarea.id = 'note';
        textarea.rows = 10;
        textarea.cols = 20;
        textarea.placeholder = 'Enter note here...';
        if (this.note.trim() != '') {
            textarea.value = this.note;
        }

        const removeButton = document.createElement('button');
        removeButton.id = 'remove';
        removeButton.type = 'button';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            if (noteDiv) {
                noteDiv.remove();
            }
        });

        const lineBreak = document.createElement('br');

        noteDiv.appendChild(textarea);
        noteDiv.appendChild(removeButton);
        noteDiv.appendChild(lineBreak);

        const container = document.getElementById(this.type);
        container.appendChild(noteDiv);
    }

    createReaderNote() {
        const noteDiv = document.createElement('div');
        noteDiv.className = `${this.type}Note`;
        noteDiv.id = this.noteDivId;

        const textarea = document.createElement('textarea');
        textarea.id = 'note';
        textarea.rows = 10;
        textarea.cols = 20;
        textarea.readOnly = true;

        const lineBreak = document.createElement('br');

        noteDiv.appendChild(textarea);
        noteDiv.appendChild(lineBreak);

        const container = document.getElementById(this.type);
        container.appendChild(noteDiv);
    }
};

function prepLocalStorage() {
    if (!localStorage.getItem('notes')) {
        const notes = new Notes([]);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    const key = "key"
    window.localStorage.setItem(key, "String")
    const value = window.localStorage.getItem(key)
    window.localStorage.removeItem(key)
    window.localStorage.setItem(key, "NewString")
    console.log(value)
}

function customTime() {
    const date = new Date();
    const customFormat = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return customFormat;
}

prepLocalStorage();

export function getNotes() {
    return Notes;
}

export function getNote() {
    return Note;
}

export function getTime() {
    return customTime;
}