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
                return genericQueryExecutor('SELECT * FROM articles ORDER BY _id DESC LIMIT 200;');
            }

            const getArticleByUID = () => {
                let uid = req.body.values;
                return genericQueryExecutor(`SELECT * FROM articles WHERE author='${uid}'`)
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

            const deleteSelectedArticle = (requestData) => {
                return new Promise(resolve => {
                    console.log(`${requestData.credentials.username} requested a deletion of article ${requestData.articleID}`);
                    genericQueryExecutor(`SELECT * FROM users WHERE username='${requestData.credentials.username}' AND password='${requestData.credentials.password}'`).then(authResponse => {
                        if (authResponse.queryValidation === 'valid' && authResponse.values.length === 1) {
                            genericQueryExecutor(`DELETE FROM articles WHERE article_id='${requestData.articleID}' AND author='${requestData.credentials.UID}'`).then(dbResponse => {
                                if (dbResponse.queryValidation === 'valid') resolve({ queryValidation: 'valid' });
                                else resolve({ queryValidation: 'invalid' });
                            });
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                });
            }

            const UpdateArticle = (article) => {
                let labels = JSON.stringify(article.labels);
                let categories = JSON.stringify(article.categories);

                return genericQueryExecutor(`UPDATE articles SET title='${article.title}', labels='${labels}', categories='${categories}', document='${article.document}' WHERE article_id='${article.article_id}'`);
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

                case 'get-by-uid':
                    getArticleByUID().then((dbResponse) => {
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

                case 'delete-article':
                    let deleteRequestData = req.body.values;
                    deleteSelectedArticle(deleteRequestData).then(dbResponse => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                values: 'successful-delete'
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                    break;

                case 'update-article':
                    let updateRequestData = req.body.values; // <WikiArticle>
                    UpdateArticle(updateRequestData).then(dbResponse => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                values: 'successful-update'
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                    break;

                case 'fetch-next-chunk':
                    let nextChunkQuery = `SELECT * FROM articles` +
                        `WHERE _id > '${req.body.values.last_id}' ORDER BY _id DESC LIMIT 200;`;
                    genericQueryExecutor(nextChunkQuery).then(dbResponse => {
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
                    })
                    break;
            }

        });
    }
}