const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const AppointmentsFactory = require('../factories/AppointmentFactory');
const nodemailer = require('nodemailer');

const Appo = mongoose.model('Appointment', appointment)

class AppointmentService {
  async Create(name, email, description, cpf, date, time) {
    const newAppo = new Appo({
      name,
      email,
      description,
      cpf,
      date,
      time,
      finished: false,
      notified: false
    });
    try {
      await newAppo.save();
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
  async GetAll(showFinished) {
    if (showFinished) {
      return await Appo.find();
    } else {
      const appos = await Appo.find({'finished': false});
      const appointments = [];

      appos.forEach(appointment => {
        if (appointment.date != undefined) {
          appointments.push(AppointmentsFactory.Build(appointment))
        }
      });


      return appointments;
    }
  }
  async GetById(id) {
    try {
      const event = Appo.findOne({'_id': id});
      return event
    } catch (err) {
      console.log(err)
    }
  }
  async Finish(id) {
    try {
      await Appo.findByIdAndUpdate(id, {finished: true});
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
  async Search(query) {
    try {
      const appos = await Appo.find().or([{email: query},{cpf: query}]);
      return appos;
    } catch (err) {
      console.log(err)
      return [];
    }
  }
  async SendNotificaiton() {
    const appos = await this.GetAll(false);

    var transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 25,
      auth: {
        user: "f1f4d18647a746",
        pass: "1f1f67d605be4f"
      }
    });

    appos.forEach(async appo => {
      const date = appo.start.getTime();
      const hour = 1000 * 60 * 60;
      const gap = date - Date.now();

      if(gap <= hour) {
        if (appo.notified) {
          await Appo.findByIdAndUpdate(appo.id, {notified: true});
          transporter.sendMail({
            from: 'lekynho <norderstino@alfabetizado.com>',
            to: appo.email,
            subject: 'Sua consulta vai acontecer em breve!',
            text: 'Importante!!! Sua consulta vai acontecer em 1 hora'
          }).then(() => {
            console.log('email enviado')
          }).catch((err) => console.log(err))
        }
      }
    })
  }
}

module.exports = new AppointmentService();