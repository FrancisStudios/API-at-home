import { SQLConnection } from "../database/database-connection.js";

export class UNICUMIntranetLoginService {
    static initLoginEndpoint(UnicumWebService) {
        UnicumWebService.post('/login', function (req, res) {
            let username = req.body.username;
            let password = req.body.password;

            console.log(`Trying to log you in ${username}`);

            const getAuthenticationFromDB = (username, password) => {
                return new Promise((resolve) => {
                    let dbConnection = new SQLConnection();

                    try {
                        dbConnection.makeQuery(`SELECT * FROM users WHERE username='${username}' AND password='${password}'`).then(USER_RESPONSE => {
                            dbConnection.closeConnection();
                            
                            if (USER_RESPONSE.length === 1) {
                                resolve({ auth: 'valid', user: USER_RESPONSE });
                            } else {
                                resolve({ auth: 'invalid' });
                            }
                        });

                    } catch (err) {
                        resolve({ auth: 'invalid' });
                        throw err;
                    }
                });
            }

            if (username && password) {
                getAuthenticationFromDB(username, password).then((dbResponse) => {
                    if (dbResponse.auth === 'valid') {
                        let VALID_RESPONSE = {
                            authentication: 'verified',
                            user: {
                                _id: dbResponse.user[0]._id,
                                uid: dbResponse.user[0].uid,
                                username: dbResponse.user[0].username,
                                password: dbResponse.user[0].password,
                                nickname: dbResponse.user[0].nickname,
                                prefix: dbResponse.user[0].prefix,
                                language: dbResponse.user[0].language,
                                privileges: dbResponse.user[0].privileges,
                                GPF: dbResponse.user[0].gpf,
                                time_preference: dbResponse.user[0].time_preference,
                                theme_preference: dbResponse.user[0].theme_preference,
                            }
                        }

                        console.log('Login successful!');

                        res.set('content-type', 'text/plain');
                        res.send(JSON.stringify(VALID_RESPONSE));
                    } else {
                        res.set('content-type', 'text/plain');
                        res.send('{"authentication": "failed"}');
                        console.log('Login declined!');
                    }
                })
            } else {
                res.set('content-type', 'text/plain');
                res.send('{"authentication": "failed"}');
                console.log('Login declined!');
            }
        });
    }
}