const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/';

class db {
    constructor(url, db, collection) {
        this.url = url;
        this.dbName = db;
        this.collection = collection;
        this.client = new mongo(url, { useNewUrlParser: true });
    }
    /**
     * Fuegt ein Dokument ein
     * - document: Ein JSON-Objekt
     */
    async insertOne(document) {
        assert(
            typeof document == 'object',
            'document muss ein JSON-Objekt sein'
        );
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            await db.collection(this.collection).insertOne(document);
        } catch (err) {
            console.log(err);
        } finally {
            this.client.close();
        }
    }

    /**
     * Fuegt ein Array von Dokumenten ein
     * - documents: Ein Array von JSON-Objekten
     */
    async insertMany(documents) {
        assert(
            Array.isArray(documents),
            'documents muss ein Array von JSON-Objekten sein'
        );
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            await db.collection(this.collection).insertMany(documents);
        } catch (err) {
            console.log(err);
        } finally {
            this.client.close();
        }
    }
    /**
     * Ruf Callback-Funktion mit Array von JSON-Objketion auf, selektiert und projeziert wenn noetig.
     * Projection mit null belegen, wenn nicht benotig.
     * - callback: Eine Funktion an die das Array uebergeben wird
     * - projection?: Ein Array von Strings, welche angeben welche Felder projeziert werden sollen
     * - selection?: Ein Json von key-value Paaren, nach welchen gefiltert werden soll
     * - withId?: Ein Boolean der Angbibt ob die _id mit ausgegben werden soll
     */
    async query(callback, projection, selection, withId) {
        assert(
            typeof callback == 'function',
            'callback muss eine Funktion sein'
        );
        if (projection)
            assert(
                typeof projection == 'object',
                'projection muss ein Array von Strings sein'
            );
        if (selection)
            assert(
                typeof selection == 'object',
                'selection muss ein JSON-Objekt sein'
            );
        if (withId) assert(typeof withId == 'boolean', 'id muss ein Boolean');
        let arrToJson = function(arr) {
            let json = {};
            if (withId) json._id = 0; //_id ausblenden
            for (let ele of arr) {
                json[ele] = 1;
            }
            return json;
        };

        try {
            await this.client.connect();
            const proj = arrToJson(projection || []);
            const sel = selection || {};
            const db = this.client.db(this.dbName);
            const arr = await db
                .collection(this.collection)
                .find(sel)
                .project(proj)
                .toArray();
            callback(arr);
        } catch (err) {
            console.log(err);
        } finally {
            this.client.close();
        }
    }
    /**
     * Updated die aktuelle Collection, callback ist optional.
     * - where: Ein JSON mit key-value Paaren, welche die Updatemenge beschraenken
     * - set: Ein JSON mit key-value Paaren, welche den Dokumenten hinzugefuegt werden sollen
     * - callback?: Eine Callback Funktion an die das Ergebnis in Form von ERR - RESULT uebergeben wird
     */
    async update(where, set, callback) {
        assert(typeof where == 'object', 'where muss ein JSON-Objekt sein');
        assert(typeof set == 'object', 'set muss ein JSON-Objekt sein');
        if (callback)
            assert(
                typeof callback == 'function',
                'callback muss eine Funktion sein'
            );
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            await db
                .collection(this.collection)
                .updateMany(where, { $set: set }, null, function(err, result) {
                    if (typeof callback === 'function') callback(err, result);
                });
        } catch (err) {
            console.log(err);
        } finally {
            this.client.close();
        }
    }
    /**
     * Loescht Dokumente aus der aktuellen Collection. Callback ist optional.
     * - where: Ein JSON mit key-value Paaren, welche die Updatemenge beschraenken
     * - set: Ein JSON mit key-value Paaren, welche den Dokumenten hinzugefuegt werden sollen
     * - callback?: Eine Callback Funktion an die das Ergebnis in Form von ERR - RESULT uebergeben wird
     */
    async delete(where, callback) {
        assert(typeof where == 'object', 'where muss ein JSON-Objekt sein');
        if (callback)
            assert(
                typeof callback == 'function',
                'callback muss eine Funktion sein'
            );
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            await db
                .collection(this.collection)
                .deleteMany(where, null, function(err, result) {
                    if (typeof callback === 'function') callback(err, result);
                });
        } catch (err) {
            console.log(err);
        } finally {
            this.client.close();
        }
    }
}
module.exports = db;
