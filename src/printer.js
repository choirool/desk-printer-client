import printer from '@thiagoelg/node-printer'
import fs from 'fs'
import path from 'path'
import { CFG } from './config.js'

let selectedPrinter = CFG.get('printer')
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
    selectedPrinter = CFG.get('printer')
    if (payload) {
      if (payload.type.toUpperCase() == 'TEXT') {
        this.printRawText(payload.content)
      }

      if (payload.type.toUpperCase() == 'PDF') {
        this.printPDF(payload.content)
      }

      if (payload.type.toUpperCase() == 'TXT') {
        this.printTxtFile(payload.content)
      }
    }
  }

  printFile(base64Data, ext) {
    const fileName = Math.random().toString(36).substring(2, 15)
    let filePath = path.join(__dirname, `Temp/${fileName}.${ext}`)

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        console.log(filePath, "\n\n\n\n\n Can not write to above file:\n\n", err);
      } else {
        printer.printFile({
          filename: filePath,
          // printer: process.env[3], // printer name, if missing then will print to default printer
          printer: selectedPrinter.name, // printer name, if missing then will print to default printer
          success: jobID => {
            console.log("sent to printer with ID: " + jobID);
            fs.unlink(filePath, (err) => console.log(err))
          },
          error: err => {
            console.log(err)
          }
        })
      }
    })
  }

  printPDF(content) {
    const base64Data = content.replace(/^data:application\/pdf;base64,/, '')
    this.printFile(base64Data, 'pdf')
  }

  printTxtFile(content) {
    const base64Data = content.replace(/^data:text\/plain;base64,/, '')
    this.printFile(base64Data, 'txt')
  }

  printRawText(content) {
    printer.printDirect({
      data: content,
      printer: selectedPrinter.name,
      type: 'TEXT',
      success: function (jobID) {
        console.log("sent to printer with ID: " + jobID);
      },
      error: function (err) { console.log(err); }
    });
  }
}