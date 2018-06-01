const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const giphyKey = 'btFg3uyFkSjHZcE3XDuiNFjDo5ugD2Jk';
const companyDB = require('./db.json');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {lead: null, error: null});
})

app.get('/new', function (req, res) {
  let page = parseInt(req.query.page, 10) || 0;
  if (page >= companyDB.length) {
    page = 0;
  }
  const giphyAPI = `http://api.giphy.com/v1/gifs/random?tag=robot&api_key=${giphyKey}`;
  request.get(giphyAPI, (error, giphyResponse) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }
    const data = JSON.parse(giphyResponse.body).data;
    // console.log(data.images.original);
    const dbRow = companyDB[page];

    return res.render('new', { 
      row: dbRow,
      imgurl: data.images.original.url,
      nextpage: page + 1,
    });
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
