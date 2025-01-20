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
let contentTemp = '';

async function copyFiles (oldDir, newDir) {
 fs.readdir(oldDir, {withFileTypes: true})
  .then (filenames => {
    for (let filename of filenames) {
      if (filename.isFile() === true) {
        (async () => {
          try {
            await fs.copyFile(path.join(oldDir, filename.name), path.join(newDir, filename.name));
          } catch {
            console.error('Error!!!!');
          }
        })();
      }
      else {
        fs.mkdir(path.join(newDir, filename.name), { recursive: true })
        copyFiles (path.join(oldDir, filename.name), path.join(newDir, filename.name));
      }
    }
  })
}

async function createDir () {
  fs.mkdir(newDir, { recursive: true })
  fs.mkdir(newAssets, { recursive: true })
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
                            contentArr.push(contentTemp);
                            if (contentArr.length === filenames.length) {
                              fs.appendFile(indexFile, contentArr[contentArr.length - 1], function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                              });
                            }
                          }
                          catch (error) {
                            console.log(error);
                          }
                        })();
                  }
              }
            return contentTemp;
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
      .then(
        copyFiles(assetsDir, newAssets)
      )      

 