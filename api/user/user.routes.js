import express from 'express'

import {
  requireAuth,
  requireAdmin
} from '../../middlewares/requireAuth.middleware.js'
import {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  addUser
} from './user.controller.js'

export const userRoutes = express.Router()

// middleware that is specific to this router
// userRoutes.use(requireAuth)

userRoutes.post('/', addUser)
userRoutes.get('/', getUsers)
userRoutes.get('/:userId', getUser)
// userRoutes.put('/:id',  updateUser)

userRoutes.put('/:userId', requireAuth, updateUser)
userRoutes.delete('/:userId', requireAuth, requireAdmin, deleteUser)
