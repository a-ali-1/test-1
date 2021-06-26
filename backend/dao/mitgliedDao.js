const helper = require('../helper.js');

class MitgliedDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {

        var sql = 'SELECT * FROM Mitglied WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        if (result.mitgliedschaftid == 1)
            result.mitgliedschaftid = 'Basic';
        else
            result.mitgliedschaftid = 'Premium';

        result.geburtstag = helper.formatToGermanDate(helper.parseSQLDateTimeString(result.geburtstag));

        result.registrierungszeitpunkt = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result.registrierungszeitpunkt));

        return result;
    }

    loadAll() {

        var sql = 'SELECT * FROM Mitglied';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            if (result[i].mitgliedschaftid == 1)
                result[i].mitgliedschaftid = 'Basic';
            else
                result[i].mitgliedschaftid = 'Premium';

            result[i].geburtstag = helper.formatToGermanDate(helper.parseSQLDateTimeString(result[i].geburtstag));
            result[i].registrierungszeitpunkt = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result[i].registrierungszeitpunkt));
        }

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Mitglied WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    hasaccess(email, passwort) {

      var sql = 'SELECT ID FROM Mitglied WHERE Email=? AND Passwort=?';
      var statement = this._conn.prepare(sql);
      var params = [email, md5(passwort)];
      var result = statement.get(params);

      if (helper.isUndefined(result))
          throw new Error('User has no access');

      return this.loadById(result.ID);
    }


    create(vorname = '', nachname = '', strasse = '', plz = '', stadt = '', geburtstag = null, telefon = '', email = '', registrierungszeitpunkt = null, mitgliedschaftid = 1, passwort = '') {

        if (helper.isNull(registrierungszeitpunkt))
            registrierungszeitpunkt = helper.getNow();

        var sql = 'INSERT INTO Mitglied (Vorname,Nachname,Strasse,PLZ,Stadt,Geburtstag,Telefon,Email,Registrierungszeitpunkt,MitgliedschaftID,Passwort) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [vorname, nachname, strasse, plz, stadt, (helper.isNull(geburtstag) ? null : helper.formatToSQLDate(geburtstag)), telefon, email, helper.formatToSQLDateTime(registrierungszeitpunkt), mitgliedschaftid, passwort];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, vorname = '', nachname = '', strasse = '', plz = '', stadt = '', geburtstag = null, telefon = '', email = '', registrierungszeitpunkt = null, mitgliedschaftid = 1, passwort = '') {

        if (helper.isNull(registrierungszeitpunkt))
            registrierungszeitpunkt = helper.getNow();

        var sql = 'UPDATE Mitglied SET Vorname=?,Nachname=?,Strasse=?,PLZ=?,Stadt=?,Geburtstag=?,Telefon=?,Email=?,Registrierungszeitpunkt=?,MitgliedschaftID=?, Passwort=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [vorname, nachname, strasse, plz, stadt, (helper.isNull(geburtstag) ? null : helper.formatToSQLDate(geburtstag)), telefon, email, helper.formatToSQLDateTime(registrierungszeitpunkt), mitgliedschaftid, passwort, id];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Mitglied WHERE ID=?';
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
        helper.log('MitgliedDao [_conn=' + this._conn + ']');
    }
}

module.exports = MitgliedDao;
