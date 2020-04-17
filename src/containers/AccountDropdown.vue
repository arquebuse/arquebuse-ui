<template>
  <CDropdown
      :show.sync="accountMenu"
      add-menu-classes="pt-0"
      class="c-header-nav-items"
      inNav
      placement="bottom-end"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div>
          <strong>{{fullName}}</strong>
        </div>
      </CHeaderNavLink>
      <CModal
          :centered="true"
          :no-close-on-backdrop="true"
          :show.sync="pwdDialog"
          color="dark"
          title="Change password"
      >
        <CForm>
          <CInput
              autocomplete="current_password"
              horizontal
              label="Current"
              placeholder="Current Password"
              type="password"
              v-model="currentPassword"
          >
            <template #prepend-content>
              <CIcon name="cil-lock-locked"/>
            </template>
          </CInput>
          <CInput
              autocomplete="password"
              horizontal
              label="New"
              placeholder="New Password"
              type="password"
              v-model="password"
          >
            <template #prepend-content>
              <CIcon name="cil-lock-locked"/>
            </template>
          </CInput>
          <CInput
              autocomplete="confirm_password"
              horizontal
              label="Confirm"
              placeholder="New Password"
              type="password"
              v-model="confirmPassword"
          >
            <template #prepend-content>
              <CIcon name="cil-lock-locked"/>
            </template>
          </CInput>
          <CAlert color="danger" show v-if="alert">{{ alertMessage }}</CAlert>
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
      <CIcon name="cil-lock-locked"/>
      Change password
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <CIcon name="cil-account-logout"/>
      Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
  import store from '../store'
  import axios from "axios";
  import {AUTH_LOGOUT} from "../store/actions";

  export default {
    name: 'AccountDropdown',
    data() {
      return {
        fullName: 'Unknown !!!',
        pwdDialog: false,
        accountMenu: false,
        currentPassword: '',
        password: '',
        confirmPassword: '',
        alertColor: 'alert',
        alert: false,
        alertMessage: '',
      }
    },
    mounted() {
      this.fullName = store.getters.fullName;
    },
    methods: {
      logout() {
        store.dispatch(AUTH_LOGOUT, 'logout').catch(err => console.log(err));
        this.$router.push('/login').catch(err => console.log(err));
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

        if (this.password !== this.confirmPassword) {
          this.alertMessage = "New passwords are not the same";
          this.alert = true;
          return
        }

        axios({
          method: "PATCH",
          "url": "/users/me",
          "data": {"password": this.currentPassword, "newPassword": this.password},
          "headers": {"content-type": "application/json"}
        }).then(()=> {
          this.closeDialog()
        }).catch(err => {
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