import mysql from 'mysql';
import DBCONFIG from './database.config.js';

export class SQLConnection {

    connection

    constructor() {
        this.connection = mysql.createConnection(DBCONFIG)
    }

    makeQuery(sql_query) {
        return new Promise((resolve) => {
            this.connection.connect();

            this.connection.query(sql_query, (err, rows, fields) => {
                if (err) throw err
                resolve(rows);
            });
        })
    }

    closeConnection(){
        this.connection.end();
    }
}