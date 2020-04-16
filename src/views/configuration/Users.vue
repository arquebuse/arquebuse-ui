<template>
  <div class="wrapper">
    <CRow>
      <CCol col="12" xl="12">
        <transition name="fade">
          <CCard>
            <CCardHeader>
              <H2>Users
                <div class="card-header-actions">
                  <CButton color="secondary" @click="newUser"><CIcon name="cil-plus"/> New user</CButton>
                </div>
              </H2>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                hover
                sorter
                :sorter-value='{ column: "Username", asc: "true" }'
                :items="items"
                :fields="fields"
                :items-per-page="perPage"
                :pagination="$options.paginationProps"
                index-column
              >
                <template #username="data">
                  <td>
                    <strong>{{data.item.username}}</strong>
                  </td>
                </template>

                <template #roles="data">
                  <td>
                    <span v-for="role in data.item.roles">
                      &nbsp;<CBadge color="secondary" >
                      {{capitalize(role)}}
                    </CBadge>
                    </span>
                  </td>
                </template>

                <template #authentications="data">
                  <td>
                    <span v-for="authentication in data.item.authentications">
                      &nbsp;<CBadge color="secondary">
                        {{authentication}}
                      </CBadge>
                    </span>
                  </td>
                </template>

                <template #action="data">
                  <td>
                    <template v-if="data.item.username !== currentUsername">
                      <a @click="editUser(data.item)" href="#"><CIcon height="15" name="cil-pencil"/></a>
                      &nbsp
                      <a @click="deleteUser(data.item)" href="#"><CIcon height="15" name="cil-trash"/></a>
                    </template>
                  </td>
                </template>

              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <CButton color="secondary" @click="newUser"><CIcon name="cil-plus"/> New user</CButton>
            </CCardFooter>
          </CCard>
        </transition>
      </CCol>
    </CRow>

    <CModal
            title="Delete User"
            color="danger"
            :show.sync="showDeleteDialog"
    >
      Are you sure you want to delete user '{{this.username}}' ?
      <template v-for="message in alertList">
        <CAlert show color="danger">{{ message }}</CAlert>
      </template>
      <template #footer>
        <CButton @click="closeDelete" color="secondary">Cancel</CButton>
        <CButton @click="submitDelete" color="primary">Delete</CButton>
      </template>
    </CModal>

    <CModal
            :show.sync="showEditDialog"
            :no-close-on-backdrop="true"
            title="Edit User"
            color="dark"
    >
      <CForm>
        <CInput
                label="Username"
                horizontal
                readonly
                placeholder="Username"
                autocomplete="username"
                v-model="username"
        >
        </CInput>
        <CInput
                label="Full name"
                horizontal
                placeholder="Full name"
                autocomplete="full_name"
                v-model="fullName"
        >
        </CInput>
        <CInput
                label="Password"
                horizontal
                placeholder="Password"
                autocomplete="password"
                type="password"
                v-model="password"
        >
        </CInput>
        <div class="form-group form-row">
          <CCol tag="label" sm="3" class="col-form-label">
            Roles
          </CCol>
          <CCol sm="9">
            <template v-for="name in roleList">
              <input type="checkbox" :id="`edit-${name}`" :value="name" v-model="selectedRoles"> <label :for="name" style="margin-bottom: 0;">{{capitalize(name)}}</label><br/>
            </template>
          </CCol>
        </div>
        <template v-for="message in alertList">
          <CAlert show color="danger">{{ message }}</CAlert>
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
            :show.sync="showNewDialog"
            :no-close-on-backdrop="true"
            title="Edit User"
            color="dark"
    >
      <CForm>
        <CInput
                label="Username"
                horizontal
                placeholder="Username"
                autocomplete="username"
                v-model="username"
        >
        </CInput>
        <CInput
                label="Full name"
                horizontal
                placeholder="Full name"
                autocomplete="full_name"
                v-model="fullName"
        >
        </CInput>
        <CInput
                label="Password"
                horizontal
                placeholder="Password"
                autocomplete="password"
                type="password"
                v-model="password"
        >
        </CInput>
        <div class="form-group form-row">
          <CCol tag="label" sm="3" class="col-form-label">
            Roles
          </CCol>
          <CCol sm="9">
            <template v-for="name in roleList">
              <input type="checkbox" :id="`new-${name}`" :value="name" v-model="selectedRoles"> <label :for="name" style="margin-bottom: 0;">{{capitalize(name)}}</label><br/>
            </template>
          </CCol>
        </div>
        <template v-for="message in alertList">
          <CAlert show color="danger">{{ message }}</CAlert>
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
  </div>
