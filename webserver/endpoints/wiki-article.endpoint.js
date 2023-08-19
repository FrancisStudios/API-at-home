import { SQLConnection } from "../database/database-connection.js";

export class WikiArticleEndpointService {
    static initArticleEndpoint(UnicumWebService) {
        UnicumWebService.post('/article', function (req, res) {
            let searchquery = req.body.query;

            const INVALID_RESPONSE = {
                queryValidation: 'invalid',
                articles: []
            }

            /* QUERY FUNCTIONS */
            
            const queryAllArticles = () => {
                return new Promise(resolve => {
                    let dbConnection = new SQLConnection();
                    try {
                        dbConnection.makeQuery('SELECT * FROM articles').then((response) => {
                            dbConnection.closeConnection();
                            resolve({ queryValidation: 'valid', articles: response });
                        });
                    } catch (error) {
                        resolve({ queryValidation: 'invalid' });
                        throw error;
                    }
                });
            }

            const insertNewArticle = () => {
                let article = req.body.values;
                if (article) {
                    let articleObject = JSON.parse(article);
                    let dbConnection = new SQLConnection();
                    try {
                        dbConnection.makeQuery(
                            `INSERT INTO articles (_id, article_id, title, date, author, irl_date, labels, categories, document, likes) ` +
                            `VALUES ('${articleObject._id}', '${articleObject.article_id}', '${articleObject.title}', '${articleObject.date}',` +
                            `'${articleObject.author}', '${articleObject.irl_date}', '${articleObject.labels}', '${articleObject.categories}', , '[]')`
                        ).then(() => {
                            dbConnection.closeConnection();
                            resolve({ queryValidation: 'valid' });
                        });
                    } catch (error) {
                        resolve({ queryValidation: 'invalid' });
                        throw error;
                    }
                }
            }

            /* CARREFOUR */
            /* request body: { query: '*', ?values:<Article> } */
            switch (searchquery) {
                case '*':
                    console.log(`Trying to find document with <${searchquery}>`);
                    queryAllArticles().then((dbResponse) => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                articles: JSON.parse(JSON.stringify(dbResponse.articles))
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                    break;

                case 'insert':
                    console.log(`Trying to insert a new document`);
                    insertNewArticle().then((dbResponse) => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                articles: []
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                    break;
            }

        });
    }
}