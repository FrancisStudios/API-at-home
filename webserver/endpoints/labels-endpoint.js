import { SQLConnection } from "../database/database-connection.js";

export class LabelsAndCategoriesEndpointService {
    static init(UnicumWebService) {
        UnicumWebService.post('/user-ops', function (req, res) {
            console.log('user operations was called')

            let searchquery = req.body;

            const getAllSorter = (TABLE) => {
                let dbConnection = new SQLConnection();

                return new Promise(resolve => {
                    try {
                        dbConnection.makeQuery(`SELECT * FROM ${TABLE}`).then((response) => {
                            dbConnection.closeConnection();
                            let values = response;
                            resolve({ queryValidation: 'valid', values: JSON.parse(JSON.stringify(values)) });
                        });
                    } catch (error) {
                        resolve({ queryValidation: 'invalid' });
                        throw error;
                    }
                });
            }

            /* searchquery = {query: "category"} */
            getAllSorter(searchquery.query)
        });
    }
}