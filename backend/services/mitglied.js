const helper = require('../helper.js');
const MitgliedDao = require('../dao/mitgliedDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Mitglied');

serviceRouter.get('/mitglied/gib/:id', function(request, response) {
    helper.log('Service Mitglied: Client requested one record, id=' + request.params.id);

    const mitgliedDao = new MitgliedDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedDao.loadById(request.params.id);
        helper.log('Service Mitglied: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Mitglied: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/mitglied/alle', function(request, response) {
    helper.log('Service Mitglied: Client requested all records');

    const mitgliedDao = new MitgliedDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedDao.loadAll();
        helper.log('Service Mitglied: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Mitglied: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/mitglied/existiert/:id', function(request, response) {
    helper.log('Service Mitglied: Client requested check, if record exists, id=' + request.params.id);

    const mitgliedDao = new MitgliedDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedDao.exists(request.params.id);
        helper.log('Service Mitglied: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Mitglied: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/mitglied/zugang', function(request, response) {
    helper.log('Service Mitglied: Client requested check, if user has access');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.email))
        errorMsgs.push('email fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service mitglied: check not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Check not possible. Missing data: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const mitgliedDao = new MitgliedDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedDao.hasaccess(request.body.email, request.body.passwort);
        helper.log('Service Mitglied: Check if user has access, result=' + result);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Mitglied: Error checking if user has access. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/mitglied', function(request, response) {
    helper.log('Service Mitglied: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.vorname))
        errorMsgs.push('vorname fehlt');
    if (helper.isUndefined(request.body.nachname))
        errorMsgs.push('nachname fehlt');

    if (helper.isUndefined(request.body.strasse))
        errorMsgs.push('strasse fehlt');
    if (helper.isUndefined(request.body.plz))
        errorMsgs.push('plz fehlt');
    if (helper.isUndefined(request.body.stadt))
        errorMsgs.push('stadt fehlt');

    if (helper.isUndefined(request.body.geburtstag)) {
        request.body.geburtstag = null;
    } else if (!helper.isGermanDateTimeFormat(request.body.geburtstag)) {
        errorMsgs.push('geburtstag hat das falsche Format, erlaubt: dd.mm.jjjj');
    } else {
        request.body.geburtstag = helper.parseDateTimeString(request.body.geburtstag);
    }

    if (helper.isUndefined(request.body.telefon))
        request.body.telefon = '';
    if (helper.isUndefined(request.body.email))
        errorMsgs.push('email fehlt');
    if (!helper.isEmail(request.body.email))
        errorMsgs.push('email hat ein falsches Format');

    if (helper.isUndefined(request.body.registrierungszeitpunkt)) {
        request.body.registrierungszeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.registrierungszeitpunkt)) {
        errorMsgs.push('registrierungszeitpunkt hat das falsche Format, erlaubt: dd.mm.jjjj hh:mm:ss');
    } else {
        request.body.registrierungszeitpunkt = helper.parseGermanDateTimeString(request.body.registrierungszeitpunkt);
    }

    if (helper.isUndefined(request.body.mitgliedschaftid)) {
        errorMsgs.push('mitgliedschaftid fehlt');
    }

    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service Mitglied: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const mitgliedDao = new MitgliedDao(request.app.locals.dbConnection);
    try {
        //to-do: Create funktion an Datenbank anpassen
        var result = mitgliedDao.create(request.body.vorname, request.body.nachname, request.body.strasse,  request.body.plz, request.body.stadt, request.body.geburtstag, request.body.telefon, request.body.email, request.body.registrierungszeitpunkt, request.body.mitgliedschaftid, request.body.passwort);
        helper.log('Service Mitglied: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Mitglied: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});
//to-do: an Datenbank anpassen
serviceRouter.put('/mitglied', function(request, response) {
    helper.log('Service Mitglied: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id))
        errorMsgs.push('id missing');
    if (helper.isUndefined(request.body.vorname))
        errorMsgs.push('vorname fehlt');
    if (helper.isUndefined(request.body.nachname))
        errorMsgs.push('nachname fehlt');

    if (helper.isUndefined(request.body.strasse))
        errorMsgs.push('strasse fehlt');
    if (helper.isUndefined(request.body.plz))
        errorMsgs.push('plz fehlt');
    if (helper.isUndefined(request.body.stadt))
        errorMsgs.push('stadt fehlt');

    if (helper.isUndefined(request.body.geburtstag)) {
        request.body.geburtstag = null;
    } else if (!helper.isGermanDateTimeFormat(request.body.geburtstag)) {
        errorMsgs.push('geburtstag hat das falsche Format, erlaubt: dd.mm.jjjj');
    } else {
        request.body.geburtstag = helper.parseDateTimeString(request.body.geburtstag);
    }

    if (helper.isUndefined(request.body.telefon))
        request.body.telefon = '';
    if (helper.isUndefined(request.body.email))
        errorMsgs.push('email fehlt');
    if (!helper.isEmail(request.body.email))
        errorMsgs.push('email hat ein falsches Format');

    if (helper.isUndefined(request.body.registrierungszeitpunkt)) {
        request.body.registrierungszeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.registrierungszeitpunkt)) {
        errorMsgs.push('registrierungszeitpunkt hat das falsche Format, erlaubt: dd.mm.jjjj hh:mm:ss');
    } else {
        request.body.registrierungszeitpunkt = helper.parseGermanDateTimeString(request.body.registrierungszeitpunkt);
    }

    if (helper.isUndefined(request.body.mitgliedschaftid))
        errorMsgs.push('mitgliedschaftid fehlt');

    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service Mitglied: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const mitgliedDao = new MitgliedDao(request.app.locals.dbConnection);
    try {
        var result = mitgliedDao.update(request.body.id, request.body.vorname, request.body.nachname, request.body.strasse,  request.body.plz, request.body.stadt, request.body.geburtstag, request.body.telefon, request.body.email, request.body.registrierungszeitpunkt, request.body.mitgliedschaftid, request.body.passwort);
        helper.log('Service Mitglied: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Mitglied: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.delete('/mitglied/:id', function(request, response) {
    helper.log('Service Mitglied: Client requested deletion of record, id=' + request.params.id);
    const mitgliedDao = new MitgliedDao(request.app.locals.dbConnection);
    try {
        var obj = mitgliedDao.loadById(request.params.id);
        mitgliedDao.delete(request.params.id);
        helper.log('Service Mitglied: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Mitglied: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;
