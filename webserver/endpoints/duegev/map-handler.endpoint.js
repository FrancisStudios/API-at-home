import genericQueryExecutor from "../../utils/generic-query.execute.js";
import sanitizeUserDefinedInput from "../../utils/sanitize-user-input.util.js";

export class MapHandlerEndpointService {
    static init(UnicumWebService) {
        UnicumWebService.post('/duegev-map', function (req, res) {

            INVALID_RESPONSE = { queryValidation: 'invalid' }

            let query = req.body.query;
            let values = req.body.values;

            const GENERAL_INVALID_RESPONSE = () => {
                res.set('content-type', 'text/plain');
                res.send(JSON.stringify({ queryValidation: 'invalid' }));
            }

            switch (query) {
                /*
                {
                    dates: {
                        irl_date: string,
                        date: string
                    },
                    updater_uid: number,
                    description: string,
                    map: {
                        mapid: string,
                        old_mapid: string,
                        file: string
                    }
                }
                */
                case 'set-map':
                    let update_map = `UPDATE map` +
                        `SET date='${values.dates.date}', irl_date='${values.dates.irl_date}, updater_uid='${values.updater_uid}', description='${values.description}', mapid='${values.map.mapid}', file='${values.map.file}' ` +
                        `WHERE mapid='${values.map.old_mapid}';`;

                    genericQueryExecutor(update_map).then(dbResponse => {
                        genericQueryExecutor(`SELECT * FROM map`).then(dbResponse => {
                            if (dbResponse.queryValidation === 'valid') {
                                const VALID_RESPONSE = {
                                    queryValidation: 'valid',
                                    values: 'successful-map-update'
                                }
                                res.set('content-type', 'text/plain');
                                res.send(JSON.stringify(VALID_RESPONSE));
                            } else {
                                GENERAL_INVALID_RESPONSE();
                            }
                        });
                    });
                    break;

                case 'get-map':
                    genericQueryExecutor(`SELECT * FROM map`).then(dbResponse => {
                        if (dbResponse.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                values: JSON.parse(JSON.stringify(dbResponse.values[0]))
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            GENERAL_INVALID_RESPONSE();
                        }
                    });
                    break;
            }

        });
    }
}