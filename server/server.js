const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require("socket.io");
const SocketIOFile = require('socket.io-file');
var encryptor = require('./utils/crypto-file');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);



var key = 'My Super Secret Key';


app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  var uploader = new SocketIOFile(socket, {
    // uploadDir: {			// multiple directories
    // 	music: 'data/music',
    // 	document: 'data/document'
    // },
    uploadDir: 'public/data',							// simple directory
    accepts: ['audio/mpeg', 'audio/mp3', 'image/jpeg', 'application/pdf' ],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
    // maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
    chunkSize: 10240,							// default is 10240(1KB)
    transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
    overwrite: true 							// overwrite file if exists, default is true.
  });
  uploader.on('start', (fileInfo) => {
    console.log('Start uploading');
    console.log(fileInfo);
  });
  uploader.on('stream', (fileInfo) => {
    console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
  });
  uploader.on('complete', (fileInfo) => {
    console.log('Upload Complete.');
    var dir = publicPath + '/data/' + fileInfo.name;
    encryptor.encryptFile(dir, dir + '.encrypted', key, { algorithm: 'aes192' }, function (err) {
      console.log("complete!");
    });
  });
  uploader.on('error', (err) => {
    console.log('Error!', err);
  });
  uploader.on('abort', (fileInfo) => {
    console.log('Aborted: ', fileInfo);
  });
  
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

// var dir = publicPath + '/data/' + "BlueberryUI.pdf";
// encryptor.decryptFile(dir + '.encrypted', "hello.pdf", key +"111", { algorithm: 'aes256'}, (err) => {
//   console.log("complete!");
// });