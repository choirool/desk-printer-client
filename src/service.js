import EventEmitter from 'events'
import HTTP from 'http'
import Socket from 'socket.io'
import Printer from './printer.js'
import fs from 'fs'
import path from 'path'

export default class Service extends EventEmitter {
  constructor() {
    super();

    this.printer = new Printer();
    this.http = HTTP.createServer((req, res) => {
      res.end('Recta Print Service');
    });
    this.http.setTimeout(1000);
    this.files = {}

    this.io = new Socket(this.http);
    this.io.use((socket, next) => {
      // const token = socket.handshake.query.token;
      // const appkey = CFG.get('app.key');

      // if (token !== appkey) {
      //   return next(new Error('Not Authorized'));
      // }

      return next();
    });
    this.io.on('connection', (socket) => {
      socket.on('message', (data) => {
        this.emit('message', data);
      });

      socket.on('print', (payload) => {
        this.printer.print(payload)
      })
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.http.listen(8001, () => {
        return resolve();
      }).once('error', error => reject(error));
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.io.close(() => {
        return resolve();
      });
    });
  }
}
