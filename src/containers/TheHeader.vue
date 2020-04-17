<template>
  <CHeader fixed light>
    <CHeaderNav class="d-md-down-none mr-auto"/>
    <CHeaderNav class="mr-4">
      <AccountDropdown/>
    </CHeaderNav>
  </CHeader>
</template>

<script>
  import AccountDropdown from './AccountDropdown'

  export default {
    name: 'TheHeader',
    components: {
      AccountDropdown
    }
  }
</script>
