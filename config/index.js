import configProd from './prod.js'
import configDev from './dev.js'

export const config =
  process.env.NODE_ENV === 'production' ? configProd : configDev

// config = configProd
config.isGuestMode = true

