<template>
    <iframe class="iframe" src="http://localhost/index.php/apps/files/?headless=true" title="headless nextcloud"></iframe>
</template>

<script>
  export default {
    name: 'hostingPage',
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.iframe {
    flex: 1;
    border: none;
    height: 100vh;
}
</style>
<style lang="scss">
</style>