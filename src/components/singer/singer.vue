<template>
  <div class="singer">
    <ListView :data="singers" @select="selectSinger"></ListView>
    <router-view></router-view>
  </div>

</template>

<script>
  import Singer from '@/common/js/singer'
  import {gerSingerList} from '@/api/singer'
  import {ERR} from '@/api/config'
  import ListView from '@/base/listview/listview'
  import {mapMutations} from 'vuex'

  const HotName = '热门'
  const HotSingerLength = 10
  export default {
    name: "singer",
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();
    },
    methods: {
      selectSinger(singer) {
        this.setSinger(singer)
        this.$router.push({path: `/singer/${singer.mid}`})
      },
      _getSingerList() {
        gerSingerList().then((res) => {
          if (res.code === ERR) {
            this.singers = this._normallizeSinger(res.data.list)
            console.log(this.singers)
          }
        })
      },
      _normallizeSinger(list) {
        let map = {
          hot: {
            title: HotName,
            item: []
          }
        }
        list.forEach((item, index) => {
          if (index < HotSingerLength) {
          }
          map.hot.item.push(new Singer({
            id: item.Fsinger_id,
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_id,
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        //为了得到有序列表，需要处理map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HotName) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%

  .singer-content {
    height: 100%
    overflow: hidden
  }
</style>
