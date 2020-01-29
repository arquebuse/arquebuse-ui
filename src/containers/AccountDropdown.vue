<template>
  <CDropdown
    :show.sync="accountMenu"
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
      <CModal
              :show.sync="pwdDialog"
              :no-close-on-backdrop="true"
              :centered="true"
              title="Modal title 2"
              color="primary"
      >
        <CForm>
          <CInput
                  placeholder="Current Password"
                  type="password"
                  autocomplete="password"
                  v-model="password"
          >
            <template #prepend-content><CIcon name="cil-lock-locked"/></template>
          </CInput>
          <CInput
                  placeholder="New Password"
                  type="password"
                  autocomplete="new-password"
                  v-model="newPassword"
                  invalid-feedback="Please provide at least 6 characters"
                  :is-valid="validateNewPass"
          >
            <template #prepend-content><CIcon name="cil-lock-locked"/></template>
          </CInput>
          <CInput
                  placeholder="Current Password"
                  type="password"
                  autocomplete="new-password"
                  v-model="newPassword2"
                  invalid-feedback="Please enter the same password 2 times"
                  :is-valid="validateNewPass2"
          >
            <template #prepend-content><CIcon name="cil-lock-locked"/></template>
          </CInput>
          <CAlert v-if="alert" show color="danger">{{ alertMessage }}</CAlert>
        </CForm>
        <template #header>
          <h6 class="modal-title">Change password</h6>
          <CButtonClose @click="closeDialog" class="text-white"/>
        </template>
        <template #footer>
          <CButton @click="closeDialog" color="secondary">Cancel</CButton>
          <CButton @click="submit" color="secondary">Submit</CButton>
        </template>
      </CModal>
    </template>
    <CDropdownItem @click="changePass">
      <CIcon name="cil-lock-locked" /> Change password
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <CIcon name="cil-account-logout" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import store from '../store'
import axios from "axios";
export default {
  name: 'AccountDropdown',
  data () {
    return {
      fullName:     'Unknown !!!',
      pwdDialog:    false,
      accountMenu:  false,
      password:     '',
      newPassword:  '',
      newPassword2: '',
      alertColor:   'alert',
      alert:        false,
      alertMessage: '',
    }
  },
  mounted() {
    this.fullName = store.getters.fullName;
  },
  methods: {
    logout() {
      this.$router.push('/logout')
    },
    changePass() {
      this.pwdDialog = true;
      this.accountMenu = false;
    },
    closeDialog() {
      this.pwdDialog = false;
      this.password = '';
      this.newPassword = '';
      this.newPassword2 = '';
    },
    submit() {
      axios({ method: "PATCH", "url": "/users/me", "data": { "password": this.password, "newPassword": this.newPassword }, "headers": { "content-type": "application/json" }}).then(resp => {
        this.closeDialog()
      })
      .catch(err => {
        console.log(err);
        if (err.toString().indexOf('400') !== -1) {
          this.alertMessage = "Bad current password"
        } else {
          this.alertMessage = "Failed to update password"
        }

        this.alert = true;
      })
    },
    validateNewPass() {
      return (this.newPassword.length > 5)
    },
    validateNewPass2() {
      return (this.newPassword === this.newPassword2)
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>