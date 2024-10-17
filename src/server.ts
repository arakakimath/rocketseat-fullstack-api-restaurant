import express from "express"

import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const PORT = 3333
const app = express()
app.use(express.json())
app.use(routes)

app.use((error:any, request:any, response:any, next:any) => {
  errorHandling(error, request, response, next) 
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))