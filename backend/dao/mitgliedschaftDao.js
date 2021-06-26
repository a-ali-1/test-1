const helper = require('../helper.js');

class MitgliedschaftDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Mitgliedschaft WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        return helper.objectKeysToLower(result);

    }

    loadAll() {
        var sql = 'SELECT * FROM Mitgliedschaft';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        return helper.arrayObjectKeysToLower(result);
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Mitgliedschaft WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create( name = '', preis = 0, preisalt = 0, einmalig = 0) {
        var sql = 'INSERT INTO Mitgliedschaft (Name,Preis,PreisAlt,Einmalig) VALUES (?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [name, preis, preisalt, einmalig];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, name = '', preis = 0, preisalt = 0, einmalig = 0) {
        var sql = 'UPDATE Mitgliedschaft SET Name=?,Preis=?,PreisAlt=?,Einmalig=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [id ,name, preis, preisalt, einmalig];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Mitgliedschaft WHERE ID=?';
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
        helper.log('MitgliedschaftDao [_conn=' + this._conn + ']');
    }
}

module.exports = MitgliedschaftDao;
