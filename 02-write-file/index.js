const fs = require('fs');
const path = require('path');
const readline = require('readline');

let txtFile = path.join(__dirname, '02-write-file.txt');
fs.open(txtFile, 'w', (err) => {
    if(err) throw err;
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt(`Hello! Please, enter your text\n`);
rl.prompt();
rl.on('line', (textOfUser) => {
    if (textOfUser === 'exit') {
        rl.close();
        console.log('Good Bye!');
    } else {
        fs.appendFile(txtFile,
            `${textOfUser}\n`,
            'utf8', (err) => {
            if (err) throw err;
        });
    }
});

rl.on('SIGINT', () => {
    rl.close();
    console.log('Good Bye!');
})