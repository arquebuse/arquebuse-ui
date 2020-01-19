<template>
  <CRow>
    <CCol col="12" xl="12">
      <transition name="fade">
        <CCard>
          <CCardHeader>
            <H2>Sent emails
              <div class="card-header-actions">
                <CButton color="secondary" @click="newMail"><CIcon name="cil-pencil"/> New</CButton>
              </div>
            </H2>
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

              <template #action="data">
                <td>
                  <CIcon height="15" name="cil-trash"/>
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
            <CButton color="secondary" @click="newMail"><CIcon name="cil-pencil"/> New</CButton>
          </CCardFooter>
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
          "id": "1WXyJHtAwJfddLUrGAO8K1uRtCo",
          "timestamp": "2020-01-18T00:31:34.954812+01:00",
          "server": "127.0.0.1:2525",
          "from": "<someone@arquebuse.org>",
          "to": "Someone Else <someone.else@arquebuse.org>",
          "subject": "discount Gop",
          "status": "FAILED"
        }*/

        fields: [
          { key: 'timestamp', label: 'Sent' },
          { key: 'server',    label: 'Destination' },
          { key: 'from',      label: 'From' },
          { key: 'to',        label: 'To' },
          { key: 'subject',   label: 'Subject' },
          { key: 'status',    label: 'Status' },
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
      axios({ method: "GET", "url": "/outbound" }).then(result => {
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
      getBadge (status) {
        return status === 'SENT' ? 'success'
          : status === 'RETRIED' ? 'warning'
            : status === 'FAILED' ? 'danger' : 'primary'
      },
      mailLink (id) {
        return `outbound/${id}`
      },
      rowClicked (item, index) {
        const mailLink = this.mailLink(item.id);
        this.$router.push({path: mailLink})
      },
      newMail() {
        this.$router.push('/newmail');
      },
    }
  }
</script>
