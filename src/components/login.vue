<template>
  <md-card class="card-content">
    <md-card-header>
      <h2 class="md-title">Login</h2>
    </md-card-header>

    <md-card-content>
      <form id="loginForm" @submit.prevent="validateBeforeSubmit">
        <md-input-container :class="{'md-input-invalid': errors.has('url')}">
          <label>JWT</label>
          <md-input v-model="jwt" v-validate name="jwt" data-vv-rules="required"></md-input>
          <span class="md-error">{{errors.first('jwt')}}</span>
        </md-input-container>
      </form>
    </md-card-content>
      
    <md-card-actions>
      <md-button class="md-accent" type="submit" form="loginForm">Login</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'login',
  data() {
    return {
      jwt: '',
    };
  },
  created() {
    axios.get(`https://schul-cloud.org:8080/content/resources/`,{headers: {
        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJhY2NvdW50SWQiOiI1YTMyNWRiNTVhOTE2NzBlYTZiNWE5ZWQiLCJ1c2VySWQiOiI1YTMyNWFkNTVhOTE2NzBlYTZiNWE5ZTgiLCJpYXQiOjE1MTQ5OTY3NTUsImV4cCI6MTUxNzU4ODc1NSwiYXVkIjoiaHR0cHM6Ly9zY2h1bC1jbG91ZC5vcmciLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImFub255bW91cyJ9._fr7fzOJaUK_gqM0ePwTc6YntUGtam6EnC-hOjjfd2c"
      }
    })
    .then(response => {
      // JSON responses are automatically parsed.
      this.data = response.data.data;
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          localStorage.setItem("jwt", this.jwt);
          window.location.href = "/";
          return;
        }
        alert('Correct the errors!');
      });
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
