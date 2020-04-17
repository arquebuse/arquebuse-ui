<template>
  <CRow>
    <CCol col="12" xl="12">
      <transition name="fade">
        <CCard>
          <CCardHeader>
            <H2>Received emails</H2>
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
              <template #timestamp="data">
                <td>
                  {{formatDate(data.item.timestamp)}}
                </td>
              </template>

              <template #action="data">
                <td>
                  <a @click="deleteItem(data.item)" href="#">
                    <CIcon height="15" name="cil-trash"/>
                  </a>
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
          "id": "1WXyeQITbvodz4Y3levjSfkbjFf",
          "timestamp": "2020-01-18T02:18:48.68118+01:00",
          "client": "127.0.0.1:58975",
          "from": "someone@arquebuse.org",
          "to": "Someone Else <someone.else@arquebuse.org",
          "subject": "discount Gop"
        }*/

        fields: [
          {key: 'timestamp', label: 'Received'},
          {key: 'client', label: 'Origin'},
          {key: 'from', label: 'From'},
          {key: 'to', label: 'To'},
          {key: 'subject', label: 'Subject'},
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
        axios({method: "GET", "url": "/inbound"}).then(result => {
          this.items = result.data;
        }).catch(() => {
          console.error("Unable to fetch inbound mail list");
        });
      },
      formatDate(dateStr) {
        let date = moment(dateStr, moment.ISO_8601);
        return date.format("DD.MM.YYYY HH:mm:ss");
      },
      mailLink(id) {
        return `inbound/${id}`;
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
        axios({method: "DELETE", "url": `/inbound/${item.id}`}).then(() => {
          this.refreshData();
        }).catch(err => {
          console.error(`Unable to delete item '${item.id}'. ${err}`);
        });
      }
    }
  }
</script>
