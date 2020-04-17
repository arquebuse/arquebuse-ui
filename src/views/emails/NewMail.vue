<template>
  <CRow>
    <CCol col="6" xl="6">
      <CCard>
        <CCardHeader>
          <H2>New email
            <div class="card-header-actions">
              <CButton @click="goBack" color="secondary">
                <CIcon name="cil-arrow-thick-left"/>
                Back
              </CButton>
            </div>
          </H2>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CInput
                :is-valid="validateDestination"
                horizontal
                invalid-feedback="Please provide a valid destination (server:port)"
                label="Destination"
                v-model="mail.server"
            />
            <CInput
                :is-valid="validateEmail"
                horizontal
                invalid-feedback="Please provide a valid email address"
                label="From"
                v-model="mail.from"
            />
            <CInput
                :is-valid="validateEmail"
                horizontal
                invalid-feedback="Please provide a valid email address"
                label="To"
                v-model="mail.to"
            />
            <CTextarea
                description="Data (headers + message)"
                horizontal
                label="Data"
                rows="12"
                v-model="mail.data"
            />
          </CForm>
        </CCardBody>
        <CCardFooter align="right">
          <CButton @click="goBack" color="secondary">Cancel</CButton>&nbsp;
          <CButton @click="resetForm" color="secondary">Reset</CButton>&nbsp;
          <CButton @click="send" color="primary">Send</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'NewMail',

    data: () => {
      let defaults = {
        server: '127.0.0.1:2525',
        from: 'someone@arquebuse.org',
        to: 'someone.else@arquebuse.org',
        data: 'Subject: Hello from Arquebuse UI !!!\n\nThis is the email body.\n\nBest regards,\nArquebuse',
      }
      return {
        defaults: Object.assign({}, defaults),
        mail: Object.assign({}, defaults),
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      send() {
        axios({
          method: "POST",
          "url": "/spool",
          "data": this.mail,
          "headers": {"content-type": "application/json"}
        }).then(() => {
          this.$router.go(-1);
        }).catch(err => {
          console.log(err);
        })
      },
      validateDestination(val) {
        return val ? (/^.*:\d+$/.test(val)) : false;
      },
      validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      resetForm() {
        this.mail.server = this.defaults.server;
        this.mail.from = this.defaults.from;
        this.mail.to = this.defaults.to;
        this.mail.data = this.defaults.data;
      }
    }
  }
</script>