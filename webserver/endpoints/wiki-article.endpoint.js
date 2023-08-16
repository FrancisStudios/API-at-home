import { SQLConnection } from "../database/database-connection.js";

export class WikiArticleEndpointService {
    static initLoginEndpoint(UnicumWebService) {
        UnicumWebService.post('/article', function (req, res) {
            let searchquery = req.body.query;

            console.log(`Trying to find document with <${searchquery}>`)

            const INVALID_RESPONSE = {
                queryValidation: 'invalid',
                articles: []
            }
            
            const getArticlesFromDB = (searchquery) => {
                return new Promise(resolve => {
                    let dbConnection = new SQLConnection();

                    if (searchquery === "*") {
                        /* GET ALL ARTICLES */
                        try {
                            dbConnection.makeQuery('SELECT * FROM articles').then((response) => {
                                dbConnection.closeConnection();
                                resolve({ queryValidation: 'valid', articles: response });
                            });
                        } catch (error) {
                            resolve({ queryValidation: 'invalid' });
                            throw error;
                        }
                    }
                });
            }

            if (searchquery) {
                getArticlesFromDB(searchquery).then((dbResponse) => {
                    if (dbResponse.queryValidation === 'valid') {
                        res.set('content-type', 'text/plain');
                        const VALID_RESPONSE = {
                            queryValidation: 'valid',
                            articles: JSON.parse(JSON.stringify(dbResponse.articles))
                        }

                        res.send(JSON.stringify(VALID_RESPONSE));
                    } else {
                        res.set('content-type', 'text/plain');
                        res.send(JSON.stringify(INVALID_RESPONSE));
                    }
                })
            } else {
                res.set('content-type', 'text/plain');
                res.send(JSON.stringify(INVALID_RESPONSE));
            }
        });
    }
}