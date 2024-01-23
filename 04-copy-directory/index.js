const fs = require('fs').promises;
const path = require('path');
let oldDir = path.join(__dirname, 'files');
let dir = path.join(__dirname, 'files-copy');

async function copyDir () {
    fs.mkdir (dir, { recursive: true });

    fs.readdir(dir)
        .then (files => {
            if (files.length !== 0) {
                for (let file of files) {
                    (async () => {
                        try {
                            await fs.unlink(path.join(dir, file), (err => {
                                if (err) console.log(err)}));
                        } catch {
                            console.error('Error!');
                        }
                    })();
                }
            }
        })


    fs.readdir(oldDir)
        .then (filenames => {
            for (let filename of filenames) {
                (async () => {
                    try {
                        await fs.copyFile(path.join(oldDir, filename), path.join(dir, filename));
                    } catch {
                        console.error('Error!');
                    }
                })();
            }
        })
}

copyDir();

