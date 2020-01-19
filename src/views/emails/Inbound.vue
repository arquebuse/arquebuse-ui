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
                    hover
                    sorter
                    column-filter
                    table-filter
                    items-per-page-select
                    @row-clicked="rowClicked"
                    :items="items"
                    :fields="fields"
                    :pagination="$options.paginationProps"
                    index-column
            >
              <template #timestamp="data">
                <td>
                  {{formatDate(data.item.timestamp)}}
                </td>
              </template>

              <template #action="data">
                <td>
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
  import moment from 'moment'
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
          { key: 'timestamp', label: 'Received' },
          { key: 'client',    label: 'Origin' },
          { key: 'from',      label: 'From' },
          { key: 'to',        label: 'To' },
          { key: 'subject',   label: 'Subject' },
          { key: 'action',    label: '', filter: false, sorter: false },
        ],
        perPage: 10,
      }
    },
    paginationProps: {
      doubleArrows: false,
      previousButtonHtml: 'prev',
      nextButtonHtml: 'next'
    },
    mounted() {
      axios({ method: "GET", "url": "/inbound" }).then(result => {
        this.items = result.data;
      }).catch( () => {
        console.error("Unable to fetch inbound mail list");
      });
    },
    methods: {
      formatDate (dateStr) {
        let date = moment(dateStr, moment.ISO_8601);
        return date.format("DD.MM.YYYY HH:mm:ss");
      },
      mailLink (id) {
        return `inbound/${id}`
      },
      rowClicked (item, index) {
        const mailLink = this.mailLink(item.id)
        this.$router.push({path: mailLink})
      },
    }
  }
</script>
