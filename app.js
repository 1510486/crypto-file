const encrypt  = require('file-encryptor');

const NodeRSA = require('node-rsa');

var key = new NodeRSA({b: 512});


var publicDer = key.exportKey('pkcs8-public');
var privateDer = key.exportKey('pkcs1');

console.log(publicDer,privateDer);