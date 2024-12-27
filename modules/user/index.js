import express from 'express'
import { signUpController,loginController,updateUserController,logoutController, googleSignInController } from './user.controller.js'
import { auth } from '../../middleware/auth.js'

const router =express.Router()

//route to register user
router.post('/register',signUpController)


//route to login user
router.post('/login',loginController)


//route to update budget
router.patch('/update',auth,updateUserController)

//route to logout
router.post('/logout', logoutController);


router.post('/google', googleSignInController); // Add Google Sign-In route



export default router