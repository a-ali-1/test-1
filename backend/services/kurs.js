const helper = require('../helper.js');
const KursDao = require('../dao/kursDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Kurs');

serviceRouter.get('/kurs/gib/:id', function(request, response) {
    helper.log('Service Kurs: Client requested one record, id=' + request.params.id);

    const kursDao = new KursDao(request.app.locals.dbConnection);
    try {
        var result = kursDao.loadById(request.params.id);
        helper.log('Service Kurs: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Kurs: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/kurs/alle', function(request, response) {
    helper.log('Service Kurs: Client requested all records');

    const kursDao = new KursDao(request.app.locals.dbConnection);
    try {
        var result = kursDao.loadAll();
        helper.log('Service Kurs: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Kurs: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/kurs/existiert/:id', function(request, response) {
    helper.log('Service Kurs: Client requested check, if record exists, id=' + request.params.id);

    const kursDao = new KursDao(request.app.locals.dbConnection);
    try {
        var result = kursDao.exists(request.params.id);
        helper.log('Service Kurs: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Kurs: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/kurs', function(request, response) {
    helper.log('Service Kurs: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.name))
        errorMsgs.push('Name fehlt');
    if (helper.isUndefined(request.body.bildpfad))
        errorMsgs.push('Bildpfad fehlt');
    if (helper.isUndefined(request.body.termin))
        errorMsgs.push('Termin fehlt');
    if (helper.isUndefined(request.body.trainerid))
        errorMsgs.push('trainerid fehlt');
    if (helper.isUndefined(request.body.beschreibung))
        errorMsgs.push('Beschreibung fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service Kurs: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const kursDao = new KursDao(request.app.locals.dbConnection);
    try {
        var result = kursDao.create(request.body.name, request.body.bildpfad, request.body.trainerid,  request.body.beschreibung, request.body.termin);
        helper.log('Service Kurs: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Kurs: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/kurs', function(request, response) {
    helper.log('Service Kurs: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id))
        errorMsgs.push('id missing');
    if (helper.isUndefined(request.body.name))
        errorMsgs.push('Name fehlt');
    if (helper.isUndefined(request.body.bildpfad))
        errorMsgs.push('Bildpfad fehlt');
    if (helper.isUndefined(request.body.termin))
        errorMsgs.push('Termin fehlt');
    if (helper.isUndefined(request.body.trainerid))
        errorMsgs.push('trainerid fehlt');
    if (helper.isUndefined(request.body.beschreibung))
        errorMsgs.push('Beschreibung fehlt');


    if (errorMsgs.length > 0) {
        helper.log('Service Kurs: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const kursDao = new KursDao(request.app.locals.dbConnection);
    try {
        var result = kursDao.update(request.body.id, request.body.name, request.body.bildpfad, request.body.trainerid,  request.body.beschreibung, request.body.termin);
        helper.log('Service Kurs: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Kurs: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.delete('/kurs/:id', function(request, response) {
    helper.log('Service Kurs: Client requested deletion of record, id=' + request.params.id);

    const kursDao = new KursDao(request.app.locals.dbConnection);
    try {
        var obj = kursDao.loadById(request.params.id);
        kursDao.delete(request.params.id);
        helper.log('Service Kurs: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Kurs: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;
