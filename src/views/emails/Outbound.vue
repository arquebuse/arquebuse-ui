<template>
  <CRow>
    <CCol col="12" xl="12">
      <transition name="fade">
        <CCard>
          <CCardHeader>
            <H2>Sent emails
              <div class="card-header-actions">
                <CButton @click="newMail" color="secondary">
                  <CIcon name="cil-paper-plane"/>
                  New email
                </CButton>
              </div>
            </H2>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                :fields="fields"
                :items="items"
                :pagination="$options['paginationProps']"
                @row-clicked="rowClicked"
                column-filter
                hover
                index-column
                items-per-page-select
                sorter
                table-filter
            >

              <template #action="data">
                <td>
                  <a @click="deleteItem(data.item)" href="#">
                    <CIcon height="15" name="cil-trash"/>
                  </a>
                </td>
              </template>

              <template #timestamp="data">
                <td>
                  {{formatDate(data.item.timestamp)}}
                </td>
              </template>

              <template #status="data">
                <td>
                  <CBadge :color="getBadge(data.item.status)">
                    {{data.item.status}}
                  </CBadge>
                </td>
              </template>

            </CDataTable>
          </CCardBody>
          <CCardFooter>
            <CButton @click="newMail" color="secondary">
              <CIcon name="cil-paper-plane"/>
              New email
            </CButton>
          </CCardFooter>
        </CCard>
      </transition>
    </CCol>
  </CRow>
</template>

<script>
  import axios from 'axios';
  import {freeSet} from '@coreui/icons';
  import moment from 'moment';

  export default {
    name: 'Inbound',
    freeSet,
    data: () => {
      return {
        items: [],

        /*
          "id": "1WXyJHtAwJfddLUrGAO8K1uRtCo",
          "timestamp": "2020-01-18T00:31:34.954812+01:00",
          "server": "127.0.0.1:2525",
          "from": "<someone@arquebuse.org>",
          "to": "Someone Else <someone.else@arquebuse.org>",
          "subject": "discount Gop",
          "status": "FAILED"
        }*/

        fields: [
          {key: 'timestamp', label: 'Sent'},
          {key: 'server', label: 'Destination'},
          {key: 'from', label: 'From'},
          {key: 'to', label: 'To'},
          {key: 'subject', label: 'Subject'},
          {key: 'status', label: 'Status'},
          {key: 'action', label: '', filter: false, sorter: false},
        ],
        perPage: 10,
        deleted: false,
      }
    },
    paginationProps: {
      doubleArrows: false,
      previousButtonHtml: 'prev',
      nextButtonHtml: 'next'
    },
    mounted() {
      this.refreshData();
    },
    methods: {
      refreshData() {
        axios({method: "GET", "url": "/outbound"}).then(result => {
          this.items = result.data;
        }).catch(() => {
          console.error("Unable to fetch inbound mail list");
        });
      },
      formatDate(dateStr) {
        let date = moment(dateStr, moment.ISO_8601);
        return date.format("DD.MM.YYYY HH:mm:ss");
      },
      getBadge(status) {
        return status === 'SENT' ? 'success'
          : status === 'RETRIED' ? 'warning'
            : status === 'FAILED' ? 'danger' : 'primary';
      },
      mailLink(id) {
        return `outbound/${id}`;
      },
      newMail() {
        this.$router.push('/newmail').catch(err => console.log(err));
      },
      rowClicked(item) {
        if (this.deleted) {
          this.deleted = false;
        } else {
          const mailLink = this.mailLink(item.id);
          this.$router.push({path: mailLink}).catch(err => console.log(err));
        }
      },
      deleteItem(item) {
        this.deleted = true;
        axios({method: "DELETE", "url": `/outbound/${item.id}`}).then(()=> {
          this.refreshData();
        }).catch(err => {
          console.error(`Unable to delete item '${item.id}'. ${err}`);
        });
      }
    }
  }
</script>
