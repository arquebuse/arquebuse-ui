<template>
    <CRow>
        <CCol col="6" xl="6">
            <CCard>
                <CCardHeader>
                    <H2>New email
                        <div class="card-header-actions">
                            <CButton color="secondary" @click="goBack">
                                <CIcon name="cil-arrow-thick-left"/>
                                Back
                            </CButton>
                        </div>
                    </H2>
                </CCardHeader>
                <CCardBody>
                    <CForm>
                        <CInput
                            v-model="mail.server"
                            label="Destination"
                            horizontal
                            invalid-feedback="Please provide a valid destination (server:port)"
                            :is-valid="validateDestination"
                        />
                        <CInput
                            v-model="mail.from"
                            label="From"
                            horizontal
                            invalid-feedback="Please provide a valid email address"
                            :is-valid="validateEmail"
                        />
                        <CInput
                            v-model="mail.to"
                            label="To"
                            horizontal
                            invalid-feedback="Please provide a valid email address"
                            :is-valid="validateEmail"
                        />
                        <CTextarea
                            v-model="mail.data"
                            description="Data (headers + message)"
                            label="Data"
                            horizontal
                            rows="12"
                        />
                    </CForm>
                </CCardBody>
                <CCardFooter>
                    <CButton color="secondary" @click="send">Send</CButton>&nbsp;
                    <CButton color="secondary" @click="resetForm">Reset</CButton>&nbsp;
                    <CButton color="secondary" @click="goBack">Cancel</CButton>
                </CCardFooter>
            </CCard>
        </CCol>
    </CRow>
</template>
<script>
  import axios from 'axios'

  export default {
    name: 'NewMail',

    /*
      "server": "127.0.0.1:2525",
      "from" :  "<someone@arquebuse.org>",
      "to" :    "Someone Else <someone.else@arquebuse.org>",
      "data" :  "To: Someone Else\r\nSubject: Hello from PostMan !!!\r\nThis is the email body.\r\n"
     */

    data: () => {
      return {
        mail: {
            server: '127.0.0.1:2525',
            from: 'someone@arquebuse.org',
            to: 'someone.else@arquebuse.org',
            data: 'Subject: Hello from Arquebuse UI !!!\r\nThis is the email body.\r\n',
        }
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      send() {
        axios({ method: "POST", "url": "/spool", "data": this.mail, "headers": { "content-type": "application/json" }}).then(resp => {
          this.$router.go(-1)
        })
          .catch(err => {
            console.log(err);
          })
      },
      validateDestination (val) {
        return val ? (/^.*:\d+$/.test(val)) : false
      },
      validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      resetForm() {
        this.server = this.from = this.to = this.data = '';
      }
    }
  }
</script>