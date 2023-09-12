import genericQueryExecutor from "../../utils/generic-query.execute.js";
import sanitizeUserDefinedInput from "../../utils/sanitize-user-input.util.js";

export class MapHandlerEndpointService {
    static init(UnicumWebService) {
        UnicumWebService.post('/duegev-map', function (req, res) {

            INVALID_RESPONSE = { queryValidation: 'invalid' }

            let query = req.body.query;
            let values = req.body.values;

           
        });
    }
}