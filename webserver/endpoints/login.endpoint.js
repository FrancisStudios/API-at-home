export class UNICUMIntranetLoginService {
    static initLoginEndpoint(UnicumWebService) {
        UnicumWebService.post('/login', function (req, res) {
            let username = req.body.username;
            let password = req.body.password;

            console.log(`Trying to log you in ${username}`)

            const VALID_RESPONSE_MOCK = {
                authentication: 'verified',
                user: {
                    _id: 163,
                    username: username,
                    password: password,
                    nickname: 'Teszt Elek',
                    prefix: 'Dr.',
                    language: '',
                    privileges: '',
                    GPF: '',
                    time_preference: '',
                    theme_preference: '',
                }
            }

            const getAuthenticationFromDB = (username, password) => {
                return new Promise((resolve) => {
                    /* TODO: wire in DB */
                    if (username === "test" && password === "123") {
                        setTimeout(() => {
                            resolve({ auth: 'valid' });
                        }, 200);
                    } else {
                        resolve({ auth: 'invalid' });
                    }
                });
            }

            if (username && password) {
                getAuthenticationFromDB(username, password).then((dbResponse) => {
                    if (dbResponse.auth === 'valid') {
                        res.set('content-type', 'text/plain');
                        res.send(JSON.stringify(VALID_RESPONSE_MOCK));
                    } else {
                        res.set('content-type', 'text/plain');
                        res.send('{"authentication": "failed"}')
                    }
                })
            } else {
                res.set('content-type', 'text/plain');
                res.send('{"authentication": "failed"}')
            }
        });
    }
}