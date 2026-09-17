import express from 'express'
import {createUser,findUser,findUserById,updateUser,deleteUser,loginUser } from "../controller/user.js";
 import authMiddleware from '../middleware/auth.js';
export const userRouter=express.Router()
userRouter.post('/',createUser)
userRouter.get('/',findUser)
userRouter.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});
userRouter.get('/:id',findUserById)
userRouter.put('/',updateUser)
userRouter.delete('/:id',deleteUser)
userRouter.post('/login',loginUser)
