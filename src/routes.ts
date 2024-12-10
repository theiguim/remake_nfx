import { Router } from "express"
import { categoriesController } from "./controllers/categoriesController"
import { coursesController } from "./controllers/coursesController"
import { episodesController } from "./controllers/episodesController"
import { authController } from "./controllers/authController"
import { ensureAuth, ensureAuthViaQuery } from "./middlewares/auth"
import { favoritesController } from "./controllers/favoritesController"
import { likeController } from "./controllers/likesController"
import { userController } from "./controllers/userController"

export const router = Router()

router.post("/auth/register", authController.register)
router.post("/auth/login", authController.login)

router.get("/categories", ensureAuth, categoriesController.index)
router.get("/categories/:id", ensureAuth, categoriesController.show)

router.get("/courses/featured", ensureAuth, coursesController.featured)
router.get("/courses/newest", coursesController.newest)
router.get("/courses/popular", ensureAuth, coursesController.popular)
router.get("/courses/search", ensureAuth, coursesController.search)
router.get("/courses/:id", ensureAuth, coursesController.show)


router.get("/episodes/stream", ensureAuthViaQuery, episodesController.stream)

router.get("/episodes/:id/watchTime", ensureAuth, episodesController.getWatchTime)
router.post("/episodes/:id/watchTime", ensureAuth, episodesController.setWatchTime)

router.get("/favorites", ensureAuth, favoritesController.find)
router.delete("/favorites/:courseId", ensureAuth, favoritesController.delete)
router.post("/favorites", ensureAuth, favoritesController.create)

router.post("/likes", ensureAuth, likeController.create)
router.delete("/likes", ensureAuth, likeController.remove)

router.get("/users/current", ensureAuth, userController.show)
router.put("/users/current/", ensureAuth, userController.update)
router.put("/users/current/password", ensureAuth, userController.updatePassword)
router.get("/users/current/watching", ensureAuth, userController.watching)

