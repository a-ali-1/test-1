const helper = require('../helper.js');
const AnmeldungDao = require('../dao/anmeldungDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Anmeldung');

serviceRouter.get('/anmeldung/gib/:id', function(request, response) {
    helper.log('Service Anmeldung: Client requested one record, id=' + request.params.id);

    const anmeldungDao = new AnmeldungDao(request.app.locals.dbConnection);
    try {
        var result = anmeldungDao.loadById(request.params.id);
        helper.log('Service Anmeldung: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Anmeldung: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/anmeldung/alle', function(request, response) {
    helper.log('Service Anmeldung: Client requested all records');

    const anmeldungDao = new AnmeldungDao(request.app.locals.dbConnection);
    try {
        var result = anmeldungDao.loadAll();
        helper.log('Service Anmeldung: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Anmeldung: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/anmeldung/existiert/:id', function(request, response) {
    helper.log('Service Anmeldung: Client requested check, if record exists, id=' + request.params.id);

    const anmeldungDao = new AnmeldungDao(request.app.locals.dbConnection);
    try {
        var result = anmeldungDao.exists(request.params.id);
        helper.log('Service Anmeldung: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Anmeldung: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/anmeldung', function(request, response) {
    helper.log('Service Anmeldung: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.rhytmus))
        errorMsgs.push('Rhytmus fehlt');
    if (helper.isUndefined(request.body.mitgliedid))
        errorMsgs.push('MitgliedID fehlt');
    if (helper.isUndefined(request.body.kursid))
        errorMsgs.push('KursID fehlt');

    if (helper.isUndefined(request.body.zeitpunkt)) {
        request.body.zeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.zeitpunkt)) {
        errorMsgs.push('Zeitpunkt hat das falsche Format, erlaubt: dd.mm.jjjj');
    } else {
        request.body.zeitpunkt = helper.parseDateTimeString(request.body.zeitpunkt);
    }

    if (errorMsgs.length > 0) {
        helper.log('Service Anmeldung: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const anmeldungDao = new AnmeldungDao(request.app.locals.dbConnection);
    try {
        var result = anmeldungDao.create(request.body.rhytmus, request.body.mitgliedid, request.body.kursid,  request.body.zeitpunkt);
        helper.log('Service Anmeldung: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Anmeldung: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/anmeldung', function(request, response) {
    helper.log('Service Anmeldung: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id))
        errorMsgs.push('id missing');
    if (helper.isUndefined(request.body.rhytmus))
        errorMsgs.push('Rhytmus fehlt');
    if (helper.isUndefined(request.body.mitgliedid))
        errorMsgs.push('MitgliedID fehlt');
    if (helper.isUndefined(request.body.kursid))
        errorMsgs.push('KursID fehlt');

    if (helper.isUndefined(request.body.zeitpunkt)) {
        request.body.zeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.zeitpunkt)) {
        errorMsgs.push('Zeitpunkt hat das falsche Format, erlaubt: dd.mm.jjjj');
    } else {
        request.body.zeitpunkt = helper.parseDateTimeString(request.body.zeitpunkt);
    }


    if (errorMsgs.length > 0) {
        helper.log('Service Anmeldung: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const anmeldungDao = new AnmeldungDao(request.app.locals.dbConnection);
    try {
        var result = anmeldungDao.update(request.body.id, request.body.rhytmus, request.body.mitgliedid, request.body.kursid,  request.body.zeitpunkt);
        helper.log('Service Anmeldung: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Anmeldung: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.delete('/anmeldung/:id', function(request, response) {
    helper.log('Service Anmeldung: Client requested deletion of record, id=' + request.params.id);

    const anmeldungDao = new AnmeldungDao(request.app.locals.dbConnection);
    try {
        var obj = anmeldungDao.loadById(request.params.id);
        anmeldungDao.delete(request.params.id);
        helper.log('Service Anmeldung: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Anmeldung: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;
