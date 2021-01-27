var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var PersonSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    phone: {type: String, required: true, maxlength: 100},
    level: { type: String, required: true, enum: ['Первый этаж', 'Второй этаж'] },
    time: { type: String, required: true, enum: ['06:00 - 09:00', '09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 21:00', '21:00 - 00:00'] },
    date: {type: Date, required: true}
  }
);

// Virtual for bookinstance's URL
PersonSchema
.virtual('url')
.get(function () {
  return '/person/' + this._id;
});

PersonSchema
.virtual('date_formatted')
.get(function () {
  return this.date ? moment(this.date).format('Do MMMM YYYY') : '';
});

//Export model
module.exports = mongoose.model('Person', PersonSchema);