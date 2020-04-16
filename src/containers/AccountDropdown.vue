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
              title="Change password"
              color="dark"
      >
        <CForm>
          <CInput
                  placeholder="Current Password"
                  label="Current"
                  horizontal
                  type="password"
                  autocomplete="current_password"
                  v-model="currentPassword"
          >
            <template #prepend-content><CIcon name="cil-lock-locked"/></template>
          </CInput>
          <CInput
                  placeholder="New Password"
                  label="New"
                  horizontal
                  type="password"
                  autocomplete="password"
                  v-model="password"
          >
            <template #prepend-content><CIcon name="cil-lock-locked"/></template>
          </CInput>
          <CInput
                  placeholder="New Password"
                  label="Confirm"
                  horizontal
                  type="password"
                  autocomplete="confirm_password"
                  v-model="confirmPassword"
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
          <CButton @click="submit" color="primary">Update</CButton>
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
      fullName:        'Unknown !!!',
      pwdDialog:       false,
      accountMenu:     false,
      currentPassword: '',
      password:        '',
      confirmPassword: '',
      alertColor:      'alert',
      alert:           false,
      alertMessage:    '',
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
      this.currentPassword = '';
      this.password = '';
      this.confirmPassword = '';
    },
    submit() {
      if (this.password.length < 6) {
        this.alertMessage = "Password must be at least 5 characters long";
        this.alert = true;
        return
      }

      if (this.password != this.confirmPassword) {
        this.alertMessage = "New passwords are not the same";
        this.alert = true;
        return
      }

      axios({ method: "PATCH", "url": "/users/me", "data": { "password": this.currentPassword, "newPassword": this.password }, "headers": { "content-type": "application/json" }}).then(resp => {
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
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>