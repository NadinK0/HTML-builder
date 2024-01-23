const fs = require('fs').promises;
const path = require('path');
const tempFile = path.join(__dirname, 'template.html');
const dir = path.join(__dirname, 'components');
const newDir = path.join(__dirname, 'project-dist');
const newAssets = path.join(newDir, 'assets');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
let indexFile = path.join(__dirname, 'project-dist', 'index.html');
let styleFile = path.join(__dirname, 'project-dist', 'style.css');
let contentTemp;

async function createDir () {
  fs.mkdir (newDir, { recursive: true });
  fs.mkdir (newAssets, { recursive: true });

  fs.readdir(newDir)
      .then (files => {
          if (files.length !== 0) {
              for (let file of files) {
                  (async () => {
                      try {
                          await fs.unlink(path.join(newDir, file), (err => {
                              if (err) console.log(err)}));
                      } catch {
                          console.error('Error!');
                      }
                  })();
              }
          }
      })

      fs.readdir(assetsDir, {withFileTypes: true})
      .then (filenames => {
          for (let filename of filenames) {
            if (filename.isFile() !== true) {
              (async () => {
                try {
                    await fs.mkdir (path.join(newAssets, filename.name), { recursive: true });
                } catch {
                    console.error('Error!');
                }
              })();
            } else {
              const innerDir = path.join(assetsDir, filename.name);
              console.log(innerDir);
              fs.readdir(innerDir)
                .then (files => {
                   for (let file of files) {
                    (async () => {
                        try {
                            await fs.copyFile(path.join(innerDir, file), path.join(newAssets, file));
                        } catch {
                            console.error('Error!');
                        }
                    })();
                    }
                })
              }
          }
      })
}


(async () => {
    try {
      contentTemp = await fs.readFile(tempFile, { encoding: 'utf8' });
      return contentTemp;
    }
    catch (error) {
      console.log(error);
    }
  })();

createDir()
.then(
fs.readdir(dir, {withFileTypes: true})
    .then(filenames => {
        const contentArr = [];
        for (let filename of filenames) {
            if (filename.isFile() === true && path.extname(filename.name) === '.html') {
                (async () => {
                    try {
                      const componentsContent = await fs.readFile(path.join(dir, filename.name), { encoding: 'utf8' });
                      const fname = filename.name.slice(0, filename.name.lastIndexOf('.'));
                      contentTemp = contentTemp.replace(`{{${fname}}}`, componentsContent);
                      fs.appendFile(indexFile, contentTemp, function (err) {
                        if (err) throw err;
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
  )
  .then (
    fs.readdir(stylesDir, {withFileTypes: true})
    .then(filenames => {
        const contentArr = [];
        for (let filename of filenames) {
            if (filename.isFile() === true && path.extname(filename.name) === '.css') {
                (async () => {
                    try {
                      const content = await fs.readFile(path.join(stylesDir, filename.name), { encoding: 'utf8' });
                      contentArr.push(content)
                      fs.appendFile(styleFile, contentArr, function (err) {
                        if (err) throw err;
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
)