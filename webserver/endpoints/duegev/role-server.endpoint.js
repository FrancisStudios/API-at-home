import genericQueryExecutor from "../../utils/generic-query.execute.js";
import sanitizeUserDefinedInput from "../../utils/sanitize-user-input.util.js";

export class RoleServerEndpointService {
    static init(UnicumWebService) {
        UnicumWebService.post('/duegev-roles', function (req, res) {

            INVALID_RESPONSE = { queryValidation: 'invalid' }

            let query = req.body.query;
            let values = req.body.values;

            const getUserRoles = () => {
                return genericQueryExecutor(`SELECT privileges FROM users WHERE username='${values.username}' AND password='${values.password}'`);
            }

            const setNewUserRole = (newRolesArray) => {
                return genericQueryExecutor(`UPDATE users SET privileges='${newRolesArray}' WHERE username='${values.username}' AND password='${values.password}'`);
            }

            switch (query) {
                case 'get-roles':
                    getUserRoles().then(response => {
                        if (response.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                values: JSON.parse(JSON.stringify(response.values))
                            }
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(VALID_RESPONSE));
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify(INVALID_RESPONSE));
                        }
                    });
                    break;

                case 'set-roles':

                    let newRolesArray = values.newRoles.map(role => {
                        return sanitizeUserDefinedInput(role);
                    });

                    setNewUserRole(newRolesArray).then(response => {
                        if (response.queryValidation === 'valid') {
                            const VALID_RESPONSE = {
                                queryValidation: 'valid',
                                values: 'new roles set!'
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