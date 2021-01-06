<template>
  <div>
    <div v-if="config">
      <div>App key: {{ config.app.key }}</div>
      <div>App port: {{ config.app.port }}</div>
      Selected printer: <select v-model="selectedPrinter" @change="printerSelected($event)">
        <option v-for="(printer, i) in printerList" :key="i" :value="JSON.stringify(printer)">
          {{ printer.name }} - {{ printer.status }}
        </option>
      </select>
    </div>
    <div>
      <button @click="testPrinter">Tes printer</button>
      <button @click="start" v-if="!isStart">Start</button>
      <button @click="stop" v-else>Stop</button>
    </div>
  </div>
</template>

<script>
import Printer from "../printer.js";
import Service from "../service.js";
import { CFG } from "../config.js";

export default {
  data() {
    return {
      config: null,
      printer: null,
      printerList: null,
      selectedPrinter: null,
      service: null,
      isStart: false,
    };
  },
  created() {
    this.printer = new Printer();
    this.printerList = this.printer.getPrinters();
    this.config = CFG.get();
    this.selectedPrinter = JSON.stringify(this.config.printer)
    this.start()
  },
  methods: {
    testPrinter() {
      this.printer.print({
        content: 'lorem',
        type: 'TEXT',
      });
    },
    start() {
      try {
        this.service = new Service();
        this.service.on("open", () => {
          this.log("Service Started");
        });
        this.service.start();
        this.isStart = true;
      } catch (e) {
        console.log(e);
      }
    },
    stop() {
      try {
        this.service.stop();
        this.isStart = false;
      } catch (e) {
        this.log(e);
      }
    },
    printerSelected(e) {
      CFG.set('printer', JSON.parse(e.target.value));
    }
  },
};
</script>