<template>
    <div>
        <modal name="nocontroller" width="500" height="130">
            <div class="loading-modal">
                <i class="fas fa-gamepad"></i>
                <span>No controller detected...</span>
            </div>
        </modal>
        <modal name="loading" width="500" height="130">
            <div class="loading-modal">
                <i class="fas fa-spin fa-cog"></i>
                <span>Opening {{ selectedApplication.name }} ...</span>
            </div>
        </modal>
        <img class="bg-image" v-if="selectedApplication.slug" :src="'images/' + selectedApplication.slug + '/' + selectedApplication.background" alt="">
        <ul class="apps-wrapper">
            <li v-for="(application,index) in applications" :key="index" class="app-wrapper">
                <span class="app-item" :style="'background-color:' + application.banner_color + ';'">
                    <img :src="'images/' + application.slug + '/' + application.logo" alt="">
                </span>
            </li>
        </ul>
    </div>
</template>
<script>

export default {
    data(){
        return {
            position: 0,
            selectedApplication: {},
            applications: []
        }
    },
    mounted(){

        this.loadConfig();

        Event.$on('right-pressed', () => {
            (this.position < this.applications.length-1) ? this.position++ : this.position = 0;
            this.moveCursor();
        })

        Event.$on('left-pressed', () => {
            (this.position > 0) ? this.position-- : this.position = this.applications.length-1;
            this.moveCursor();
        })

        Event.$on('a-pressed', () => {
            this.$modal.show('loading');
            let that = this;
            setTimeout(function(){
                that.confirmButton();
            },500)
            
        })
    },
    methods: {
        loadConfig(){
            let that = this;
            $.getJSON("./config.json",function(data){
                 that.applications = data[0].applications;
             }).then( () => {
                 that.selectedApplication = that.applications[0];
                 $('.app-wrapper').eq(0).addClass('is-selected');
             });
             
        },
        moveCursor(){
            this.selectedApplication = this.applications[this.position];
            $('.app-wrapper.is-selected').removeClass('is-selected');
            $('.app-wrapper').eq(this.position).addClass('is-selected');
            
        },
        confirmButton(){
            let that = this;
            var executablePath = this.selectedApplication.path;
            var child = (executablePath.substring(0,2) == "C:") ? require('child_process').execFile : require('child_process').exec;
            
            child(executablePath, function(err, data) {
                if(err){
                    console.error(err);
                return;
                }else{
                    that.$modal.hide('loading')
                }
            });
        }
    }
}
</script>
<style>
    body{
        margin:0;
    }

    ul{
        margin:0;
        padding:0;
    }

    li{
        list-style: none;
    }

    .is-selected{
        opacity:1!important;
        transition:left .5s ease-out, opacity .1s linear;
        left:0!important;
    }

    .apps-wrapper{
        height: 100vh;
        width: 100%;
        overflow: hidden;
        overflow-y: hidden;
        background-size: cover;
    }

    .app-wrapper{
        opacity:0;
        transition:left .5s ease-out, opacity .1s linear;
        width: 50vw;
        height: 80vh;
        display:flex;
        justify-content: center;
        align-items:center;
        position:absolute;
        left:-50%;
    }

    .app-item{
        display: flex;
        justify-content: center;
        align-items: center;
        width:100vw;
        background-color: #ffffffad;
        padding: 50px 0;
        border-top-right-radius: 125px;
        border-bottom-right-radius: 125px;
    }

    .bg-image{
        position:absolute;
        left:0;
        top:0;
        overflow:hidden;
        display:flex;
        width: 100vw;
        height: 100vh;
        z-index:-1;
        width:100%;
    }

    .app-item img{
        width:50%;
        z-index:9999;
    }
</style>
