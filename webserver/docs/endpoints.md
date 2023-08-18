# UNICUM Intranet Endpoint Contract 🔌

## LOGIN 💻

**endpoint:** /login

API receives the following object from the frontend auth service
```
{ username: "username", password: "password-hash"}
```
Backend matches credentials with the stored values. And responds with a valid or invalid response, both HTTP 200.

### VALID RESPONSE ✅
```
{ 
    authentication: 'verified', 
    user: {
        _id: number,
        uid: number,
        username: string,
        password: string as a <HASH>
        nickname: string,
        prefix: string,
        language: string,
        privileges: string | string[],
        GPF: string,
        time_preference: string | UserTimePreferences,
        theme_preference: string | UserThemePreferences,
    }
}
```

### INVALID RESPONSE ❌
```
{"authentication": "failed"}
```

Both stack can decide about the actions by this authentication flag. Secondarily we have to check the integrity of the user object IF verified.

## DUGEV WIKI ARTICLE SERVER ENDPOINT 🖨️

**endpoint:** /article


