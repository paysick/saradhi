var advertisers = require('./resources/advertisers.js');
var analysts = require('./resources/analysts.js');
var markets = require('./resources/markets.js');
var tags = require('./resources/tags.js');
var verticals = require('./resources/verticals.js');

var formidable = require('formidable');
var util = require('util');
var express = require('express');
var app = express();
var MongoWrapper = require('./MongoWrapper');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var mongo = new MongoWrapper();
mongo.connect();

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/analysts', (req, res) => {
  res.json(analysts);
});

app.get('/markets', (req, res) => {
  res.json(markets);
});

app.get('/advertisers', (req, res) => {
  res.json(advertisers);
});

app.get('/tags', (req, res) => {
  res.json(tags);
});

app.get('/verticals', (req, res) => {
  res.json(verticals);
});

app.get('/insights', (req, res) => {
  mongo.getAll(docs => {
    res.json(docs);
  });
});

app.post('/insightRepo', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = '/home/josh/Documents/saradhi/uploads';

  form.parse(req, function(err, fields, files) {
    const insight = Object.assign({}, fields, { file: files });
    mongo.insert(fields, res => console.log(res));
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.write('received upload:\n\n');
    res.end(util.inspect({ fields: fields, files: files }));
  });
});

app.listen(3000, () => console.log('running server on port 3000'));
