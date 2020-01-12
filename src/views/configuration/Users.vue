<template>
  <CRow>
    <CCol col="12" xl="8">
      <transition name="slide">
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
            <CDataTable
              hover
              striped
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
                    {{role}}
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
                  <CIcon height="15" name="cil-pencil"/>&nbsp;
                  <CIcon height="15" name="cil-trash"/>
                </td>
              </template>

            </CDataTable>
          </CCardBody>
        </CCard>
      </transition>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios'
import { freeSet } from '@coreui/icons'
export default {
  name: 'Users',
  freeSet,
  data: () => {
    return {
      items: [],
      fields: [
        { key: 'username',        label: 'Login' },
        { key: 'fullName',        label: 'Name' },
        { key: 'authentications', label: 'Authentications'},
        { key: 'roles',           label: 'Roles'},
        { key: 'action',          label: 'Action'},
      ],
      perPage: 10,
    }
  },
  paginationProps: {
    align: 'center',
    doubleArrows: false,
    previousButtonHtml: 'prev',
    nextButtonHtml: 'next'
  },
  mounted() {
    axios({ method: "GET", "url": "/users" }).then(result => {
      this.items = result.data;
    }).catch( () => {
      console.error("Unable to fetch users list");
    });
  },
}
</script>