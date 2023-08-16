import { SQLConnection } from "../database/database-connection.js";

export class UserOperationsEndpointService {
    static initLoginEndpoint(UnicumWebService) {
        UnicumWebService.post('/userop', function (req, res) {
            console.log('user operations was called')

            let searchquery = req.body;

            console.log(`User operations with <${searchquery}>`);

            const getUserByValue = (key_value) => {
                let dbConnection = new SQLConnection();
                /* key_value = "uid='1'" */
                return new Promise(resolve => {
                    try {
                        dbConnection.makeQuery(`SELECT * FROM users WHERE ${key_value}`).then((response) => {
                            dbConnection.closeConnection();
                            let user = response;
                            resolve({ queryValidation: 'valid', user: JSON.parse(JSON.stringify(user)) });
                        });
                    } catch (error) {
                        resolve({ queryValidation: 'invalid' });
                        throw error;
                    }
                });
            }

            /* searchquery = {query: "getUserBy", value: "uid='1'"} */
            switch (searchquery.query) {
                case 'getUserBy':
                    getUserByValue(searchquery.value).then(response=>{
                        res.set('content-type', 'text/plain');
                        res.send(JSON.stringify(response));
                    })
                    break;
            }
        });
    }
}