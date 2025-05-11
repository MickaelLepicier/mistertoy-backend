import { loggerService } from '../services/loggerService.js'

export async function log(req, res, next) {
  loggerService.info('Req was made ', req.route.path)
  next()
}
