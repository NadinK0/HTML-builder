const fs = require('fs');
const path = require('path');
let txtFile = path.join(__dirname, '/text.txt');
const stream = fs.createReadStream(txtFile, {encoding: 'utf-8'});
stream.on('readable', function(){
    let data = stream.read();
    if(data != null) {
        console.log(data);
    }
});