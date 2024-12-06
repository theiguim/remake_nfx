import AdminJS from "adminjs";
import express from "express"
import { adminJrRouter, adminJs } from "./adminjs";
import { router } from "./routes";
const PORT = process.env.PORT || 3000

const app = express();

app.use(express.static("public"))

app.use(express.json())

app.use(router)


app.use(adminJs.options.rootPath, adminJrRouter)

app.listen(PORT, () => console.log(`Running on ${PORT}...`))