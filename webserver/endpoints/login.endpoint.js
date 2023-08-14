export class UNICUMIntranetLoginService {
    static initLoginEndpoint(UnicumWebService) {
        UnicumWebService.post('/login', function (req, res) {
            let username = req.body.username;
            let password = req.body.password;

            const VALID_RESPONSE_MOCK = {
                authentication: 'verified',
                user: {
                    name: 'Test User',
                    nick: 'tuser',
                    
                }
            }

            if (username && password) {
                getAuthenticationFromDB(username, password).then((dbResponse) => {
                    if (dbResponse.auth === 'valid') {
                        res.send(JSON.stringify(VALID_RESPONSE_MOCK));
                    } else {
                        res.send('{"authentication": "failed"}')
                    }
                })
            }
        });
    }

    getAuthenticationFromDB(username, password) {
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
}