<template>
    <div class="wrapper">
        <iframe class="iframe" src="https://nextcloud.com/?wordfence_syncAttackData=1545147387.7765" name="iFrame" title="Das ist mein Video"></iframe>
    </div>
</template>

<script>
  export default {
    name: 'hostingPage',
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrapper {
    display: flex;
    height: 100vh;
    .iframe {
        flex: 1;
        border: none;
    }
}
</style>
<style lang="scss">
#app {
    display: flex;
    flex-direction: column;
    padding: 0;
    header {
        position: relative;
    }
    main {
        padding: 0;
    }
}
</style>