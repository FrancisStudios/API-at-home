# UNICUM Intranet Endpoint Contract 🔌

## 1. LOGIN 💻

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

---

## 2. DUGEV WIKI ARTICLE ENDPOINT 🖨️

**endpoint:** /article

Valid request body:
```
 { query: '*', ?values:<WikiArticle> }
```

### Fields:
- query: when '*' it's an ENUM for top 100 records from DB (as all articles)
- values: when query is 'insert' then values is an article object 

### Article object: 
```
export type WikiArticle = {
    _id: number,
    article_id: string,
    title: string,
    date: number,
    author: UserData['uid'] | number,
    irl_date: string
    labels: string[],
    categories: string[],
    document: string,
    likes: UserData['uid'][] | number[]
}
```


### VALID RESPONSE ✅
```
const VALID_RESPONSE = {
    queryValidation: 'valid',
    articles: <WikiArticle>[]
}
```

### INVALID RESPONSE ❌
```
 const INVALID_RESPONSE = {
    queryValidation: 'invalid',
    articles: []
}
```

### Scenarios:
- Get specific or all article(s). In this case the valid response contains an array of Wiki Article objects as response.article (iterable).
- Insert new article. In this case the valid response **does not** contein an article field or the article field is an empty array. But it shouldn't bother the FE, since that field is unused in this scenario. We only wait for the **queryValidation**:'valid' to return to ensure user that data is saved.

---