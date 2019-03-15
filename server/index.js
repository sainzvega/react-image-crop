const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
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
  const { cropleft, croptop, cropheight, cropwidth } = req.body;
  const { avatar } = req.files;

  const image = sharp(avatar.data);
  image
    .metadata()
    .then(metadata => {
      const { width: originalWidth, height: originalHeight } = metadata;
      return image
        .extract({
          left: Math.floor(cropleft * originalWidth),
          top: Math.floor(croptop * originalHeight),
          width: Math.floor(cropwidth * originalWidth),
          height: Math.floor(cropheight * originalHeight)
        })
        .resize(300, 300)
        .toFile('output.png');
    })
    .then(info => {
      console.log('File Resize Info: ', info);
      return res.send({ status: 'success', message: 'upload success' });
    })
    .catch(err => {
      console.log(err);
      return res.send({ status: 'err', message: 'upload failed' });
    });
});

http.createServer(app).listen(process.env.PORT || 8000);
