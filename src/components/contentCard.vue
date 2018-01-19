<template>
  <md-card class="card-content">
    <md-card-media v-if="data.thumbnail" md-ratio="16:9">
      <img :src="data.thumbnail" :alt="'Thumbnail for ~' + data.title + '~'">
    </md-card-media>

    <md-card-header>
      <h2 class="md-title">{{data.title}}</h2>
      <div class="md-subhead">      
        <div class="tags">
            <md-icon>label</md-icon>
            <span v-for="tag in data.tags.slice(0,this.$config.card.displayedTags)">
              {{ tag }}
            </span>
        </div>
      </div>
    </md-card-header>

    <md-card-content>
      {{this.truncateHTML(data.description)}}...
    </md-card-content>

    <md-card-actions>
      <a v-bind:href="this.$config.API.baseUrl + this.$config.API.redirectPath + data._id" target="_blank">
        <md-button>open</md-button>
      </a>
      <router-link :to="{path: '/edit/' + data._id}">
        <md-button class="md-accent">edit</md-button>
      </router-link>
    </md-card-actions>
  </md-card>
</template>

<script>
const truncatehtml = require('truncate-html');
export default {
  props: ['data'],
  name: 'contentForm',
  methods: {
    truncateHTML: function(text = '', length = 500){
        if (text.length <= length) {return text;}
        return truncatehtml(text, length, {
          stripTags: true,
          decodeEntities: true,
        })
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.card-content {
  width: 100%;
  position: relative;
  padding-bottom: 52px;
  word-break: break-all;
  word-break: break-word;
  overflow-x: hidden;
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
  a .md-button{
    color: initial;
  }
  .md-card-actions{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
