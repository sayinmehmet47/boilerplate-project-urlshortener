require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const dns = require('dns');
const shorten = require('simple-short');
const urlParser = require('url');

const mongoose = require('mongoose');
const { url } = require('inspector');
mongoose.connect(process.env.MONGO_URI).then(console.log('connected'));
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

const schema = new mongoose.Schema({ url: 'string' });
const Url = mongoose.model('Url', schema);

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const bodyUrl = req.body.url;

  const something = dns.lookup(
    urlParser.parse(bodyUrl).hostname,
    (error, address) => {
      if (!address) {
        res.json({ error: 'Invalid URL' });
      } else {
        const url = new Url({ url: bodyUrl });
        url.save((err, data) => {
          res.json({
            original_url: data.url,
            short_url: data.id,
          });
        });
      }
      console.log('dns', error);
      console.log('address', address);
    }
  );
});

app.get('/api/shorturl/:id', (req, res) => {
  // const id = req.body.id;
  Url.findOne({ _id: req.params.id }, (err, data) => {
    if (!data) {
      res.json({ error: 'Invalid URL' });
    } else {
      res.redirect(data.url);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