</template>

<script>
  import store from '../../store'
  import axios from 'axios'
  import { freeSet } from '@coreui/icons'
  export default {
    name: 'Users',
    freeSet,
    data: () => {
      return {
        items: [],
        fields: [
          { key: 'username',        label: 'Username' },
          { key: 'fullName',        label: 'Full name' },
          { key: 'authentications', label: 'Authentications'},
          { key: 'roles',           label: 'Roles'},
          { key: 'action',          label: 'Action'},
        ],
        perPage: 10,
        showDeleteDialog: false,
        showEditDialog: false,
        showNewDialog: false,
        currentUsername: '',
        username: '',
        fullName: '',
        password: '',
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
      this.refreshUserList()
      this.currentUsername = store.getters.username;
    },
    methods: {
      refreshUserList() {
        axios({ method: "GET", "url": "/users" }).then(result => {
          this.items = result.data;
        }).catch( () => {
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
        if (this.username === '') {
          this.alertList.push('Username cannot be empty');
          isValid = false;
        } else if (!usernameRe.test(this.username) ) {
          this.alertList.push('Username can only contain alphanumeric characters, dashes and underscores');
          isValid = false;
        }

        if (this.fullName === '') {
          this.alertList.push('Full name cannot be empty');
          isValid = false;
        } else if (!fullNameRe.test(this.fullName) ) {
          this.alertList.push('Full name can only contain alphanumeric characters, spaces, dashes and underscores');
          isValid = false;
        }

        if (this.password.length < 6) {
          this.alertList.push('Password must be at least 6 characters');
          isValid = false;
        }

        if (this.selectedRoles.length < 1) {
          this.alertList.push('At least one role must be selected');
          isValid = false;
        }

        return isValid
      },
      getUserData() {
        let data = {
          username : this.username,
          fullName : this.fullName,
          roles    : this.selectedRoles,
        }

        if (this.password !== '******') {
          data.newPassword = this.password;
        }

        return data
      },
      deleteUser(item) {
        this.username = item.username;
        this.alertList = [];
        this.showDeleteDialog = true;
      },
      submitDelete() {
        axios({ method: "DELETE", "url": `/users/${this.username}`}).then(resp => {
          this.closeDelete();
          this.refreshUserList();
        })
        .catch(err => {
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
        this.password = '******';
        this.selectedRoles = item.roles;
        this.alertList = [];
        this.showEditDialog= true;
      },
      submitEdit() {
        if (this.checkUser()) {
          axios({ method: "PATCH", "url": `/users/${this.username}`, "data": this.getUserData(), "headers": { "content-type": "application/json" }}).then(resp => {
            this.closeEdit();
            this.refreshUserList();
          })
          .catch(err => {
            this.alertList = [err];
          })
        }
      },
      closeEdit() {
        this.alertList = [];
        this.showEditDialog = false;
      },
      newUser() {
        this.username = '';
        this.fullName = '';
        this.password = '';
        this.selectedRoles = ['operator'];
        this.showNewDialog = true;
      },
      submitNew() {
        if (this.checkUser()) {
          axios({ method: "POST", "url": "/users", "data": this.getUserData(), "headers": { "content-type": "application/json" }}).then(resp => {
            this.closeNew()
            this.refreshUserList();
          })
          .catch(err => {
            this.alertList = [err];
          })
        }
      },
      closeNew() {
        this.alertList = [];
        this.showNewDialog = false;
      },
    }
  }
</script>