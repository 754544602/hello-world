<template>
  <scroll class="listview" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll" ref="listview"
          :data="data">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" @click="selectItem(item)" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index"
            :class="{current: currentIndex==index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '@/base/scroll/scroll'
  import {getData} from "../../common/js/dom";

  const ANCHOR_HEIGHT = 18
  export default {
    name: "listview",
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        deff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if(this.scrollY>0){
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(item){
        this.$emit('select',item)
      },
      _scrollTo(index) {
        if (!index && index != 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -(this.listHeight[index])
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        if(newY>0){
          this.currentIndex = 0
          return
        }
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (!height2 || (-newY >= height1 && -newY < height2)) {
            this.currentIndex = i
            this.deff = height2 + newY
            return
          }
        }
        this.currentIndex = listHeight.length - 2
      },
      deff(newVal) {
        let topVal = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
        if(this.topVal === topVal){
          return
        }
        this.topVal=topVal
        this.$refs.fixTitle.style.transform = `translate3d(0,${topVal}px,0)`
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview {
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
  }

  .list-group {
    padding-bottom: 30px
  }

  .list-group-title {
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
  }

  .list-group-item {
    display: flex
    align-items: center
    padding: 20px 0 0 30px
  }

  .avatar {
    width: 50px
    height: 50px
    border-radius: 50%
  }

  .name {
    margin-left: 20px
    color: $color-text-l
    font-size: $font-size-medium
  }

  .list-shortcut {
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
  }

  .item {
    padding: 3px
    line-height: 1
    color: $color-text-l
    font-size: $font-size-small
  }

  &.current {
    color: $color-theme

  }

  .list-fixed {
    position: absolute
    top: 0
    left: 0
    width: 100%
  }

  .fixed-title {
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
  }

  .loading-container {
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
  }
</style>
