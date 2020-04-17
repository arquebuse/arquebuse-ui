<template>
  <div class="c-app">
    <TheSidebar/>
    <div class="c-wrapper">
      <TheHeader/>
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
  import TheHeader from './TheHeader'
  import TheFooter from './TheFooter'
  import axios from 'axios'

  export default {
    name: 'TheContainer',
    components: {
      TheSidebar,
      TheHeader,
      TheFooter
    },
    mounted: function () {
      window.setInterval(() => {
        if (this.$store.getters.isAuthenticated) {
          axios({method: "GET", "url": "/authentication/check"}).catch(() => console.log('Session has expired'))
        }
      }, 60000)
    }
  }
</script>

<style scoped>
  .fade-enter-active{
    transition: opacity 1s;
  }
  .fade-leave-active {
    transition: opacity 0s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
