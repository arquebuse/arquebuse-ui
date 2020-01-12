<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show.sync="show"
  >
    <CSidebarBrand 
      :imgFull="{ width: 140, height: 28, alt: 'Arquebuse logo', src: 'img/brand/arquebuse.png'}"
      :imgMinimized="{ width: 14, height: 3, alt: 'Arquebuse logo', src: 'img/brand/arquebuse.png'}"
      :wrappedInLink="{ href: 'https://github.com/arquebuse/arquebuse/', target: '_blank'}"
    />
    <CRenderFunction flat :content-to-render="nav"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="minimize = !minimize"
    />
  </CSidebar>
</template>

<script>
import nav from './_nav'

export default {
  name: 'TheSidebar',
  data () {
    return {
      minimize: false,
      nav,
      show: 'responsive'
    }
  },
  mounted () {
    this.$root.$on('toggle-sidebar', () => {
      const sidebarOpened = this.show === true || this.show === 'responsive'
      this.show = sidebarOpened ? false : 'responsive'
    })
    this.$root.$on('toggle-sidebar-mobile', () => {
      const sidebarClosed = this.show === 'responsive' || this.show === false
      this.show = sidebarClosed ? true : 'responsive'
    })
  }
}
</script>
