const helper = require('../helper.js');
const KursDao = require('./kursDao.js');
const MitgliedDao = require('./mitgliedDao.js');

class AnmeldungDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const kursDao = new KursDao(this._conn);
        const mitgliedDao = new MitgliedDao(this._conn);

        var sql = 'SELECT * FROM Anmeldung WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        result.kurs = kursDao.loadById(result.kursid);
        delete result.kursid;

        result.mitglied = mitgliedDao.loadById(result.mitgliedid);
        delete result.mitgliedid;

        return result;
    }

    loadAll() {
      const kursDao = new KursDao(this._conn);
      const mitgliedDao = new MitgliedDao(this._conn);
      var kurse = kursDao.loadAll();
      var mitglieder = mitgliedDao.loadAll();

      var sql = 'SELECT * FROM Anmeldung';
      var statement = this._conn.prepare(sql);
      var result = statement.all();

      if (helper.isArrayEmpty(result))
          return [];

      result = helper.arrayObjectKeysToLower(result);

      for (var i = 0; i < result.length; i++) {

         for (var element of kurse) {
              if (element.id == result[i].kursid) {
                  result[i].kurs = element;
                  break;
              }
          }
          delete result[i].kursid;

          for (var element of mitglieder) {
                if (element.id == result[i].mitgliedid) {
                    result[i].mitglied = element;
                    break;
                }
          }
          delete result[i].mitgliedid;
      }

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Anmeldung WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(rhytmus = '', mitgliedid = 1, kursid = 1, zeitpunkt = null) {

        if (helper.isNull(zeitpunkt))
           zeitpunkt = helper.getNow();

        var sql = 'INSERT INTO Anmeldung (Rhytmus,MitgliedID,KursID,Zeitpunkt) VALUES (?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [rhytmus, mitgliedid, kursid, helper.formatToSQLDate(zeitpunkt)];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, rhytmus = '', mitgliedid = 1, kursid = 1, zeitpunkt = null) {

        if (helper.isNull(zeitpunkt))
            zeitpunkt = helper.getNow();

        var sql = 'UPDATE Anmeldung SET Rhytmus=?,MitgliedID=?,KursID=?,Zeitpunkt=? WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var params = [rhytmus, mitgliedid, kursid, helper.formatToSQLDate(zeitpunkt), id];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Anmeldung WHERE ID=?';
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
        helper.log('AnmeldungDao [_conn=' + this._conn + ']');
    }
}

module.exports = AnmeldungDao;
