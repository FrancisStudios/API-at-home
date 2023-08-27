import genericQueryExecutor from "../../utils/generic-query.execute.js";

export class TimeServerEndpointService {
    static init(UnicumWebService) {

        UnicumWebService.post('/duegev-time', function (req, res) {

            let _query = req.body.query;
            let _queryObject = req.body.values;

            const getDuegevTime = () => {
                genericQueryExecutor("SELECT * FROM date").then(dbResponse => {
                    if (dbResponse.queryValidation === 'valid') {
                        res.set('content-type', 'text/plain');
                        let dateObject = JSON.parse(JSON.stringify(dbResponse)).values[0];
                        let date = dateObject.date;
                        res.send(JSON.stringify({ queryValidation: 'valid', values: date }));
                    } else {
                        res.set('content-type', 'text/plain');
                        res.send(JSON.stringify({ queryValidation: 'invalid' }));
                    }
                });
            };

            const newYear = () => {

                function fail() {
                    console.log('Date set failed!');
                    res.set('content-type', 'text/plain');
                    res.send(JSON.stringify({ queryValidation: 'invalid' }));
                }

                if (_queryObject) {
                    genericQueryExecutor(`SELECT * FROM users WHERE uid='${_queryObject.uid}' AND password='${_queryObject.password}'`).then(authentication => {
                        switch (authentication.queryValidation) {
                            case 'valid':
                                genericQueryExecutor("SELECT * FROM date").then(dbResponse => {
                                    if (dbResponse.queryValidation === 'valid') {
                                        let dateObject = JSON.parse(JSON.stringify(dbResponse)).values[0];
                                        console.log(`Attempt to set new date: ${dateObject.date + 1}`);
                                        if (dateObject.last_modified !== _queryObject.date && dateObject.last_user !== _queryObject.uid) {
                                            genericQueryExecutor(`UPDATE date SET date='${dateObject.date + 1}', last_modified='${_queryObject.date}', last_user='${_queryObject.uid}' WHERE date='${dateObject.date}'`)
                                                .then(dateSetResponse => {
                                                    if (dateSetResponse.queryValidation === 'valid') res.send(JSON.stringify({ queryValidation: 'valid' }));
                                                    else fail();
                                                });
                                        } else {
                                            res.set('content-type', 'text/plain');
                                            res.send(JSON.stringify({ queryValidation: 'invalid', values: 'already_set' }));
                                        }

                                    } else fail();
                                });
                                break;

                            default:
                                fail();
                                break;
                        }
                    });
                } else fail();
            }

            switch (_query) {
                case 'get':
                    getDuegevTime();
                    break;

                case 'set':
                    newYear();
                    break;
            }
        });
    }
}