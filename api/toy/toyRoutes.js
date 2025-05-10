import express from "express"
import { log } from "../../middlewares/loggerMiddleware"
import { addToy, addToyMsg, getToys, getToysById, removeToy, removeToyMsg, updateToy } from "./toyController"
import { requireAdmin, requireAuth } from "../../middlewares/requireAuth.middleware"



export const toyRoutes = express.Router()


toyRoutes.get('/',log, getToys)
toyRoutes.get('/:id', getToysById)
toyRoutes.post('/', requireAuth, addToy)
toyRoutes.put('/:id', requireAuth, updateToy)
toyRoutes.delete('/:id', requireAuth, removeToy)

toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAdmin, requireAuth, removeToyMsg)



