# MERN Authentication `Backend`

This is a code along for MERN Auth

Notes:

- [x] Set up server
- [x] Test home route
- [x] Set up models folder and `index.js`
- [x] Add a `.env` with your `MONGO_URI`

```text
MONGO_URI=mongodb://localhost:27017/myApp
```

- [x] Set up `User` models
- [x] Make controllers folder and test /test route

### Checkpoint ✔️

- [x] Setup passport strategy
- [x] Intialize passport and pass passport as arguemnt to config
- [x] Make controllers and routes for user
  - [x] /test, /signup, /login, /profile
  - [x] Test each one after completing it in Postman

## What it includes

- Mongoose User schema and model
- Settings for the database
- Passport and passport-jwt for authentication
- JSON Web Token
- Passwords that are hashed with BCrypt

### User Model

| Column Name   | Data Type | Notes                                            |
| ------------- | --------- | ------------------------------------------------ |
| \_id          | Integer   | Serial Primary Key, Auto-generated               |
| name          | String    | Must be provided                                 |
| email         | String    | Must be unique / used for login                  |
| password      | String    | Stored as a hash                                 |
| timesLoggedIn | Number    | used to track the amount of times a user logs in |
| date          | Date      | Auto-generated                                   |
| \_\_v         | Number    | Auto-generated                                   |
