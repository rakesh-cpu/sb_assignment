import { Router } from "express";
import { registerUser,loginUser,getUserDetails,forgotPassword,resetPassword,updateUserProfile,getUsers,deleteUser } from "../Controllers/users.js";
import {authenticateByRole,authenticate,admin, authenticateByRoleAndEmail} from "../Middleware/auth.js";
const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile",admin, getUserDetails);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.put("/resetpassword/:resetToken", resetPassword);
userRouter.put("/updateprofile", authenticateByRoleAndEmail('user'), updateUserProfile);
userRouter.get("/users-list", authenticate, admin, getUsers);
userRouter.delete("/userDeletionByAdmin/:id", authenticate, admin, deleteUser);
// userRouter.get("/:id", authenticate,admin, getUserById);

export default userRouter;
