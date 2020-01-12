<template>
  <div class="c-app">
    <TheSidebar/>
    <div class="c-wrapper">
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter/>
    </div>
  </div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheFooter from './TheFooter'
import axios from 'axios'

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
    TheFooter
  },
  mounted: function () {
    window.setInterval(() => {
      if (this.$store.getters.isAuthenticated) {
        axios({method: "GET", "url": "/authentication/check"}).catch( () => console.log('Session has expired'))
      }
    }, 60000)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
