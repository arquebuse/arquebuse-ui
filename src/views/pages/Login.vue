<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="justify-content-center">
      <CCol md="8">
        <CCardGroup>
          <CCard class="p-4">
            <CCardBody>
              <CForm>
                <h2>Login</h2>
                <CInput
                  placeholder="Username"
                  autocomplete="username email"
                  v-model="username"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="curent-password"
                  v-model="password"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CAlert v-if="alert" show :color="alertColor">{{ alertMessage }}</CAlert>
                <CRow>
                  <CCol col="6">
                    <CButton color="primary" class="px-4" @click="login" >Login</CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard
            color="primary"
            text-color="white"
            class="text-center py-5 d-md-down-none"
            style="width:44%"
            body-wrapper
          >
            <h2>Arquebuse</h2>
            <p>Arquebuse is an email infrastructure testing tool designed to facilitate email flow diagnostic and monitoring.</p>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
  import {AUTH_REQUEST} from '../../store/actions/auth'
  export default {
    name: 'Login',
    data(){
      return {
        username     : '',
        password     : '',
        alert        : false,
        alertMessage : '',
        alertColor   : ''
      }
    },
    methods: {
      login: function () {
        const { username, password } = this;
        this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
          this.$router.push('/');
        }).catch( () => {
          this.alert        = true;
          this.alertMessage = 'Username or password is invalid'
          this.alertColor   = 'danger'
        });
      }
    },
    mounted() {
      if (this.$store.getters.status === 'DISCONNECTED') {
        this.alert        = true;
        this.alertMessage = 'Your session has expired'
        this.alertColor   = 'warning'
      }
    },
  }
</script>
