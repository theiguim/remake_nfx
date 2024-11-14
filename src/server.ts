import AdminJS from "adminjs";
import express from "express"
import { adminJrRouter, adminJs } from "./adminjs";
const PORT = process.env.PORT || 3000

const app = express();

app.use(express.static("public"))



app.use(adminJs.options.rootPath, adminJrRouter)

app.listen(PORT, () => console.log(`Running on ${PORT}...`))