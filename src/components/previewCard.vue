<template>
  <md-card class="card-content">
    <md-card-media md-ratio="16:9">
      <img :src="data.thumbnail" :alt="'Thumbnail for ~' + data.title + '~'">
    </md-card-media>

    <md-card-header>
      <h2 class="md-title">{{data.title}}</h2>
      <div class="md-subhead">
        <md-icon>label</md-icon>
        <span v-for="tag in data.tags">
          {{ tag }}, 
        </span>            
        </md-chips>
      </div>
    </md-card-header>

    <md-card-content>
      {{data.description}}
    </md-card-content>
  </md-card>
</template>

<script>
export default {
  props: ['data'],
  name: 'previewCard',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.card-content {
  position: relative;
  padding-bottom: 52px;
  .md-subhead {
    .md-icon {
      $size: 16px;

      width: $size;
      min-width: $size;
      height: $size;
      min-height: $size;
      font-size: $size;
      line-height: $size;
    }

    span {
      vertical-align: middle;
    }
  }
}
</style>
