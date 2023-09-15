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
                        if (parameters.document !== '*') {
                            genericQueryExecutor(`SELECT * FROM articles WHERE document LIKE '%${parameters.document}%';`).then(dbDocumentQuery => {
                                if (dbDocumentQuery.queryValidation === 'valid') {

                                    let _finalDocuments = dbDocumentQuery.values;
                                    if (parameters.labels && parameters.labels.length > 0) _finalDocuments = _finalDocuments.filter(document => document.labels.includes(parameters.labels));
                                    if (parameters.categories && parameters.categories.length > 0) _finalDocuments = _finalDocuments.filter(document => document.categories.includes(parameters.categories));
                                    if (parameters.title && parameters.title !== '') _finalDocuments = _finalDocuments.filter(document => document.title.includes(parameters.title));

                                    resolve({ queryValidation: 'valid', values: _finalDocuments });

                                } else resolve({ queryValidation: 'invalid' });
                            });
                        } else if (parameters.document === '*') {
                            /* IF DOCUMENT == * then query by labels, categories, or title, what comes first in lin*/
                        }
                    } else {
                        /*
                        * TODO FOR LATER: if users want to search an article without providing any general text only
                        * categories, labels or title 
                        */
                        resolve({ queryValidation: 'invalid' });
                    }
                });
            }

            switch (query) {
                case 'search':
                    search().then(searchQueriesResponse => {
                        if (searchQueriesResponse.queryValidation === 'valid') {
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