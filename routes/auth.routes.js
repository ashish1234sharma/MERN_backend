import express from 'express';
import { SignIn, SignUp, GetUsers, UserUpdate, UserAddressUpdate, PasswordForgot, PasswordReset, GetProfile, FindUser } from '../controllers/users.controllers.js';
import { DuplicateEmail } from '../utils/DuplicateEmail.js';
import { DuplicateMobile } from '../utils/DuplicateMobile.js';
import { UserExist } from '../utils/UserExist.js';
import { Auth } from '../middlewares/auth.js';
import { UserIdExit } from '../utils/UserIdExit.js';
import { UpdateValidation } from '../utils/UpdateValidation.js';

const UserRoute = express.Router();

UserRoute.post('/user/register', DuplicateEmail, DuplicateMobile, SignUp);
UserRoute.post('/user/login', UserExist, SignIn);
UserRoute.get('/users', Auth, GetUsers);
UserRoute.get('/user/:_id', Auth, UserIdExit, GetUsers);
UserRoute.get('/profile/user', Auth, GetProfile);
UserRoute.get('/profile/user/find/:username', UserExist, FindUser);
UserRoute.patch('/user/:_id/update', Auth, UserIdExit, UpdateValidation, /* DuplicateEmail, DuplicateMobile, */ UserUpdate);
UserRoute.patch('/user/address/:_id/update', Auth, UserIdExit, UserAddressUpdate);
UserRoute.patch('/user/forgot/password/:_id', UserIdExit, PasswordForgot);
UserRoute.patch('/user/reset/password/:_id', Auth, UserIdExit, PasswordReset);


export { UserRoute };
