<template>
  <div>
    <modal name="nocontroller" width="500" height="130">
      <div class="info-modal">
        <i class="fas fa-gamepad"></i>
        <span>No controller detected...</span>
      </div>
    </modal>
    <modal name="launching" width="500" height="130">
      <div class="info-modal">
        <i class="fas fa-spin fa-cog"></i>
        <span>Launching {{ selectedApplication.name }} ...</span>
      </div>
    </modal>
    <img
      class="bg-image"
      v-if="selectedApplication.slug"
      :src="'images/' + selectedApplication.slug + '/' + selectedApplication.background"
      alt
    >
    <ul class="apps-wrapper">
      <li v-for="(application,index) in applications" :key="index" class="app-wrapper">
        <span class="app-item" :style="'background-color:' + application.banner_color + ';'">
          <img :src="'images/' + application.slug + '/' + application.logo" alt>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
const { remote } = require("electron");
export default {
  data() {
    return {
      position: 0,
      selectedApplication: {},
      applications: [],
      animating: false,
      launching: false
    };
  },
  mounted() {
    this.loadConfig();
    this.handleGamepadEvents();
  },
  methods: {
    loadConfig() {
      let that = this;
      $.getJSON("./config.json", function(data) {
        that.applications = data[0].applications;
      }).then(() => {
        that.selectedApplication = that.applications[0];
        $(".app-wrapper")
          .eq(0)
          .addClass("is-selected");
      });
    },
    handleGamepadEvents() {
      Event.$on("right-pressed", () => {
        if (!this.animating && !this.launching) {
          this.animating = true;
          this.position < this.applications.length - 1
            ? this.position++
            : (this.position = 0);
          this.moveCursor();
        }
      });

      Event.$on("left-pressed", () => {
        if (!this.animating && !this.launching) {
          this.animating = true;
          this.position > 0
            ? this.position--
            : (this.position = this.applications.length - 1);
          this.moveCursor();
        }
      });

      Event.$on("a-pressed", () => {
        if (!this.animating && !this.launching) {
          this.$modal.show("launching");
          that.LaunchApp();
        }
      });
    },
    moveCursor() {
      this.selectedApplication = this.applications[this.position];
      $(".app-wrapper.is-selected").removeClass("is-selected");
      $(".app-wrapper")
        .eq(this.position)
        .addClass("is-selected");
      setTimeout(() => {
        this.animating = false;
      }, 200);
    },
    LaunchApp() {
      if (!this.launching) {
        this.launching = true;
        let that = this;
        var executablePath = this.selectedApplication.path;
        var child =
          executablePath.substring(0, 2) == "C:"
            ? require("child_process").execFile
            : require("child_process").exec;

        child(executablePath, function(err, data) {}).on("close", () => {
          that.appShutdown();
        });
      }
    },
    appShutdown() {
      this.$modal.hide("launching");
      this.launching = false;
      remote.getCurrentWindow().focus();
    }
  }
};
</script>
<style>
body {
  margin: 0;
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

.is-selected {
  opacity: 1 !important;
  transition: left 0.5s ease-out, opacity 0.1s linear;
  left: 0 !important;
}

.apps-wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  overflow-y: hidden;
  background-size: cover;
}

.app-wrapper {
  opacity: 0;
  transition: left 0.5s ease-out, opacity 0.1s linear;
  width: 50vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: -50%;
}

.app-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  background-color: #ffffffad;
  padding: 40px 0;
  border-top-right-radius: 125px;
  border-bottom-right-radius: 125px;
}

.bg-image {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  width: 100%;
}

.app-item img {
  width: 50%;
  z-index: 9999;
  margin-left: -30px;
}
</style>
