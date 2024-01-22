const fs = require('fs').promises;
const path = require('path');
let dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, {withFileTypes: true})
    .then(filenames => {
        for (let filename of filenames) {
            if (filename.isFile() === true) {
                (async () => {
                    try {
                      const stats = await fs.stat(path.join(dir, filename.name));
                      console.log(`${filename.name.slice(0, filename.name.lastIndexOf('.'))} - ${path.extname(filename.name).slice(1)} - ${stats.size}b`)
                    }
                    catch (error) {
                      console.log(error);
                    }
                  })();
            }
        }
    })
    .catch(err => {
        console.log(err)
    })