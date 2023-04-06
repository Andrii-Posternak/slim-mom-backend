# REST-API-phonebook

This REST API can be used to manage the phone book.

## Created with

:white_check_mark: Node.js  
:white_check_mark: Mongo DB  
:white_check_mark: Express

## Usage

This REST API uses these endpoints:

- **POST** `/api/auth/register` - create a new user
- **POST** `/api/auth/login` - log in in the application
- **GET** `/api/auth/logout` - log out from the application

- **GET** `/api/users/current` - get information about the current user
- **PATCH** `/api/users` - update user's subscription
- **PATCH** `/api/users/avatars` - update user's avatar
- **GET** `/api/users/verify/:verificationToken` - confirm email
- **POST** `/api/users/verify` - reconfirm email

- **GET** `/api/contacts` - get all user's contacts
- **GET** `/api/contacts?favorite=true` - filter contacts by favorites
- **GET** `/api/contacts?page=1&limit=20` - pagination
- **GET** `/api/contacts/:contactId` - get user's contact by id
- **POST** `/api/contacts` - create a new contact
- **DELETE** `/api/contacts:contactId` - delete contact
- **PUT** `/api/contacts:contactId` - update an existing contact
- **PATCH** `/api/contacts:contactId/favorite` - update contact status

### Create a new user

**Request:**  
Content-Type: application/json  
Request body:

```
{
    "email": "example@example.com",
    "password": "example password"
}
```

**Response:**  
Status: 201 Created  
Response body:

```
{
    "user": {
        "email": "example@example.com",
        "subscription": "subscription type",
    }
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "error message"
}`

