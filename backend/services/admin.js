const helper = require('../helper.js');
const AdminDao = require('../dao/adminDao.js');
const express = require('express');
var serviceRouter = express.Router();

helper.log('- Service Admin');

serviceRouter.get('/admin/gib/:id', function(request, response) {
    helper.log('Service Admin: Client requested one record, id=' + request.params.id);

    const adminDao = new AdminDao(request.app.locals.dbConnection);
    try {
        var result = adminDao.loadById(request.params.id);
        helper.log('Service Admin: Record loaded');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Admin: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/admin/alle', function(request, response) {
    helper.log('Service Admin: Client requested all records');

    const adminDao = new AdminDao(request.app.locals.dbConnection);
    try {
        var result = adminDao.loadAll();
        helper.log('Service Admin: Records loaded, count=' + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Admin: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get('/admin/existiert/:id', function(request, response) {
    helper.log('Service Admin: Client requested check, if record exists, id=' + request.params.id);

    const adminDao = new AdminDao(request.app.locals.dbConnection);
    try {
        var result = adminDao.exists(request.params.id);
        helper.log('Service Admin: Check if record exists by id=' + request.params.id + ', result=' + result);
        response.status(200).json(helper.jsonMsgOK({ 'id': request.params.id, 'existiert': result }));
    } catch (ex) {
        helper.logError('Service Admin: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post('/admin', function(request, response) {
    helper.log('Service Admin: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('Benutzername fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('Passwort fehlt')

    if (errorMsgs.length > 0) {
        helper.log('Service Admin: Creation not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Hinzufügen nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const adminDao = new AdminDao(request.app.locals.dbConnection);
    try {
        var result = adminDao.create(request.body.benutzername, request.body.passwort);
        helper.log('Service Admin: Record inserted');
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Admin: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put('/admin', function(request, response) {
    helper.log('Service Admin: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id))
        errorMsgs.push('id missing');
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('Benutzername fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('Passwort fehlt');

    if (errorMsgs.length > 0) {
        helper.log('Service Admin: Update not possible, data missing');
        response.status(400).json(helper.jsonMsgError('Update nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)));
        return;
    }

    const adminDao = new AdminDao(request.app.locals.dbConnection);
    try {
        var result = adminDao.update(request.body.id, request.body.benutzername, request.body.passwort);
        helper.log('Service Admin: Record updated, id=' + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError('Service Admin: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.delete('/admin/:id', function(request, response) {
    helper.log('Service Admin: Client requested deletion of record, id=' + request.params.id);

    const adminDao = new AdminDao(request.app.locals.dbConnection);
    try {
        var obj = adminDao.loadById(request.params.id);
        adminDao.delete(request.params.id);
        helper.log('Service Admin: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ 'gelöscht': true, 'eintrag': obj }));
    } catch (ex) {
        helper.logError('Service Admin: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;
