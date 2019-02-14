window.Vue = require("vue");
window.$ = require("jquery");
window.ds = require("dualshock");

import VModal from "vue-js-modal";
Vue.use(VModal);

Vue.component("applist", require("./components/AppList.vue"));

window.Event = new Vue({});

const app = new Vue({
  el: "#app",
  data() {
    return {
      deviceList: [],
      device: {},
      gamepad: {}
    };
  },
  mounted() {
    setInterval(this.checkForControllers, 500);
  },
  watch: {
    deviceList: function(val, old) {
      if (old.length != val.length && val.length < 2) {
        this.handleControllerConnectionChange();
      }
    }
  },
  methods: {
    checkForControllers() {
      this.deviceList = ds.getDevices();
    },
    controllerConnectionLost() {
      this.$modal.show("nocontroller");
    },
    handleControllerConnectionChange() {
      this.device = this.deviceList.length > 0 ? this.deviceList[0] : [];
      this.deviceList.length == 0
        ? this.controllerConnectionLost()
        : this.setUpController();
    },
    setUpController() {
      this.$modal.hide("nocontroller");
      this.gamepad = ds.open(this.device, {
        smoothAnalog: 10,
        smoothMotion: 15,
        joyDeadband: 4,
        moveDeadband: 4
      });

      this.gamepad.setLed(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      );

      this.gamepad.ondigital = function(button, value) {
        if (button && value) {
          switch (button) {
            case "right":
              Event.$emit("right-pressed");
              break;
            case "left":
              Event.$emit("left-pressed");
              break;
            case "a":
              Event.$emit("a-pressed");
              break;
          }
        }
      };
    }
  }
});
