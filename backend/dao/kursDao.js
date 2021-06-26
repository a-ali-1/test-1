const helper = require('../helper.js');
const TrainerDao = require('./trainerDao.js');

class KursDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const trainerDao = new TrainerDao(this._conn);

        var sql = 'SELECT * FROM Kurs WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        result.trainer = trainerDao.loadById(result.trainerid);
        delete result.trainerid;

        return result;
    }

    loadAll() {
        const trainerDao = new TrainerDao(this._conn);
        var trainers = trainerDao.loadAll();

        var sql = 'SELECT * FROM Kurs';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {

            for (var element of trainers) {
                if (element.id == result[i].trainerid) {
                    result[i].trainer = element;
                    break;
                }
            }
            delete result[i].trainerid;
        }

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Kurs WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(name = '', bildpfad = '', trainerid = 1, beschreibung = '', termin = '') {

        var sql = 'INSERT INTO Kurs (Name,Bildpfad,TrainerID,Beschreibung,Termin) VALUES (?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [name, bildpfad, trainerid, beschreibung, termin];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, name = '', bildpfad = '', trainerid = 1, beschreibung = '', termin = '') {

        var sql = 'UPDATE Kurs SET Name=?,Bildpfad=?,TrainerID=?,Beschreibung=?,Termin=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [name, bildpfad, trainerid, beschreibung, termin, id];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Kurs WHERE ID=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1)
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        helper.log('KursDao [_conn=' + this._conn + ']');
    }
}

module.exports = KursDao;
