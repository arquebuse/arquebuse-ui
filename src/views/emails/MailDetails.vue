<template>
    <CRow>
        <CCol col="12" xl="12">
            <transition name="fade">
                <CCard>
                    <CCardHeader>
                        <H2>Email details
                            <div class="card-header-actions">
                                <CButton color="secondary" @click="goBack"><CIcon name="cil-arrow-thick-left"/> Back</CButton>
                            </div>
                        </H2>
                    </CCardHeader>
                    <CCardBody>
                        <CListGroup>
                            <CListGroupItem v-if="status !== 'undefined'" :color="getStatusColor(status)" href="#">
                                <strong>Status: </strong>{{status}}
                            </CListGroupItem>
                            <CListGroupItem v-for="item in items" href="#">
                                <div v-html="'<b>' + item.title + ': </b>' + item.value"></div>
                            </CListGroupItem>
                            <CListGroupItem href="#">
                                <strong>Data: </strong><pre>{{rawData}}</pre>
                            </CListGroupItem>
                        </CListGroup>
                    </CCardBody>
                    <CCardFooter>
                        <CButton color="secondary" @click="goBack"><CIcon name="cil-arrow-thick-left"/> Back</CButton>
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
        name: 'InboundMail',
        freeSet,
        data: () => {
            return {
                items: [],
                status: 'undefined',
                rawData: '',
            }

            /*
                "id": "1WXyeQITbvodz4Y3levjSfkbjFf",
                "timestamp": "2020-01-18T02:18:48.68118+01:00",
                "client": "127.0.0.1:58975",
                "from": "someone@arquebuse.org",
                "to": "Someone Else <someone.else@arquebuse.org",
                "subject": "discount Gop",
                "data": "To: Someone Else\nSubject: discount Gop\nThis is the email body.\n"
            }*/
        },
        paginationProps: {
            align: 'center',
            doubleArrows: false,
            previousButtonHtml: 'prev',
            nextButtonHtml: 'next'
        },
        mounted() {
            let fields = {
                timestamp: "Date",
                client: "Origin server",
                server: "Destination server",
                from: "From",
                to: "To",
                subject: "Subject",
            };

            let direction = this.$route.path.startsWith("/inbound") ? '/inbound/' : '/outbound/'

            axios({ method: "GET", "url": direction + this.$route.params.id  }).then(result => {
                let value = "";
                for (let key in result.data) {
                  value = result.data[key];

                  switch (key) {
                    case "timestamp":
                      let date = moment(value, moment.ISO_8601);
                      value = date.format("DD.MM.YYYY HH:mm:ss");
                      break;
                    case "data":
                      //value = '<br />' + value.replace(/(\r\n|\n|\r)/g, "<br />");
                      this.rawData = value;
                      break;
                    case 'status':
                      this.status = value;
                      break;
                    default:
                      let div = document.createElement('div');
                      div.appendChild(document.createTextNode(value));
                      value = div.innerHTML;
                      break;
                  }

                  if (key in fields) {
                    this.items.push({title: fields[key], value: value});
                  }
                }
            }).catch( () => {
                console.error("Unable to fetch inbound mail details");
            });
        },
        methods: {
            formatDate (dateStr) {
                let date = moment(dateStr, moment.ISO_8601);
                return date.format("DD.MM.YYYY HH:mm:ss");
            },
            goBack() {
                this.$router.go(-1)
            },
            getStatusColor (status) {
                return status === 'SENT' ? 'success'
                  : status === 'RETRIED' ? 'warning'
                    : status === 'FAILED' ? 'danger' : 'primary';
            },
        }
    }
</script>