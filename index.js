const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AppointmentService = require('./services/AppointmentService');

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
  res.render('index');
})

app.get('/cadastro', (req, res) => {
  res.render('./create.ejs')
})

app.post('/create', async(req, res) => {
  const status = await AppointmentService.Create(
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
});

app.get('/getCalendar', async(req, res) => {
  const appointments = await AppointmentService.GetAll(false)
  res.json(appointments)
})

app.get('/event/:id', async(req, res) => {
  const appointment = await AppointmentService.GetById(req.params.id);
  res.render('event', {appo: appointment})
})

app.post('/finish', async(req, res) => {
  const id = req.body.id;
  await AppointmentService.Finish(id)
  res.redirect('/');
});

app.get('/list', async(req, res) => {

  //await AppointmentService.Search('028.182.102-88')

  const appos = await AppointmentService.GetAll(true);
  res.render('list', {appos});

});

app.get('/searchResult', async(req, res) => {
  const appos = await AppointmentService.Search(req.query.search)
  res.render('list',{appos});
});

var pollTime = 10000
setInterval( async() => {
  await AppointmentService.SendNotificaiton();
}, pollTime)

app.listen(3001, () => console.log('server working!')) 