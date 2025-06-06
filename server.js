import http from 'http'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { loggerService } from './services/logger.service.js'
import { fileURLToPath } from 'url'
import { log } from './middlewares/logger.middleware.js'
import { setupSocketAPI } from './services/socket.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

loggerService.info('server.js loaded...')

const app = express()
const server = http.createServer(app)

// TODO - // FIX BUG
// app.use(log)

app.use(express.json())
app.use(cookieParser())
app.set('query parser', 'extended')

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174'
    ],
    credentials: true
  }
  app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'


app.all('*all', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/toy', toyRoutes)

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com");
  next();
});

setupSocketAPI(server)

//* In production with Render
app.get('/api/apikey', (req, res) => {
  res.send(process.env.API_KEY)
})

// Fallback
app.get('/*all', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public'))
})




const port = process.env.PORT || 3030
server.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})

// http://127.0.0.1:3030/
