<template>
  <footer>
    <div>© 2018 Schul-Cloud </div>
    <img src="../assets/hpi-logo.png" width="235" height="44">
    <div>
        <a href="https://schul-cloud.org/impressum">Impressum</a>
        <span> - </span>
        <a href="https://schul-cloud.org/impressum#data_security">Datenschutzerklärung</a>
        <span> - </span>
        <a href="mailto:hpi-info@hpi.de?subject=Schul_Cloud%20Anfrage">Kontakt</a>
        <span> - </span>
        <a href="https://schul-cloud.org/partner">Partner</a>
    </div>
  </footer>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

export default {
  name: 'footer',
  data() {
  },
  created() {
  },
  methods: {
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  footer{
    margin-top: 5rem;
    text-align: center;
  }
</style>
