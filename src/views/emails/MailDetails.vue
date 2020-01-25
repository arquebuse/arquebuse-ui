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

                            <CListGroupItem href="#">
                                <strong>Date: </strong>{{timestamp}}
                            </CListGroupItem>

                            <CListGroupItem v-if="client !== ''" href="#">
                                <strong>Received from: </strong>{{client}}
                            </CListGroupItem>

                            <CListGroupItem v-if="server !== ''" href="#">
                                <strong>Sent to: </strong>{{server}}
                            </CListGroupItem>

                            <CListGroupItem :color="getErrorColor(fromError)" href="#">
                                <strong>From: </strong>{{from}}
                            </CListGroupItem>

                            <CListGroupItem :color="getErrorColor(toError)" href="#">
                                <strong>To: </strong>{{to}}
                            </CListGroupItem>

                            <CListGroupItem href="#">
                                <strong>Subject: </strong>{{subject}}
                            </CListGroupItem>

                            <CListGroupItem v-if="parseErrors.length > 0 " color="warning" href="#">
                                <strong>MIME parsing error(s): </strong><br/>
                                    <ul>
                                        <li v-for="parseError in parseErrors">{{parseError}}</li>
                                    </ul>
                            </CListGroupItem>

                            <CListGroupItem v-if="headers.length > 0"  href="#">
                                <strong>Headers: </strong><br/>
                                <ul>
                                    <li v-for="header in headers"><b>{{header.id}}: </b>{{header.values}}</li>
                                </ul>
                            </CListGroupItem>

                            <CListGroupItem v-if="text !== ''" href="#">
                                <strong>Text message: </strong><pre style="margin-left: 15px">{{text}}</pre>
                            </CListGroupItem>

                            <CListGroupItem v-if="html !== ''" href="#">
                                <strong>HTML message: </strong><pre style="margin-left: 15px">{{html}}</pre>
                            </CListGroupItem>

                            <CListGroupItem href="#">
                                <strong>Raw data: </strong><pre style="margin-left: 15px">{{data}}</pre>
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
                to: '',
                toError: false,
                from: '',
                fromError: false,
                status: 'undefined',
                data: '',
                headers: [],
                parseErrors: [],
                text: '',
                html: '',
                timestamp: '',
                client: '',
                server: '',
                subject: '',
            }

            /*
                ID          string    `json:"id"`
                Received    time.Time `json:"timestamp"`
                Client      string    `json:"client,omitempty"`
                Server      string    `json:"server,omitempty"`
                From        string    `json:"from"`
                FromError   bool      `json:"fromError"`
                To          string    `json:"to"`
                ToError     bool      `json:"toError"`
                Subject     string    `json:"subject"`
                Data        string    `json:"data,omitempty"`
                Parsed      bool      `json:"parsed"`
                Text        string    `json:"text"`
                Html        string    `json:"html"`
                Headers     []header  `json:"headers"`
                ParseErrors []string  `json:"parseErrors"`
            }*/
        },
        paginationProps: {
            align: 'center',
            doubleArrows: false,
            previousButtonHtml: 'prev',
            nextButtonHtml: 'next'
        },
        mounted() {
            let direction = this.$route.path.startsWith("/inbound") ? '/inbound/' : '/outbound/'

            axios({ method: "GET", "url": direction + this.$route.params.id  }).then(result => {
                let value = "";
                for (let key in result.data) {
                  value = result.data[key];

                  if (this.hasOwnProperty(key)) {
                    switch (key) {
                      case "headers":
                      case "parseErrors":
                      case "toError":
                      case "fromError":
                      case "html":
                      case "data":
                        this[key] = value;
                        break;
                      case "timestamp":
                        let date = moment(value, moment.ISO_8601);
                        this[key] = date.format("DD.MM.YYYY HH:mm:ss");
                        break;
                      default:
                        let div = document.createElement('div');
                        div.appendChild(document.createTextNode(value));
                        this[key] = div.innerHTML;
                        break;
                    }
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
            getErrorColor (error) {
                return error ? 'warning' : '';
            },
        }
    }
</script>