Status: 409 Conflict  
Response body:
`{
    "message": "Email in use"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Log in in the application

**Request:**  
Content-Type: application/json  
Request body:

```
{
    "email": "example@example.com",
    "password": "example password"
}
```

**Response:**  
Status: 200 OK  
Response body:

```
{
    "token": "example token",
    "user": {
            "email": "example@example.com",
            "subscription": "subscription type",
    }
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "error message"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Email or password is wrong"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Log out from the application

**Request:**  
Headers - Authorization: "Bearer {Token}"

**Response:**  
Status: 204 No Content

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Get information about the current user

**Request:**  
Headers - Authorization: "Bearer {Token}"

**Response:**  
Status: 200 OK  
Response body:

```
{
    "email": "example@example.com",
    "subscription": "subscription type",
}
```

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Update user's subscription

**Request:**  
Content-Type: application/json  
Headers - Authorization: "Bearer {Token}"  
Request body:

```
{
    "subscription": "subscription type"
}
```

**Response:**  
Status: 200 OK  
Response body:

```
{
    message: "Your subscription has been changed to 'subscription type'"
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "error message"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Update user's avatar

**Request:**  
Content-Type: multipart/form-data  
Headers - Authorization: "Bearer {Token}"  
Request body: downloaded file

**Response:**  
Status: 200 OK  
Response body:

```
{
    "avatarURL": "link to file"
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "File is not selected"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Confirm email

**Request:**  
Path params - contactId

**Response:**  
Status: 200 OK  
Response body:
`{
    "message": "Verification successful"
}`

Status: 404 Not found  
Response body:
`{
    "message": "User not found"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Reconfirm email

**Request:**  
Content-Type: application/json  
Request body:

```
{
    "email": "example@example.com"
}
```

**Response:**  
Status: 200 OK  
Response body:
`{
    "message": "Verification email sent"
}`

Status: 400 Bad Request  
Response body:
`{
    "message": "error message"
}`

Status: 404 Not found  
Response body:
`{
    "message": "User not found"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Get all user's contacts

**Request:**  
Headers - Authorization: "Bearer {Token}"

**Response:**  
Status: 200 OK  
Response body:

```
[
    {
        "_id": "example contact id"
        "name": "example name",
        "email": "example@example.com",
        "phone": "example number",
        "favorite": "contact status",
        "owner": {
            "_id": "example owner id",
            "email": "example@example.com"
        }
    }
]
```

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Filter contacts by favorites

**Request:**  
Headers - Authorization: "Bearer {Token}"
Query params - favorite=true

**Response:**  
Status: 200 OK  
Response body:

```
[
    {
        "_id": "example contact id"
        "name": "example name",
        "email": "example@example.com",
        "phone": "example number",
        "favorite": "true",
        "owner": {
            "_id": "example owner id",
            "email": "example@example.com"
        }
    }
]
```

Status: 400 Bad Request  
Response body:
`{
    "message": "Invalid query data"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Pagination

**Request:**  
Headers - Authorization: "Bearer {Token}"
Query params - page=1&limit=20

**Response:**  
Status: 200 OK  
Response body:

```
[
    {
        "_id": "example contact id"
        "name": "example name",
        "email": "example@example.com",
        "phone": "example number",
        "favorite": "contact status",
        "owner": {
            "_id": "example owner id",
            "email": "example@example.com"
        }
    }
]
```

Status: 400 Bad Request  
Response body:
`{
    "message": "Invalid query data"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Get user's contact by id

**Request:**  
Headers - Authorization: "Bearer {Token}"  
Path params - contactId

**Response:**  
Status: 200 OK  
Response body:

```
{
    "_id": "example contact id"
    "name": "example name",
    "email": "example@example.com",
    "phone": "example number",
    "favorite": "contact status",
    "owner": "example owner id",
    "createdAt": "date of creation",
    "updatedAt": "update date"
}
```

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Create a new contact

**Request:**  
Content-Type: application/json  
Headers - Authorization: "Bearer {Token}"  
Request body:

```
{
    "name": "example name",
    "email": "example@example.com",
    "phone": "example number"
}
```

**Response:**  
Status: 201 Created  
Response body:

```
{
    "_id": "example contact id"
    "name": "example name",
    "email": "example@example.com",
    "phone": "example number",
    "favorite": "contact status",
    "owner": "example owner id",
    "createdAt": "date of creation",
    "updatedAt": "update date"
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "Missing required name field"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Delete contact

**Request:**  
Headers - Authorization: "Bearer {Token}"  
Path params - contactId

**Response:**  
Status: 200 OK  
Response body:
`{
    "message": "Contact deleted"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 404 Not found  
Response body:
`{
    "message": "Not found"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Update an existing contact

**Request:**  
Content-Type: application/json  
Headers - Authorization: "Bearer {Token}"  
Path params - contactId  
Request body:

```
{
    "name": "example name",
    "email": "example@example.com",
    "phone": "example number"
}
```

**Response:**  
Status: 200 OK  
Response body:

```
{
    "_id": "example contact id"
    "name": "example name",
    "email": "example@example.com",
    "phone": "example number",
    "favorite": "contact status",
    "owner": "example owner id",
    "createdAt": "date of creation",
    "updatedAt": "update date"
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "Missing required name field"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 404 Not found  
Response body:
`{
    "message": "Not found"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`

### Update contact status

**Request:**  
Content-Type: application/json  
Headers - Authorization: "Bearer {Token}"  
Path params - contactId  
Request body:

```
{
    "favorite": "contact status"
}
```

**Response:**  
Status: 200 OK  
Response body:

```
{
    "_id": "example contact id"
    "name": "example name",
    "email": "example@example.com",
    "phone": "example number",
    "favorite": "contact status",
    "owner": "example owner id",
    "createdAt": "date of creation",
    "updatedAt": "update date"
}
```

Status: 400 Bad Request  
Response body:
`{
    "message": "Missing field favorite"
}`

Status: 401 Unauthorized  
Response body:
`{
    "message": "Not authorized"
}`

Status: 404 Not found  
Response body:
`{
    "message": "Not found"
}`

Status: 500 Internal Server Error  
Response body:
`{
    "message": "Server error"
}`
# slim-mom-backend
