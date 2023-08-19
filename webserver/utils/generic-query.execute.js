import { SQLConnection } from "../database/database-connection.js";

const genericQueryExecutor = (SQL_EXPRESSION) => {
    return new Promise(resolve => {
        let dbConnection = new SQLConnection();
        try {
            dbConnection.makeQuery(SQL_EXPRESSION).then((response) => {
                dbConnection.closeConnection();
                resolve({ queryValidation: 'valid', articles: response });
            });
        } catch (error) {
            resolve({ queryValidation: 'invalid' });
            throw error;
        }
    });
}

export default genericQueryExecutor;


/* 

TODO:
this is specific to article queryies, 
worth extending to truely generic function

*/