import {Router} from "express";
import {
getUsers,
getUserById,
createUser
} from "../controllers/users.controller.js";

const userRoutes = Router();


userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUserById);
userRoutes.post('/', createUser);


export default userRoutes;