const helper = require('../helper.js');
const TrainerDao = require('../dao/trainerDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Trainer');

serviceRouter.get('/trainer/gib/:id', function(request, response) {
    helper.log('Service Trainer: Client requested one record, id=' + request.params.id);

    const trainerDao = new TrainerDao(request.app.locals.dbConnection);
    try {
        var result = trainerDao.loadById(request.params.id);
        helper.log('Service Trainer: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Trainer: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/trainer/alle', function(request, response) {
    helper.log('Service Trainer: Client requested all records');

    const trainerDao = new TrainerDao(request.app.locals.dbConnection);
    try {
        var result = trainerDao.loadAll();
        helper.log('Service Trainer: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Trainer: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/trainer/existiert/:id', function(request, response) {
    helper.log('Service Trainer: Client requested check, if record exists, id=' + request.params.id);

    const trainerDao = new TrainerDao(request.app.locals.dbConnection);
    try {
        var result = trainerDao.exists(request.params.id);
        helper.log('Service Trainer: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Trainer: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


module.exports = serviceRouter;