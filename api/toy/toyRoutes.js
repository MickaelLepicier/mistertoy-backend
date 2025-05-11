import express from 'express'
import { log } from '../../middlewares/loggerMiddleware.js'
import { addToy, addToyMsg, getLabels, getLabelsCount, getToys, getToysById, removeToy, removeToyMsg, updateToy } from './toyController.js'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuthMiddleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)

// **************** Labels ****************:
toyRoutes.get('/labels', getLabels)
toyRoutes.get('/labels/count', getLabelsCount)

// **************** Toys ****************:
toyRoutes.get('/:id', getToysById)
toyRoutes.post('/', addToy)
toyRoutes.put('/:id', updateToy)
toyRoutes.delete('/:id', removeToy)

// **************** Msgs ****************:
toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAdmin, requireAuth, removeToyMsg)
