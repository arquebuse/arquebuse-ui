<template>
  <CSidebar
      :minimize="minimize"
      :show.sync="show"
      fixed
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon
          :height="35"
          class="c-sidebar-brand-full"
          name="logo"
          size="custom-size"
          viewBox="0 0 253 67"
      />
      <CIcon
          :height="35"
          class="c-sidebar-brand-minimized"
          name="logo"
          size="custom-size"
          viewBox="0 0 60 67"
      />
    </CSidebarBrand>
    <CRenderFunction :content-to-render="nav" flat/>
    <CSidebarMinimizer
        @click.native="minimize = !minimize"
        class="d-md-down-none"
    />
  </CSidebar>
</template>

<script>
  import nav from './_nav'

  export default {
    name: 'TheSidebar',
    data() {
      return {
        minimize: false,
        nav,
        show: 'responsive'
      }
    },
    mounted() {
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
