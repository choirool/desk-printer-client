import printer from '@thiagoelg/node-printer'
import fs from 'fs'
import path from 'path'

export default class Printer {
  constructor(options = {}) {
    this.printer = printer
    this.files = {}
  }

  getPrinters() {
    return this.printer.getPrinters()
  }

  getDefaultPrinter() {
    return this.printer.getDefaultPrinterName()
  }

  print(payload = null) {
    if (payload) {
      let content;
      if (payload.type.toUpperCase() == 'TEXT') {
        content = payload.content
        printer.printDirect({
          data: content,
          printer: null,
          type: payload.type.toUpperCase(),
          success: function (jobID) {
            console.log("sent to printer with ID: " + jobID);
          },
          error: function (err) { console.log(err); }
        });
      }

      if (payload.type.toUpperCase() == 'PDF') {
        const fileName = Math.random().toString(36).substring(2, 15)
        let filePath = path.join(__dirname, `Temp/${fileName}.pdf`)
        const buffer = Buffer.from(payload.content.buffer)
        const permission = 438
        let fileDescriptor

        try {
          fileDescriptor = fs.openSync(filePath, 'w', permission)
        } catch (e) {
          fs.chmodSync(filePath, permission);
          fileDescriptor = fs.openSync(filePath, 'w', permission)
        }

        if (fileDescriptor) {
          fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0)
          fs.closeSync(fileDescriptor)

          setTimeout(() => {
            printer.printFile({
              // filename: path.join(__dirname, `Temp/test.pdf`),
              filename: filePath,
              printer: process.env[3], // printer name, if missing then will print to default printer
              success: jobID => {
                console.log("sent to printer with ID: " + jobID);
                fs.unlink(filePath, (err) => console.log(err))
              },
              error: err => {
                console.log(err);
              }
            });
          }, 1000);
        }
      }
    }
  }
}