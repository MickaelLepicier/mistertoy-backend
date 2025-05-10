import { loggerService } from '../services/loggerService'

export async function log(req, res, next) {
  loggerService.info('Req was made ', req.route.path)
  next()
}
