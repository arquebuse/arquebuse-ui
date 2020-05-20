<template>
  <div class="wrapper">
    <CRow>
      <CCol col="12" xl="12">
        <transition name="fade">
          <CCard>
            <CCardHeader>
              <H2>Users
                <div class="card-header-actions">
                  <CButton @click="newUser" color="secondary">
                    <CIcon name="cil-plus"/>
                    New user
                  </CButton>
                </div>
              </H2>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                  :fields="fields"
                  :items="items"
                  :items-per-page="perPage"
                  :pagination="$options['paginationProps']"
                  hover
                  index-column
                  sorter
              >
                <template #roles="data">
                  <td>
                    <span v-for="role in data.item.roles">
                      &nbsp;<CBadge color="secondary">
                      {{capitalize(role)}}
                    </CBadge>
                    </span>
                  </td>
                </template>

                <template #authentication="data">
                  <td>
                    &nbsp;<CBadge color="secondary">
                      {{data.item['authentication']}}
                    </CBadge>
                  </td>
                </template>

                <template #action="data">
                  <td>
                    <template v-if="data.item.username !== currentUsername">
                      <a @click="editUser(data.item)" href="#">
                        <CIcon height="15" name="cil-pencil"/>
                      </a>
                      &nbsp
                      <a @click="deleteUser(data.item)" href="#">
                        <CIcon height="15" name="cil-trash"/>
                      </a>
                    </template>
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <CButton @click="newUser" color="secondary">
                <CIcon name="cil-plus"/>
                New user
              </CButton>
            </CCardFooter>
          </CCard>
        </transition>
      </CCol>
    </CRow>

    <CModal
        :show.sync="showDeleteDialog"
        color="danger"
        title="Delete User"
    >
      Are you sure you want to delete user '{{this.username}}' ?
      <template v-for="message in alertList">
        <CAlert color="danger" show>{{ message }}</CAlert>
      </template>
      <template #footer>
        <CButton @click="closeDelete" color="secondary">Cancel</CButton>
        <CButton @click="submitDelete" color="primary">Delete</CButton>
      </template>
    </CModal>

    <CModal
        :no-close-on-backdrop="true"
        :show.sync="showEditDialog"
        color="dark"
        title="Edit User"
    >
      <CForm>
        <CInput
            autocomplete="username"
            horizontal
            label="Username"
            placeholder="Username"
            readonly
            v-model="username"
        />
        <CInput
            autocomplete="full_name"
            horizontal
            label="Full name"
            placeholder="Full name"
            v-model="fullName"
        />
        <div class="form-row">
          <CCol class="col-form-label" sm="3" tag="label">
            Authentication
          </CCol>
          <CCol sm="9">
            <CSelect
                @change="switchAuthentication()"
                :value.sync="authentication"
                :options="['Password', 'API-Key']"
            />
          </CCol>
        </div>
        <CInput
            @change="passwordUpdated = true"
            v-if="showPassword"
            autocomplete="password"
            horizontal
            label="Password"
            placeholder="Enter a password"
            type="password"
            v-model="password"
        />
        <div class="form-group form-row" v-if="showApiKeyMessage">
          <CCol class="col-form-label" sm="3" tag="label">
            API-Key
          </CCol>
          <CCol sm="9" @click="switchGenerateApiKey()">
            {{apiKeyMessage}}
          </CCol>
        </div>
        <div class="form-group form-row">
          <CCol class="col-form-label" sm="3" tag="label">
            Roles
          </CCol>
          <CCol sm="9">
            <template v-for="name in roleList">
              <input :id="`edit-${name}`" :value="name" type="checkbox" v-model="selectedRoles"> <label :for="name"
                                                                                                        style="margin-bottom: 0;">{{capitalize(name)}}</label><br/>
            </template>
          </CCol>
        </div>
        <template v-for="message in alertList">
          <CAlert color="danger" show>{{ message }}</CAlert>
        </template>
      </CForm>
      <template #header>
        <h6 class="modal-title">Edit user '{{ username }}'</h6>
        <CButtonClose @click="closeEdit" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="closeEdit" color="secondary">Cancel</CButton>
        <CButton @click="submitEdit" color="primary">Update</CButton>
      </template>
    </CModal>

    <CModal
        :no-close-on-backdrop="true"
        :show.sync="showNewDialog"
        color="dark"
        title="Edit User"
    >
      <CForm>
        <CInput
            autocomplete="username"
            horizontal
            label="Username"
            placeholder="Username"
            v-model="username"
        />
        <CInput
            autocomplete="full_name"
            horizontal
            label="Full name"
            placeholder="Full name"
            v-model="fullName"
        />
        <div class="form-row">
          <CCol class="col-form-label" sm="3" tag="label">
            Authentication
          </CCol>
          <CCol sm="9">
            <CSelect
                @change="switchAuthentication()"
                :value.sync="authentication"
                :options="['Password', 'API-Key']"
            />
          </CCol>
        </div>
        <CInput
            v-if="showPassword"
            horizontal
            label="Password"
            placeholder="Enter a password"
            type="password"
            v-model="password"
        />
        <div class="form-group form-row" v-if="showApiKeyMessage">
          <CCol class="col-form-label" sm="3" tag="label">
            API-Key
          </CCol>
          <CCol sm="9">
            {{apiKeyMessage}}
          </CCol>
        </div>
        <div class="form-group form-row">
          <CCol class="col-form-label" sm="3" tag="label">
            Roles
          </CCol>
          <CCol sm="9">
            <template v-for="name in roleList">
              <input :id="`new-${name}`" :value="name" type="checkbox" v-model="selectedRoles"> <label :for="name"
                                                                                                       style="margin-bottom: 0;">{{capitalize(name)}}</label><br/>
            </template>
          </CCol>
        </div>
        <template v-for="message in alertList">
          <CAlert color="danger" show>{{ message }}</CAlert>
        </template>
      </CForm>
      <template #header>
        <h6 class="modal-title">New user</h6>
        <CButtonClose @click="closeNew" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="closeNew" color="secondary">Cancel</CButton>
        <CButton @click="submitNew" color="primary">Create</CButton>
      </template>
    </CModal>

    <CModal
        :show.sync="showApiKeyDialog"
        :no-close-on-backdrop="true"
        title="API-Key"
        color="dark"
    >
      <div align="center">
      <h5>This is the only time this key will be displayed !</h5>
      <CAlert show color="danger"><b>{{apiKey}}</b></CAlert>
      Please keep this API-Key in a safe place. If you loose it, you'll need to generate a new one.
      </div>
      <template #header>
        <h6 class="modal-title">User's API-Key</h6>
        <CButtonClose @click="closeApiKey()" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="closeApiKey()" color="primary">OK</CButton>
      </template>
    </CModal>

  </div>
