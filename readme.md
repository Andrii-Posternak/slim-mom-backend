# Slim-mom-backend

Base URL: https://slim-mom-backend-tf5k.onrender.com

## Usage

This REST API uses these endpoints:

- **POST** `/api/auth/register` - create a new user
- **POST** `/api/auth/login` - log in in the application
- **GET** `/api/auth/logout` - log out from the application

- **GET** `/api/users/current` - get information about the current user
<!-- - **GET** `/api/users/verify/:verificationToken` - confirm email
- **POST** `/api/users/verify` - reconfirm email -->

- **GET** `/api/products/:date` - get all user's products per day
- **GET** `/api/products/?productName=productName` - get all product categories from DB
- **DELETE** `/api/products/:productId` - delete product
- **POST** `/api/products` - add a new product
- **POST** `/api/products/publicCalorie` - get a calorie count and non-recommended foods for unregistered user
- **POST** `/api/products/privateCalorie` - get a calorie count and non-recommended foods for REGISTERED user

### **POST** `/api/auth/register`

**Request body:**

```
{
    "name": "name",
    "email": "test@test.com",
    "password": "password"
}
```

**Response body:**

```
{
    "user": {
        "name": "name",
        "email": "test@test.com"
    }
}
```

### **POST** `/api/auth/login`

**Request body:**

```
{
    "email": "test@test.com",
    "password": "password"
}
```

**Response body:**

```
{
    "token": "token",
    "user": {
        "name": "name",
        "email": "test@test.com"
    }
}
```

### **GET** `/api/auth/logout`

**Authorization**

### **GET** `/api/users/current`

**Authorization**

**Response body:**

```
{
    "_id": "642da20a63fc51b93c0fe945",
    "name": "ben",
    "email": "test2@test.com",
    "height": null,
    "age": null,
    "currentWeight": null,
    "desiredWeight": null,
    "bloodType": 1,
    "dailyRate": null,
    "notRecFood": [],
    "createdAt": "2023-04-05T16:30:02.590Z"
}
```

### **GET** `/api/products/:date`

**Authorization**
**Query params** toDateString()

**Response body:**

```
[
    {
        "_id": "642da33feb2cdbbd81b1a5b8",
        "productName": "egg",
        "weight": 100,
        "calories": 422,
        "date": "2023-02-02T22:00:00.000Z",
        "owner": {
            "_id": "642da20a63fc51b93c0fe945",
            "name": "ben",
            "email": "test2@test.com",
            "dailyRate": null,
            "notRecFood": []
        }
    }
]
```

### **GET** `api/products/?productName=productName`

**Authorization**
**Query params**

**Response body:**

```
[
   {
        "_id": "5d51694802b2373622ff5565",
        "categories": {
            "ru": "зерновые",
            "uk": "зернові",
            "en": "cereals"
        },
        "weight": 100,
        "title": {
            "ru": "Гречневые хлопья Myllyn Paras для каши",
            "ua": "Гречані пластівці Myllyn Paras для каші",
            "en": "Buckwheat flakes Myllyn Paras for porridge"
        },
        "calories": 340,
        "groupBloodNotAllowed": [
            null,
            true,
            false,
            true,
            true
        ],
        "__v": 0
    }
]
```

### **POST** `/api/products`

**Authorization**
**Request body:**

    ```

{
"productName": "Яйце куряче (жовток сухий)",
"weight": "100",
"calories": "354"
}

```

**Response body:**

```

{
"productName": "Яйце куряче (жовток сухий)",
"weight": 100,
"calories": 354,
"date": "2023-04-07T14:12:01.020Z",
"owner": "642da20a63fc51b93c0fe945",
"\_id": "642dd2598c71f0c2d6408c1e"
}

```


### **DELETE** `/api/products/:productId`
**Request params**
**Authorization**

**Response body:**

```

{
"message": "Product deleted"
}

```

```
