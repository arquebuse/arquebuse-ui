<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div>
          <strong>{{fullName}}</strong>
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownItem>
      <CIcon name="cil-lock-locked" /> Change password
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <CIcon name="cil-account-logout" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import store from '../store'
export default {
  name: 'AccountDropdown',
  data () {
    return {
      fullName: 'Unknown !!!'
    }
  },
  mounted() {
    this.fullName = store.getters.fullName;
  },
  methods: {
    logout() {
      this.$router.push('/logout')
    },
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>