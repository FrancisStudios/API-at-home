import { json } from "express";
import { SQLConnection } from "../database/database-connection.js";
import genericQueryExecutor from "../utils/generic-query.execute.js";
import sanitizeUserDefinedInput from "../utils/sanitize-user-input.util.js";

export class UNICUMIntranetLoginService {
    static initLoginEndpoint(UnicumWebService) {
        UnicumWebService.post('/login', function (req, res) {
            let query = req.body.query;
            let payload = req.body.values;

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

            /* CARREFOUR - Intent analysation*/

            switch (query) {

                /* SIMPLE LOGIN */
                case 'login':
                    if (payload.password && payload.username) {
                        getAuthenticationFromDB(payload.username, payload.password).then(dbResponse => {
                            if (dbResponse.auth === 'valid') {
                                let VALID_RESPONSE = {
                                    authentication: 'verified',
                                    user: JSON.parse(JSON.stringify(dbResponse.user))[0]
                                }
                                console.log(`Login successful ${VALID_RESPONSE.user.username}`);
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

                    break;

                /* CHANGE CREDENTIALS */
                case 'change-username':
                    getAuthenticationFromDB(payload.oldUsername, payload.password).then(authentication => {
                        if (authentication.auth === 'valid') {
                            let newUsername = sanitizeUserDefinedInput(payload.newUsername);
                            genericQueryExecutor(`UPDATE users SET username='${newUsername}' WHERE username='${payload.oldUsername}' AND password='${payload.password}'`)
                                .then(dbResponse => {
                                    if (dbResponse.queryValidation === 'valid') {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'valid' }));
                                    } else {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'invalid' }));
                                    }
                                });
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify({ queryValidation: 'invalid' }));
                        }
                    });
                    break;

                case 'change-password':
                    getAuthenticationFromDB(payload.username, payload.oldPassword).then(authentication => {
                        console.log(`Password change request for ${payload.username}`);
                        if (authentication.auth === 'valid') {
                            let newPassword = sanitizeUserDefinedInput(payload.newPassword);
                            genericQueryExecutor(`UPDATE users SET password='${newPassword}' WHERE username='${payload.username}' AND password='${payload.oldPassword}'`)
                                .then(dbResponse => {
                                    if (dbResponse.queryValidation === 'valid') {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'valid' }));
                                    } else {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'invalid' }));
                                    }
                                });
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify({ queryValidation: 'invalid' }));
                        }
                    });
                    break;

                /* CHANGE GENERIC USER PREFERENCES (nickname, prefix, language TODO:[time_preference, theme_preference]) */
                case 'change-preferences':
                    getAuthenticationFromDB(payload.username, payload.password).then(authentication => {
                        console.log(`User preference change request for ${payload.username}`);
                        if (authentication.auth === 'valid') {

                            let newNickname = sanitizeUserDefinedInput(payload.nickname);
                            let newPrefix = sanitizeUserDefinedInput(payload.prefix);
                            let newLanguage = sanitizeUserDefinedInput(payload.language);

                            genericQueryExecutor(`UPDATE users SET nickname='${newNickname}', prefix='${newPrefix}', language='${newLanguage}' WHERE username='${payload.username}' AND password='${payload.password}'`)
                                .then(dbResponse => {
                                    if (dbResponse.queryValidation === 'valid') {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'valid' }));
                                    } else {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'invalid' }));
                                    }
                                });
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify({ queryValidation: 'invalid' }));
                        }
                    });
                    break;

                /* CHANGE USER ROLES */
                /* ALREADY DOCUMENTED
                {
                    query: 'change-roles'
                    values: {
                        target: {
                            uid: number,
                            newRoleset: string[]
                        },
                        credentials: {
                            username: string,
                            password: string
                        }
                    }
                }
                */
                case 'change-roles':
                    getAuthenticationFromDB(payload.credentials.username, payload.credentials.password).then(authentication => {
                        if (authentication.auth === 'valid') {
                            genericQueryExecutor(`UPDATE users SET privileges='${JSON.stringify(payload.target.newRoleset)}' WHERE uid='${payload.target.uid}'`).then(dbResponse => {
                                if (dbResponse.queryValidation === 'valid') {
                                    res.set('content-type', 'text/plain');
                                    res.send(JSON.stringify({ queryValidation: 'valid', values: JSON.parse(JSON.stringify(payload.target.newRoleset)) }));
                                } else {
                                    res.set('content-type', 'text/plain');
                                    res.send(JSON.stringify({ queryValidation: 'invalid' }));
                                }
                            });
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify({ queryValidation: 'invalid' }));
                        }
                    });
                    break;

                /* GETS USER IDENTIFIERS AND ROLES */
                case 'get-truncated-ud':
                    getAuthenticationFromDB(payload.username, payload.password).then(authentication => {
                        if (authentication.auth === 'valid') {
                            genericQueryExecutor(`SELECT username, prefix, nickname, uid, privileges FROM users`)
                                .then(dbResponse => {
                                    if (dbResponse.queryValidation === 'valid') {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'valid', values: JSON.parse(JSON.stringify(dbResponse.values)) }));
                                    } else {
                                        res.set('content-type', 'text/plain');
                                        res.send(JSON.stringify({ queryValidation: 'invalid' }));
                                    }
                                });
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify({ queryValidation: 'invalid' }));
                        }
                    });
                    break;
                    
                case 'new-user':
                    getAuthenticationFromDB(payload.initiatorUN, payload.initiatorPW).then(authentication => {
                        if (authentication.auth === 'valid') {
                            genericQueryExecutor(`SELECT uid FROM users ORDER BY uid DESC LIMIT 1;`).then(biggestUID => {
                                if (biggestUID.queryValidation === 'valid') {
                                    let newUserUID = JSON.parse(JSON.stringify(biggestUID.values))[0].uid + 1;
                                    let nickname = 'New User'; let prefix = 'rookie';
                                    let buildNewUserQuery = `INSERT INTO users (uid, username, password, nickname, prefix, language, privileges)` +
                                        `VALUES ('${newUserUID}', '${payload.username}', '${payload.password}', '${nickname}', '${prefix}', 'English', 'default')`;

                                    genericQueryExecutor(buildNewUserQuery).then(dbResponse => {
                                        if (dbResponse.queryValidation === 'valid') {
                                            res.set('content-type', 'text/plain');
                                            res.send(JSON.stringify({ queryValidation: 'valid', values: 'successful-user-creation' }));
                                        } else {
                                            res.set('content-type', 'text/plain');
                                            res.send(JSON.stringify({ queryValidation: 'invalid' }));
                                        }
                                    });
                                }
                            });
                        } else {
                            res.set('content-type', 'text/plain');
                            res.send(JSON.stringify({ queryValidation: 'invalid' }));
                        }
                    });
                    break;
            }
        });
    }
}