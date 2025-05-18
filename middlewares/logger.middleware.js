import { loggerService } from '../services/logger.service.js'

// Middlewares to log and debug if needed

export async function log(req, res, next) {
  loggerService.info('Req was made ', req.route.path)
  next()
}
