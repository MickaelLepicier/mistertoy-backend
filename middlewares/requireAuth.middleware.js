import { loggerService } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'

export async function requireAuth(req, res, next) {
  if (!req?.cookies?.loginToken) {
    return res.status(401).send('Not Authenticated')
  }

  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Not Authenticated')

  // add isGuestMode to use the functionality even if you'r not login - for people to check the app
  /*
    if(config.isGuestMode && !loggedinUser){
    req.loggedinUser = {_id: '', fullname: 'Guest'}
    return next()
    }
  */

  req.loggedinUser = loggedinUser
  next()
}

export async function requireAdmin(req, res, next) {
  if (!req?.cookies?.loginToken) {
    return res.status(401).send('Not Authenticated')
  }

  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser.isAdmin) {
    loggerService.warn(
      loggedinUser.fullname + ' attempted to perform admin action'
    )
    res.status(403).end('Not Authorized')
    return
  }
  next()
}
