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
                    autocomplete="username email"
                    placeholder="Username"
                    v-model="username"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user"/>
                  </template>
                </CInput>
                <CInput
                    autocomplete="curent-password"
                    placeholder="Password"
                    type="password"
                    v-model="password"
                >
                  <template #prepend-content>
                    <CIcon name="cil-lock-locked"/>
                  </template>
                </CInput>
                <CAlert :color="alertColor" show v-if="alert">{{ alertMessage }}</CAlert>
                <CRow>
                  <CCol col="6">
                    <CButton @click="login" class="px-4" color="dark">Login</CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard
              body-wrapper
              class="text-center py-5 d-md-down-none"
              color="gray-900"
              style="width:44%"
              text-color="white"
          >
            <img alt="Arquebuse logo" class="c-card__image" height="47" src="img/arquebuse-base-white.svg" width="180"/><br/><br/>
            <p>Arquebuse is an email infrastructure testing tool designed to facilitate email flow diagnostic and
              monitoring.</p>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
  import {AUTH_REQUEST} from '../../store/actions';

  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        alert: false,
        alertMessage: '',
        alertColor: ''
      }
    },
    methods: {
      login: function () {
        const {username, password} = this;
        this.$store.dispatch(AUTH_REQUEST, {username, password}).then(() => {
          this.$router.push('/').catch(err => console.log(err));
        }).catch(() => {
          this.alert = true;
          this.alertMessage = 'Username or password is invalid';
          this.alertColor = 'danger';
        });
      }
    },
    mounted() {
      if (this.$store.getters.status === 'DISCONNECTED') {
        this.alert = true;
        this.alertMessage = 'Your session has expired';
        this.alertColor = 'warning';
      }
    },
  }
</script>
