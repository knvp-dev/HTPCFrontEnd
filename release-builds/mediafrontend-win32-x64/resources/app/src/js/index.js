window.Vue = require('vue');
window.$ = require('jquery');
window.ds = require('dualshock');

import VModal from 'vue-js-modal'
Vue.use(VModal)

window.Event = new Vue({});
Vue.component('applist', require('./components/AppList.vue'));

const app = new Vue({
    el: '#app',
    data(){
        return {
            deviceList: [],
            device: {},
            gamepad: {}
        }
    },
    mounted(){
        setInterval(this.initController, 500);
    },
    methods: {
        initController(){
            this.deviceList = ds.getDevices();
            this.device = this.deviceList[0];
            (this.deviceList.length == 0) ? this.scanForController() : this.mapControllerEvents();
        },
        scanForController(){
            this.$modal.show('nocontroller')
        },
        mapControllerEvents(){
            this.$modal.hide('nocontroller')
            this.gamepad = ds.open(this.device, {smoothAnalog:10, smoothMotion:15, joyDeadband:4, moveDeadband:4});
            this.gamepad.ondigital = function(button, value) {
                if(button && value){
                    switch(button){
                        case "right":
                            Event.$emit('right-pressed');
                            break;
                        case "left":
                            Event.$emit('left-pressed');
                            break;
                        case "a":
                            Event.$emit('a-pressed');
                            break;
                    }
                }
            }
        }
    }
})
        
            