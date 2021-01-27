var Person = require('../models/person');
const { body, validationResult } = require('express-validator');

// Display list of all Persons.
exports.person_list = function(req, res, next) {
    Person.find({}, 'name phone date level time').exec(function (err, list_persons) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('person_list', {title: 'Список брони', person_list: list_persons });
    })
}

//Создать новую бронь - GET
exports.person_create_get = function(req, res) {
    res.render('person_form', { title: 'Бронирование зала', levels: ['Первый этаж', 'Второй этаж'],
    times: ['06:00 - 09:00', '09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 21:00', '21:00 - 00:00'] })
}

// Handle Person create on POST.
exports.person_create_post = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Имя - обязательное для заполнения поле!'),
    body('phone').trim().isLength({ min: 1 }).escape().withMessage('Телефон - обязательное для заполнения поле!'),
    body('date', 'Недопустимая дата').optional({ checkFalsy: true }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create an Person object with escaped and trimmed data.
        var person = new Person({
            name: req.body.name,
            phone: req.body.phone,
            date: req.body.date,
            time: req.body.time,
            level: req.body.level
        })

        Person.find({date: person.date, level: person.level, time: person.time},
            'date level time')
        .exec(function (err, same_level) {
            if (err) { return console.log(err) }
            else {
                if (same_level.length === 0 && errors.isEmpty()) {
                    person.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(person.url);
                    })
                } else {
                    res.render('person_form', { title: 'Бронирование зала',
                        levels: ['Первый этаж', 'Второй этаж'],
                        errors: [`К сожалению, выбранный этаж уже занят`],
                        times: ['06:00 - 09:00', '09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 21:00', '21:00 - 00:00'],
                        person: person })
                }
            }
        })
    }
]

// Display detail page for a specific Person.
exports.person_detail = function(req, res) {
    Person.findById(req.params.id).exec(function (err, info) {
        if (err) return res.render('person_instance', {title: 'Информация о брони', error: `Данной брони не существует`});
        res.render('person_instance', {title: 'Информация о брони', person_info: info, error: `Данной брони не существует`});
    })}

// Handle Person delete on POST.
exports.person_delete_post = function(req, res, next) {
    Person.findByIdAndRemove(req.params.id, function deletePerson(err) {
        if (err) { return next(err); }
        res.render('person_delete', {title: 'Отмена брони', mes: `Ваша бронь была отменена`})
    })
}