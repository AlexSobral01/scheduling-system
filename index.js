const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const uri = "mongodb+srv://alex:04177110@alexsobraldb.fargf4z.mongodb.net/scheduling-system?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('connected to mongoDB!')
  } catch (err) {
    console.log(err);
  }
}

connect();


app.get('/', (req, res) => {
  res.render('./create.ejs')
})

app.listen(3001, () => console.log('server working!'))