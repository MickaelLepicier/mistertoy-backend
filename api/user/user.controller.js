import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getUsers(req, res) {
  try {
    const filterBy = {
      txt: req.query?.txt || ''
      // minBalance: +req.query?.minBalance || 0
    }
    const users = await userService.query(filterBy)
    res.status(200).send(users)
  } catch (err) {
    loggerService.error('Failed to get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

export async function getUser(req, res) {
  console.log('FULL URL:', req.originalUrl)
console.log('PARAMS:', req.params)

  try {
    const { userId } = req.params
  console.log('XXX userId: ',userId)
    const user = await userService.getById(userId)
    res.status(200).send(user)
  } catch (err) {
    loggerService.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}

export async function deleteUser(req, res) {
  try {
    const { userId } = req.params
    await userService.remove(userId)
    res.status(200).send({ msg: 'Deleted successfully' })
  } catch (err) {
    loggerService.error('Failed to delete user', err)
    res.status(500).send({ err: 'Failed to delete user' })
  }
}

export async function addUser(req, res) {
  try {
    const user = req.body
    const savedUser = await userService.add(user)
    res.status(200).send(savedUser)
  } catch (err) {
    loggerService.error('Failed to add user', err)
    res.status(500).send({ err: 'Failed to add user' })
  }
}

export async function updateUser(req, res) {
  try {
    const user = req.body
    const savedUser = await userService.update(user)
    res.status(200).send(savedUser)
  } catch (err) {
    loggerService.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}
