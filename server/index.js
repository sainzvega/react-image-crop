const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send(`${process.env.APP_ENV} hit ${Math.random()}`);
});

app.post('/upload', (req, res) => {
  console.log('cropDetails-left: ', req.body.cropleft);
  console.log('cropDetails-top: ', req.body.croptop);
  console.log('cropDetails-height: ', req.body.cropheight);
  console.log('cropDetails-width: ', req.body.cropwidth);
  console.log('file: ', req.files.file.name);
  return res.send({ status: 'success', message: 'upload success' });
});

http.createServer(app).listen(process.env.PORT || 8000);
