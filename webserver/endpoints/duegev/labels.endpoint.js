import { SQLConnection } from "../../database/database-connection.js";

export class LabelsAndCategoriesEndpointService {
    static init(UnicumWebService) {
        UnicumWebService.post('/article-labels', function (req, res) {
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
            getAllSorter(searchquery.query).then(sorterList => {
                const VALID_RESPONSE = {
                    queryValidation: 'valid',
                    values: JSON.parse(JSON.stringify(sorterList.values))
                }

                const INVALID_RESPONSE = {
                    queryValidation: 'invalid',
                    values: []
                }

                if (sorterList.queryValidation && sorterList.queryValidation === 'valid') {
                    res.set('content-type', 'text/plain');
                    res.send(JSON.stringify(VALID_RESPONSE));
                } else {
                    res.set('content-type', 'text/plain');
                    res.send(JSON.stringify(INVALID_RESPONSE));
                }
            });
        });
    }
}