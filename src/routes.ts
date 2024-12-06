import { Router } from "express"
import { categoriesController } from "./controllers/categoriesController"
import { coursesController } from "./controllers/coursesController"
import { episodesController } from "./controllers/episodesController"
import { userController } from "./controllers/usersController"
import { ensureAuth, ensureAuthViaQuery } from "./middlewares/auth"
import { favoritesController } from "./controllers/favoritesController"
import { likeController } from "./controllers/likesController"

export const router = Router()

router.post("/auth/register", userController.register)
router.post("/auth/login", userController.login)

router.get("/categories", ensureAuth, categoriesController.index)
router.get("/categories/:id", ensureAuth, categoriesController.show)

router.get("/courses/featured",ensureAuth, coursesController.featured)
router.get("/courses/newest", coursesController.newest)
router.get("/courses/search",ensureAuth, coursesController.search)
router.get("/courses/:id",ensureAuth, coursesController.show)


router.get("/episodes/stream", ensureAuthViaQuery, episodesController.stream)

router.get("/favorites", ensureAuth, favoritesController.find)
router.delete("/favorites/:courseId", ensureAuth, favoritesController.delete)
router.post("/favorites", ensureAuth, favoritesController.create)

router.post("/likes", ensureAuth, likeController.create)
router.delete("/likes", ensureAuth, likeController.remove)