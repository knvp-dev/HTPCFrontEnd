<template>
  <div class="info-overlay">
    <div class="clock">
      <span class="clock-digits">{{ hours }}:</span>
      <span class="clock-digits">{{ minutes }}</span>
      <small class="clock-digits">{{ seconds }}</small>
    </div>
    <div class="controllerIndicators">
      <i class="fas fa-gamepad" v-for=" (controller, index) in deviceList" :key="index"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: ["deviceList"],
  data() {
    return {
      hours: "",
      minutes: "",
      seconds: ""
    };
  },
  mounted() {
    this.renderTime();
  },
  methods: {
    renderTime() {
      let that = this;
      setInterval(function() {
        let date = new Date();
        that.hours = that.zeroPadding(date.getHours(), 2);
        that.minutes = that.zeroPadding(date.getMinutes(), 2);
        that.seconds = that.zeroPadding(date.getSeconds(), 2);
      }, 1000);
    },
    zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    }
  }
};
</script>
<style>
.info-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.clock {
  position: absolute;
  top: 20px;
  right: 40px;
  color: white;
}

.clock-digits {
  font-size: 3vw;
  min-width: 30px;
  display: inline-block;
}

small {
  font-size: 1.6vw !important;
}

.controllerIndicators {
  position: absolute;
  bottom: 10px;
  right: 20px;
  color: white;
  font-size: 4vw;
}
</style>
