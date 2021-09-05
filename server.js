require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const shorten = require('simple-short');

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/api/shorturl', (req, res) => {
  var sid = shorten(req.body.url);
  console.log(sid);
  res.json({
    original_url: req.body.url,
    short_url: sid,
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
