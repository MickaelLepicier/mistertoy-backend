import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import {
  addToy,
  addToyMsg,
  getLabels,
  getLabelsCount,
  getToys,
  getToyById,
  removeToy,
  removeToyMsg,
  updateToy
} from './toy.controller.js'
import {
  requireAdmin,
  requireAuth
} from '../../middlewares/requireAuth.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)

// **************** Labels ****************:
toyRoutes.get('/labels', getLabels)
toyRoutes.get('/labels/count', getLabelsCount)

// **************** Toys ****************:
toyRoutes.get('/:toyId', getToyById)
toyRoutes.post('/', requireAuth, requireAdmin, addToy)
toyRoutes.put('/:toyId', requireAuth, requireAdmin, updateToy)
toyRoutes.delete('/:toyId', requireAuth, requireAdmin, removeToy)

// **************** Msgs ****************:
toyRoutes.post('/:toyId/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:toyId/msg/:msgId', requireAuth, removeToyMsg)
