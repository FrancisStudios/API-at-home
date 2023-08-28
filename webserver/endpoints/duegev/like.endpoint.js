import genericQueryExecutor from "../../utils/generic-query.execute.js";

export class DuegevArticleLikeEndpointService {
    static init(UnicumWebService) {
        UnicumWebService.post('/article-like', function (req, res) {
            console.log('Like endpoint was called...')
            let searchquery = req.body;

            /* FIRST: ACTION VERIFY LOGIN CREDS */
            const performLoginStep = () => {
                return new Promise(resolve => {
                    const _creds = searchquery.query.credentials;
                    if (_creds.username && _creds.password) {
                        const _LOGIN_QUERY = `SELECT * FROM users WHERE username='${_creds.username}' AND password='${_creds.password}'`;
                        genericQueryExecutor(_LOGIN_QUERY).then(promiseResponse => {
                            resolve(promiseResponse);
                        });
                    }
                });
            }

            /* SECOND: FIND ARTICLE WITH THE CORRECT ARTICLE_ID */
            const performArticleQueryStep = () => {
                return new Promise(resolve => {
                    const _article_id = searchquery.query.article_id;
                    const _FIND_ARTICLE_QUERY = `SELECT * FROM articles WHERE article_id='${_article_id}'`;
                    genericQueryExecutor(_FIND_ARTICLE_QUERY).then(promiseResponse => {
                        resolve(promiseResponse);
                    });
                });
            }

            const performLikeAction = () => {
                performLoginStep().then(response => {
                    if (response.queryValidation && response.queryValidation === 'valid') {
                        let _UserData = JSON.parse(JSON.stringify(response.values))[0];
                        performArticleQueryStep().then(articleRes => {
                            if (articleRes.queryValidation && articleRes.queryValidation === 'valid') {
                                /* THIRD: PREPARE NEW DOC DATA WITH INSERTED LIKE ARRAY VALUE && INSERT INTO */
                                let _ArticleData = JSON.parse(JSON.stringify(articleRes.values))[0];
                                let _likersArray = JSON.parse(_ArticleData.likes).map(e => Number(e));

                                /* THE REAL DEAL */
                                switch (searchquery.query.action) {
                                    case 'add':
                                        _likersArray.push(_UserData.uid);
                                        break;

                                    case 'remove':
                                        _likersArray = _likersArray.filter(likers => likers !== _UserData.uid);
                                        break;
                                }

                                let _numberOfLikers = _likersArray.length;

                                _ArticleData.likes = JSON.stringify(_likersArray);
                                const INSERT_INTO_ARTICLES_QUERY = `UPDATE articles SET likes='${_ArticleData.likes}', number_of_likes='${_numberOfLikers}' WHERE article_id='${_ArticleData.article_id}'`;

                                genericQueryExecutor(INSERT_INTO_ARTICLES_QUERY).then(insertQueryResponse => {
                                    let response = JSON.stringify({ queryValidation: insertQueryResponse.queryValidation });
                                    res.set('content-type', 'text/plain');
                                    res.send(JSON.stringify(response));
                                });
                            }
                        });
                    }
                });
            }

            performLikeAction();
        });
    }
}