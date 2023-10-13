import {
    getConfig
} from './prod.js';

const config = getConfig();

function prepIndex() {
    const writer = document.getElementById('writer');
    const reader = document.getElementById('reader');

    writer.setAttribute('onclick', `location.href='${String(config.writer_url)}'`);
    reader.setAttribute('onclick', `location.href='${String(config.reader_url)}'`);
}

prepIndex();