const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send(`${process.env.APP_ENV} hit ${Math.random()}`);
});

app.post("/upload", (req, res) => {
  const { body } = req;
  console.log(body);
  return res.send({ message: "upload success" });
});


http.createServer(app).listen(process.env.PORT || 8000);
