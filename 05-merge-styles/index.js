const fs = require('fs').promises;
const path = require('path');
dir = path.join(__dirname, 'styles');
bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');


fs.readdir(dir, {withFileTypes: true})
    .then(filenames => {
        const contentArr = [];
        for (let filename of filenames) {
            if (filename.isFile() === true && path.extname(filename.name) === '.css') {
                (async () => {
                    try {
                      const content = await fs.readFile(path.join(dir, filename.name), { encoding: 'utf8' });
                      contentArr.push(content)
                      fs.appendFile(bundleFile, contentArr, function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                      });
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