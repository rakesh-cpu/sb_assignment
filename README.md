
# Assignment Documentation

## Table of Content

- Overview
- Installation
- Project Structure
- Endpoints

        1. User Registration
        2. User Login
        3. User Profile
        4. Forgot Password
        5. Reset Password
        6. Update User Profile
        7. Get Users List
        8. Delete User by Admin
- Middleware

      1. Authentication Middleware
      2. Admin Middleware
      3. Role-based Authentication Middleware
Technologies Used
      1. Express.js
      2. JWT
      3. MYSQL 
      4. TOOLS
          i) POSTMAN
         ii) VSCODE

 ## Overview
    As part of the [Secure Blink](https://www.secureblink.com/careers/65572ecc7bf50b6baae8aaf0)  Internship Assignment, I have developed an Express.js application that fulfills the specified rules and requirements. This web application leverages the Express.js framework for building robust APIs, utilizes Node.js for server-side scripting, and employs MySQL as the underlying database. Additionally, various libraries, including JWT, have been integrated to enhance authentication and authorization processes.

## Installations:
   - npm init
   - npm i express jsonwebtoken mysql2 bcryptjs
## Project Structure:
   api/
|-- Controllers/
|   |-- users.js
|-- Middleware/
|   |-- auth.js
|-- Routers/
|   |-- users.js
|-- index.js
|-- .env
|-- package.json


## End points
   - http://localhost:8080/api/users/endpoints
   1 userRouter.get("/login",loginUser);
   2 userRouter.get("/profile",admin, getUserDetails);
   3 userRouter.post("/forgotpassword", forgotPassword);
   4 userRouter.put("/resetpassword/:resetToken", resetPassword);
   5 userRouter.put("/updateprofile", authenticateByRoleAndEmail('user'), updateUserProfile);
   6 userRouter.get("/users-list", authenticate, admin, getUsers);
   7 userRouter.delete("/userDeletionByAdmin/:id", authenticate, admin, deleteUser);
