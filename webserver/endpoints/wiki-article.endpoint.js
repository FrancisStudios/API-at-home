export class WikiArticleEndpointService {
    static initLoginEndpoint(UnicumWebService) {
        UnicumWebService.post('/article', function (req, res) {
            let searchquery = req.body.query;
            
            console.log(`Trying to find document with <${searchquery}>`)

            const INVALID_RESPONSE = {
                queryValidation : 'invalid',
                articles: []
            }

            const VALID_RESPONSE_MOCK = {
                queryValidation : 'valid',
                articles: [

                ]
            }

            const getArticlesFromDB = (searchquery) => {
                return new Promise(resolve=>{
                    /* BUILD SEARCH QUERY TOKENIZATION LOGIC AND QUERY DB*/
                    if(searchquery==="*"){
                        setTimeout(()=>{
                            resolve(VALID_RESPONSE_MOCK);
                        }, 560);
                    }
                });
            }
            
            if (searchquery) {
                getArticlesFromDB(searchquery).then((dbResponse) => {
                    if (dbResponse.queryValidation === 'valid') {
                        res.set('content-type', 'text/plain');
                        res.send(JSON.stringify(VALID_RESPONSE_MOCK));
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