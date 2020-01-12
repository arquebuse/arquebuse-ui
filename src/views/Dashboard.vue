<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="clearfix">
          <h4 class="pt-3">Hello World !!!</h4>
          <p class="text-muted">Current status of API is {{ status }}</p>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'Dasboard',
    data () {
      return {
        status: "Not OK",
      }
    },
    mounted() {
      axios({ method: "GET", "url": "/system/status" }).then(result => {
        this.status = result.data.status;
      }).catch( () => {
        console.error("Unable to fetch API status");
      });
    },
    methods: { }
  }
</script>
