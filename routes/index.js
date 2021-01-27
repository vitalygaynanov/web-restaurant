var express = require('express');
var router = express.Router();

var person_controller = require('../controllers/personController');

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ресторан' });
});

/// PERSON ROUTES ///

// GET request for creating person. NOTE This must come before route for id (i.e. display person).
router.get('/person/create', person_controller.person_create_get);

// POST request for creating person.
router.post('/person/create', person_controller.person_create_post);

// GET request for one person.
router.get('/person/:id', person_controller.person_detail);

// POST request to delete person.
router.post('/person/:id/delete', person_controller.person_delete_post);

// GET request for list of all persons.
router.get('/person_list', person_controller.person_list)


module.exports = router;
