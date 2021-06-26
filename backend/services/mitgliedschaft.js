const helper = require('../helper.js');
const MitgliedschaftDao = require('../dao/mitgliedschaftDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Mitgliedschaft');

serviceRouter.get('/mitgliedschaft/gib/:id', function(request, response) {
    helper.log('Service mitgliedschaft: Client requested one record, id=' + request.params.id);

    const mitgliedschaftDao = new MitgliedschaftDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedschaftDao.loadById(request.params.id);
        helper.log('Service mitgliedschaft: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service mitgliedschaft: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/mitgliedschaft/alle', function(request, response) {
    helper.log('Service mitgliedschaft: Client requested all records');

    const mitgliedschaftDao = new MitgliedschaftDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedschaftDao.loadAll();
        helper.log('Service mitgliedschaft: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service mitgliedschaft: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/mitgliedschaft/existiert/:id', function(request, response) {
    helper.log('Service mitgliedschaft: Client requested check, if record exists, id=' + request.params.id);

    const mitgliedschaftDao = new MitgliedschaftDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedschaftDao.exists(request.params.id);
        helper.log('Service mitgliedschaft: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service mitgliedschaft: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


module.exports = serviceRouter;
