import Store from 'electron-store'
import * as randomstring from 'randomstring'
// import { version } from '../../package.json'

export const CFG = new Store({
  name : 'recta',
  defaults: {
    printer: null,
    app: {
      port: 1811,
      key: randomstring.generate({
        length: 12,
        charset: 'alphabetic'
      }),
    },
  },
})