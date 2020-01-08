var express = require('express');
var app = express();

// use environment variable or 5000 as default port.
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/webpage'));
app.use('/', express.static(__dirname + '/webpage/index.html'));


var server = app.listen(PORT, function () {
    console.log('Server is listening on port %d!', PORT)
})