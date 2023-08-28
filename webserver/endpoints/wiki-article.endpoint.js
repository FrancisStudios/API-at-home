import { SQLConnection } from "../database/database-connection.js";
import genericQueryExecutor from "../utils/generic-query.execute.js";
import sanitizeUserDefinedInput from "../utils/sanitize-user-input.util.js"

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
                return genericQueryExecutor('SELECT * FROM articles');
            }

            const queryLatestId = () => {
                return genericQueryExecutor('SELECT * FROM articles ORDER BY _id DESC LIMIT 0, 1');
            }

            const getArticleByID = (article_id) => {
                return genericQueryExecutor(`SELECT * FROM articles WHERE article_id='${article_id}'`)
            }

            const getMostLikedArticle = () => {
                return genericQueryExecutor(`SELECT * FROM articles ORDER BY number_of_likes DESC LIMIT 1`);
            }

            const insertNewArticle = () => {
                return new Promise(resolve => {
                    let article = req.body.values;
                    if (article) {
                        let dbConnection = new SQLConnection();
                        let articleObject = article;

                        /* CLEANSE DOCUMENT FROM SINGLE AND SOUBLE QUOTES FROM USER DEFINED FIELDS */
                        articleObject.title = sanitizeUserDefinedInput(articleObject.title);
                        articleObject.document = sanitizeUserDefinedInput(articleObject.document);

                        try {
                            dbConnection.makeQuery(
                                `INSERT INTO articles (_id, article_id, title, date, author, irl_date, labels, categories, document, likes) ` +
                                `VALUES ('${articleObject._id}', '${articleObject.article_id}', '${articleObject.title}', '${articleObject.date}',` +
                                `'${articleObject.author}', '${articleObject.irl_date}', '${JSON.stringify(articleObject.labels)}', '${JSON.stringify(articleObject.categories)}', '${articleObject.document}', '[]')`
                            ).then(() => {
                                dbConnection.closeConnection();
                                resolve({ queryValidation: 'valid' });
                            });
                        } catch (error) {
                            resolve({ queryValidation: 'invalid' });
                            throw error;
                        }
                    }
                });
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
                                articles: JSON.parse(JSON.stringify(dbResponse.values))
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
                        console.log('insert', dbResponse);
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

                case 'get-latest':
                    console.log('Get latest article');
                    queryLatestId().then((dbResponse) => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                articles: JSON.parse(JSON.stringify(dbResponse.values))
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                    break;

                case 'get-article-by-id':
                    console.log('Get article by id');

                    let article_id = req.body.values;

                    getArticleByID(article_id).then((dbResponse) => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                articles: JSON.parse(JSON.stringify(dbResponse.values))
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                    break;

                case 'get-most-liked':
                    getMostLikedArticle().then((dbResponse) => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                articles: JSON.parse(JSON.stringify(dbResponse.values))
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