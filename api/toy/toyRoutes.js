import express from 'express'
import { log } from '../../middlewares/loggerMiddleware'
import { addToy, addToyMsg, getLabels, getLabelsCount, getToys, getToysById, removeToy, removeToyMsg, updateToy } from './toyController'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuthMiddleware'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)

// **************** Lables ****************:
router.get('/labels', getLabels)
router.get('/labels/count', getLabelsCount)

// **************** Toys ****************:
toyRoutes.get('/:id', getToysById)
toyRoutes.post('/', requireAuth, addToy)
toyRoutes.put('/:id', requireAuth, updateToy)
toyRoutes.delete('/:id', requireAuth, removeToy)

// **************** Msgs ****************:
toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAdmin, requireAuth, removeToyMsg)
