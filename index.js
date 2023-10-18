const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appointmentService = require('./services/AppointmentService');

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
  res.send('oi')
})

app.get('/cadastro', (req, res) => {
  res.render('./create.ejs')
})

app.post('/create', async(req, res) => {
  const status = await appointmentService.Create(
    req.body.name,
    req.body.email,
    req.body.description,
    req.body.cpf,
    req.body.date,
    req.body.time
    )
    if (status) {
      res.redirect('/')
    } else {
      res.send('Ocorreu uma falha!');
    }
})

app.listen(3001, () => console.log('server working!'))