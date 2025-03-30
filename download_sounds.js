const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const sounds = {
    'simonSound1.mp3': 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
    'simonSound2.mp3': 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
    'simonSound3.mp3': 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
    'simonSound4.mp3': 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',
    'correct.mp3': 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    'fail.mp3': 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'
};

const soundsDir = path.join(__dirname, 'sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir);
}

function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(soundsDir, filename);
        const file = fs.createWriteStream(filepath);
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(filepath, () => {}); // Delete the file if there was an error
            console.error(`Error downloading ${filename}:`, err.message);
            reject(err);
        });
    });
}

async function downloadAllSounds() {
    console.log('Starting downloads...');
    try {
        await Promise.all(
            Object.entries(sounds).map(([filename, url]) => downloadFile(url, filename))
        );
        console.log('All sounds downloaded successfully!');
    } catch (error) {
        console.error('Error downloading sounds:', error);
    }
}

downloadAllSounds(); 