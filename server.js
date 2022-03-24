require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// array of shortened URLs
const urlList = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// add body parsing
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',(req,res)=>{
  const num = urlList.length;
  const urlTxt = req.body.url;
  try {
    if (!(urlTxt.match(/^([A-Za-z]+\:\/\/)/))){
      res.json({ error: 'invalid url' });
    }
    else {
      const longUrl = new URL(urlTxt);
      urlList.push(longUrl);
      res.json({ "original_url": longUrl, "short_url": num });
    }
  }
  catch (err) {
    if (err.code == "ERR_INVALID_URL"){
      res.json({ error: 'invalid url' });
    }
    else {
      res.json({ error: err.code });
    }
  }
});

app.get('/api/shorturl/:short',(req,res)=>{
  const idx = parseInt(req.params.short);
  if (idx >=0 && idx < urlList.length) {
    res.redirect(urlList[idx]);
  }
  else {
    res.status(404).send("Not Found");
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
