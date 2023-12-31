# UNICUM Intranet Endpoint Contract 🔌

## 1. LOGIN 💻

**endpoint:** /login

API receives the following object from the frontend auth service

Valid request bodies:

Simple login query containing the intent _(query: 'login')_ and the payload data as _values_

```
 { query: 'login', values: { username: username, password: password }
```

Username change intent:
```
{ 
    query: 'change-username', 
    values: { 
        oldUsername: oldUsername, 
        newUsername: newUsername, 
        password: password 
    } 
}
```

Password change intent:
```
{ 
    query: 'change-password', 
    values: { 
        username: username, 
        oldPassword: oldPassword, 
        newPassword: newPassword 
    } 
}
```
User roles and privileges change intent:
```
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
```
This intent can be only sent from a **sudo** user. In the ``newRoleset:string[]`` there should be all the new roles listed for a specific user, along with the UID. Credentials hold the sudo user creds.

Get truncated user data query for account menu user editor:
```
{ 
    query: 'get-truncated-ud', 
    values: { 
        username: loggedInUser.username, 
        password: loggedInUser.password 
    } 
}
```
New user (user creation) intent:
```
{ 
    query: 'new-user', 
    values: { 
        username: username, 
        password: password, 
        initiatorUN: initiatorUN, 
        initiatorPW: initiatorPW 
    } 
}
```
Where ``initiatorUN`` and ``initiatorPW`` is the **recruiter** user who initiated the new user creation, and username and password fields are belonging to the newly established user account. 

Backend matches credentials with the stored values. And responds with a valid or invalid response, both HTTP 200.

### VALID RESPONSES ✅

General good login returns authentication 'verified' and UserData object
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

Truncated user query endpoint returns as part of values
```
TruncatedUserData = {
    username: string,
    prefix: string,
    nickname: string,
    uid: number,
    privileges: string[];
}
```
Change roles valid response
```
{
    queryValidation: 'valid',
    values: newRoles[] as string
}
```

New user created valid response

```
{ 
    queryValidation: 'valid', 
    values: 'successful-user-creation' 
}
```

### INVALID RESPONSES ❌

For general authentication
```
{authentication: 'failed'}
```

Every other sub-endpoint:
```
{ queryValidation: 'invalid' }
```

Both stack can decide about the actions by this authentication flag. Secondarily we have to check the integrity of the user object IF verified.

---

## 2. DUGEV WIKI ARTICLE ENDPOINT 🖨️

**endpoint:** /article

Valid request bodies:

For querying all (top 100 records) -> returns list of articles:
```
 { query: '*', ?values:<WikiArticle> }
```
For querying the latest record (with highest ID) usually used for logic purposes, but can be found on the homepage as the latest article:
```
 { query: 'get-latest', ?values:<WikiArticle> }
```
For getting the most liked article DESC LIMIT 1; use the following query word:
```
 { query: 'get-most-liked' }
```
For getting an article by article_id field:
```
 { query: 'get-article-by-id', values:<string> article_id }
```
For inserting a new article into DB:
```
 { query: 'insert', values:<WikiArticle> }
```

For getting articles that belongs to a certain user use the get-by-uid
```
 { query: 'get-by-uid', values:<number>UID }
```
For deleting an article (use ```delete-article``` query command):
```
deleteQuery<ArticleSearchQueryType> = 
{
    query: 'delete-article',
    values: {
        articleID: article_id,
        credentials: {
            username: username,
            password: password,
            UID: UID
        }
    }
}
```

For updating an article **update-article**
```
deleteQuery<ArticleSearchQueryType> = 
{
    query: 'update-article',
    values: <WikiArticle>
}
```

For fetching next 200 articles ordered by _id (pagination in duegev browse page)
```
 { query: 'fetch-next-chunk', values:<WikiArticle>[] }
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


### VALID RESPONSES ✅
```
const VALID_RESPONSE = {
    queryValidation: 'valid',
    articles: <WikiArticle>[]
}
```

**DELETE** and **UPDATE** responses
```
VALID_RESPONSE = {
    queryValidation: 'valid',
    values: 'successful-delete' | 'successful-update'
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

## 3. DUGEV WIKI ARTICLE LIKE ENDPOINT 👍

**endpoint:** /article-like

Valid request body:
```
 { 
    query: {
        credentials: {
            username: string,
            password: string,
        }
        action: 'add' | 'remove';
        article_id: string
    } 
}
```

### Backend procedure:
Backend should make a request to the DB authenticating the user, and if it's successful, procceed to execute the action **'add'** or **'remove'** which adds the UID to the list of likers.

### VALID RESPONSE ✅
```
const VALID_RESPONSE = {
    queryValidation: 'valid',
    articles:[]
}
```

### INVALID RESPONSE ❌
```
 const INVALID_RESPONSE = {
    queryValidation: 'invalid',
    articles: []
}
```

---

## 4. DUGEV WIKI TIME ENDPOINT ⏰

**endpoint:** /duegev-time

Valid request body:
```
 {
    query: string < 'get' | 'set' >,
    values: {
        uid: number,
        password: string,
        date: string ,
    }
}
```

### Purpose:
This provides the game time to our players:

- **get**: no auth needed, gets the date from the db
- **set**: authentication is needed adds +1 years to date. Stores username and last modified date in DB, so one user can only modify the date once a day.

### VALID RESPONSE ✅
```
const VALID_RESPONSE = {
    queryValidation: 'valid',
    values?: number /* only when GET */
}
```

### INVALID RESPONSES ❌

General error:
```
 const INVALID_RESPONSE = {
    queryValidation: 'invalid',
}
```

If the user already set the date that day:
```
 const INVALID_RESPONSE = {
    queryValidation: 'invalid',
    values: 'already_set'
}
```

---
## 5. DUGEV ARTICLE SEARCH ENDPOINT 🔎

**endpoint:** /duegev-search

Valid request body:
```
 {
    query: string < 'search' >,
    values: {
        labels: string[],
        categories: string[],
        title: string,
        document: string,
    }
}
```

### Values fields:
- **labels**: string[] with all the labels user defined in their query
- **categories**: string[] with all the category tags defined in the SQ.
- **title**: string with the content to search in titles.
- **document**: string (the default query searches in only the document content)

### Example user-side search query:

```
" some generic text &labels[label1, label2] &categories[category1, category2] &in:title=blablabla "
```

delimiters are the & characters

**Syntax :**
- generic text only: searches in the document 
- labels[]: accepts a list (without quote marks)
- categories[]: accepts a list (without quote marks)
- &in:title: accepts a search string to search in titles

### VALID RESPONSE ✅
```
const VALID_RESPONSE = {
    queryValidation: 'valid',
    values: WikiArticle[]
}
```

### INVALID RESPONSE ❌

```
 const INVALID_RESPONSE = {
    queryValidation: 'invalid',
}
```
---

## 6. DUGEV USER ROLES ENDPOINT 👥

**endpoint:** /duegev-roles

Valid request body:
```
{
    query: 'get-roles' | 'set-roles'
    values: {
        username: string,
        password: string
        newRoles?: string[] // only when 'set-roles' query
    }
}
```

### Values fields:
- **newRoles**: string[] contains all the previous and new roles for the specific users

### VALID RESPONSES ✅

#### get-roles
```
VALID_RESPONSE = {
    queryValidation: 'valid',
    values: <UserRoles>[]
}
```

#### set-roles
```
VALID_RESPONSE = {
    queryValidation: 'valid',
    values: 'new roles set!'
}
```

### INVALID RESPONSE ❌

```
 INVALID_RESPONSE = { queryValidation: 'invalid' }
```
---