</template>

<script>
  import axios from 'axios';
  import {freeSet} from '@coreui/icons';
  import {AUTH_RENEW} from "../../store/actions";

  export default {
    name: 'Users',
    freeSet,
    data: () => {
      return {
        items: [],
        fields: [
          {key: 'username', label: 'Username'},
          {key: 'fullName', label: 'Full name'},
          {key: 'authentication', label: 'Authentication'},
          {key: 'roles', label: 'Roles'},
          {key: 'action', label: '', filter: false, sorter: false},
        ],
        perPage: 10,
        showDeleteDialog: false,
        showEditDialog: false,
        showNewDialog: false,
        showApiKeyDialog: false,
        showPassword: true,
        showApiKeyMessage: false,
        generateApiKey: false,
        passwordUpdated: false,
        apiKeyMessage: '',
        currentUsername: '',
        authentication: 'Password',
        currentAuthentication: 'Password',
        username: '',
        fullName: '',
        password: '',
        apiKey: '',
        roleList: ['admin', 'reader', 'monitor', 'operator', 'sender'],
        selectedRoles: [],
        alertList: [],
      }
    },
    paginationProps: {
      align: 'center',
      doubleArrows: false,
      previousButtonHtml: 'prev',
      nextButtonHtml: 'next'
    },
    mounted() {
      this.refreshUserList();
      this.currentUsername = this.$store.getters.username;
    },
    methods: {
      refreshUserList() {
        axios({method: "GET", "url": "/users"}).then(result => {
          this.items = result.data;
        }).catch(() => {
          console.error("Unable to fetch users list");
        });
      },
      capitalize(s) {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
      },
      checkUser() {
        this.alertList = [];
        let isValid = true;
        const usernameRe = /^[A-Za-z0-9\-_]+$/g;
        const fullNameRe = /^[A-Za-z0-9\-_ ]+$/g;
        const uppercaseRe = /[A-Z]/g
        const lowercaseRe = /[a-z]/g
        const digitRe = /[0-9]/g
        const specialRe = /[^A-Za-z0-9]/g
        if (this.username === '') {
          this.alertList.push('Username cannot be empty');
          isValid = false;
        } else if (!usernameRe.test(this.username)) {
          this.alertList.push('Username can only contain alphanumeric characters, dashes and underscores');
          isValid = false;
        }

        if (this.fullName === '') {
          this.alertList.push('Full name cannot be empty');
          isValid = false;
        } else if (!fullNameRe.test(this.fullName)) {
          this.alertList.push('Full name can only contain alphanumeric characters, spaces, dashes and underscores');
          isValid = false;
        }

        if (this.passwordUpdated && this.authentication === "Password") {
          if (this.password.length < 6) {
            this.alertList.push('Password must be at least 6 characters');
            isValid = false;
          }
          let charTypeCount = 0;
          if (uppercaseRe.test(this.password)) { charTypeCount++; }
          if (lowercaseRe.test(this.password)) { charTypeCount++; }
          if (digitRe.test(this.password)) { charTypeCount++; }
          if (specialRe.test(this.password)) { charTypeCount++; }
          if (charTypeCount < 3) {
            this.alertList.push('Password must contains at least 3 types of characters');
            isValid = false;
          }
        }

        if (this.selectedRoles.length < 1) {
          this.alertList.push('At least one role must be selected');
          isValid = false;
        }

        return isValid
      },
      deleteUser(item) {
        this.username = item.username;
        this.alertList = [];
        this.showDeleteDialog = true;
      },
      submitDelete() {
        axios({method: "DELETE", "url": `/users/${this.username}`}).then(()=> {
          this.closeDelete();
          this.refreshUserList();
        }).catch(err => {
          this.alertList = [err];
        })
      },
      closeDelete() {
        this.alertList = [];
        this.showDeleteDialog = false;
      },
      editUser(item) {
        this.username = item.username;
        this.fullName = item.fullName;
        this.selectedRoles = item.roles;
        this.authentication = item.authentication;
        this.currentAuthentication = item.authentication;
        this.udpateAuthentication();
        if (item.authentication === "API-Key") {
          this.password = '';
          this.passwordUpdated = true;
          this.apiKeyMessage = "Click here if you want the user's API-Key to be changed";
        } else {
          this.password = '******';
          this.passwordUpdated = false;
          this.apiKeyMessage = 'A new API-Key will be generated when you press the Update button';
        }
        this.generateApiKey = false;
        this.alertList = [];
        this.showEditDialog = true;
        this.$store.dispatch(AUTH_RENEW).catch(err => console.log(err)); // Renew auth to prevent expiration while editing a user
      },
      submitEdit() {
        if (this.checkUser()) {
          let data = {
            username: this.username,
            fullName: this.fullName,
            roles: this.selectedRoles,
          }

          if (this.passwordUpdated && this.authentication === "Password") {
            data.newPassword = this.password;
          }

          axios({
            method: "PATCH",
            "url": `/users/${this.username}`,
            "data": data,
            "headers": {"content-type": "application/json"}
          }).then(() => {
            this.closeEdit();
            this.refreshUserList();
          }).catch(err => {
            this.alertList = [err];
          })
        }
      },
      closeEdit() {
        this.alertList = [];
        this.showEditDialog = false;
        this.submitApiKey();
      },
      newUser() {
        this.username = '';
        this.fullName = '';
        this.password = '';
        this.passwordUpdated = true;
        this.selectedRoles = ['operator'];
        this.authentication = 'Password';
        this.currentAuthentication = '';
        this.udpateAuthentication();
        this.apiKeyMessage = 'An API-Key will be generated when you press the Create button';
        this.generateApiKey = false;
        this.showNewDialog = true;
        this.$store.dispatch(AUTH_RENEW).catch(err => console.log(err)); // Renew auth to prevent expiration while creating a new user
      },
      submitNew() {
        if (this.checkUser()) {
          let data = {
            username: this.username,
            fullName: this.fullName,
            roles: this.selectedRoles,
            password: this.password,
          }

          axios({
            method: "POST",
            "url": "/users",
            "data": data,
            "headers": {"content-type": "application/json"}
          }).then(() => {
            this.closeNew();
            this.refreshUserList();
          }).catch(err => {
            this.alertList = [err];
          })
        }
      },
      closeNew() {
        this.alertList = [];
        this.showNewDialog = false;
        this.submitApiKey();
      },
      submitApiKey() {
        if (this.generateApiKey) {
          axios({
            method: "POST",
            "url": `/users/${this.username}/api-key`,
          }).then(result => {
            this.apiKey = result.data["API-Key"];
          }).catch(err => {
            console.log(err);
            this.apiKey = 'Failed to get a new API-Key';
          })
          this.showApiKeyDialog = true;
        }
      },
      closeApiKey() {
        this.showApiKeyDialog = false;
        this.apiKey = '';
      },
      udpateAuthentication() {
        if (this.authentication === "Password") {
          this.showPassword = true;
          this.showApiKeyMessage = false;
        } else {
          this.showPassword = false;
          this.showApiKeyMessage = true;
        }
      },
      switchAuthentication() {
        if (this.authentication === "Password") {
          this.generateApiKey = false;
        } else {
          if (this.currentAuthentication !== "API-Key") {
            this.generateApiKey = true;
          }
        }
        this.udpateAuthentication()
      },
      switchGenerateApiKey() {
        if (this.currentAuthentication === "API-Key") {
          if (this.generateApiKey) {
            this.generateApiKey = false;
            this.apiKeyMessage = "Click here if you want the user's API-Key to be changed"
          } else {
            this.generateApiKey = true;
            this.apiKeyMessage = 'A new API-Key will be generated when you press the Update button';
          }
        }
      }
    }
  }
</script>