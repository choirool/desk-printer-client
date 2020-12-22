<template>
  <div>
    <div>
      <select v-model="printer">
        <option v-for="(printer, i) in printers" :key="i" :value="printer">
          {{ printer.name }} - {{ printer.status }}
        </option>
      </select>
    </div>
    <div>
      <button @click="printFile">Print file</button>
      <button @click="start" v-if="!isStart">Start</button>
      <button @click="stop" v-else>Stop</button>
    </div>
  </div>
</template>

<script>
import Printer from "../printer.js";
import Service from "../service.js";

export default {
  data() {
    return {
      printer: null,
      printers: null,
      service: null,
      isStart: false,
    };
  },
  created() {
    this.printer = new Printer();
    this.printers = this.printer.getPrinters();
  },
  methods: {
    printFile() {
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
    }
  },
};
</script>