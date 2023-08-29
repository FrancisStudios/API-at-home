import genericQueryExecutor from "../../utils/generic-query.execute.js";
import sanitizeUserDefinedInput from "../../utils/sanitize-user-input.util.js";

export class ArticleSearchServerEndpoint {
    static init(UnicumWebService) {

        UnicumWebService.post('/duegev-search', function (req, res) {
            let query = req.body.query;
            let parameters = req.body.values;

            const _generalInvalidResponse = () => {
                res.set('content-type', 'text/plain');
                res.send(JSON.stringify({ queryValidation: 'invalid' }));
            }

            /* 
            some generic text @labels[]@categories[]
                { 
                    query: 'search', 
                    values: {
                        labels: string[],
                        categories: string[],
                        title: string,
                        document: string,
                    }
                } 
            */
            const search = () => {
                return new Promise(resolve => {

                    parameters.document = sanitizeUserDefinedInput(parameters.document);

                    if (parameters.document && parameters.document !== '') {
                        genericQueryExecutor(`SELECT * FROM articles WHERE document LIKE '%${parameters.document}%';`).then(dbDocumentQuery => {
                            if (dbDocumentQuery.queryValidation === 'valid') {
                                resolve({ queryValidation: 'valid', values: dbDocumentQuery.values });
                            } else resolve({ queryValidation: 'invalid' });
                        });
                    }

                    /*
                    queries = [
                        genericQueryExecutor(),
                        genericQueryExecutor(),
                        genericQueryExecutor(),
                        genericQueryExecutor(`SELECT * FROM articles WHERE document LIKE '%${parameters.document}%';`)
                    ]
                    Promise.all(queries).then(dbCollection => {
                        console.log('col: ', dbCollection);
                        resolve(dbCollection);
                    });
                    */

                });
            }

            switch (query) {
                case 'search':
                    search().then(searchQueriesResponse => {
                        if (searchQueriesResponse.queryValidation === 'valid') {
                            console.log(searchQueriesResponse);
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify({ queryValidation: 'valid', values: searchQueriesResponse.values }));
                        } else _generalInvalidResponse();
                    });
                    break;

                default:
                    _generalInvalidResponse();
                    break;
            }
        });
    }
}