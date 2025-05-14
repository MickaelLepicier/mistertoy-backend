
import { userService } from './userService.js'
import { loggerService } from '../../services/loggerService.js'

// TODOs:
// [v] Add user data to mongo
// [] Check If I need to put an addUser function to add user when signup
// [] Test msgs
// [] Add Login and Signup pages

export async function getUsers(req, res) {
  try {
    const filterBy = {
      txt: req.query?.txt || '',
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
  try {
    const { id } = req.params
    const user = await userService.getById(id)
    res.status(200).send(user)
  } catch (err) {
    loggerService.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}



export async function deleteUser(req, res) {
  try {
    const { id } = req.params
    await userService.remove(id)
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
  console.log('updateUser: ',updateUser)
  console.log('req.body: ',req.body)
  try {
    const user = req.body
    const savedUser = await userService.update(user)
    res.status(200).send(savedUser)
  } catch (err) {
    loggerService.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}
