<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import {mapState} from 'vuex'
  import {getSingerDetail} from "../../api/singer";
  import {ERR} from "../../api/config";
  import Scroll from '@/base/scroll/scroll'
  import {createSong} from "../../common/js/song"
  import MusicList from "@/components/music-list/music-list"

  export default {
    name: "singerDetail",
    data() {
      return {
        songs:[]
      }
    },
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapState([
        'singer'
      ])
    },
    created() {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail() {
        if (!this.singer) {
          this.$router.push({path: '/singer'})
          return
        }
        getSingerDetail(this.singer.mid).then((res) => {
          if (res.code === ERR) {
            this.songs = this._normalsizeSongs(res.data.list)
          }
          console.log(this.songs)
        })
      },
  _normalsizeSongs(list){
        let ret = []
        list.forEach((item)=>{
          let {musicData} = item
          if(musicData.songid && musicData.albumid){
            ret.push(createSong(musicData))
          }
        })
    return ret
  }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active {
    -webkit-transition: .3s
    -moz-transition: .3s
    -ms-transition: .3s
    -o-transition: .3s
    transition: .3s
  }

  .slide-enter, .slide-leave-to {
    transform translate3d(100%, 0, 0)
  }
</style>
