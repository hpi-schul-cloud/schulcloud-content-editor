<template>
  <md-card class="card-content">
    <md-card-media md-ratio="16:9">
      <img :src="(data.thumbnail||'https://placeholdit.co//i/320x180?bg=CCC&fc=000&text=Platzhalter')" :alt="'Thumbnail for ~' + data.title + '~'">
    </md-card-media>

    <md-card-header>
      <h2 class="md-title">{{data.title||"Titel"}}</h2>
      <div class="md-subhead">      
        <div class="tags">
            <md-icon>label</md-icon>
            <span v-for="tag in (data.tags||[]).slice(0,this.$config.card.displayedTags)">
              {{ tag }}
            </span>
        </div>
      </div>
    </md-card-header>

    <md-card-content>
      {{ (data.description||"Beschreibung...").substring(0, 300) }}{{ ((data.description||"").length>300)?'...':'' }}
    </md-card-content>

    <md-card-actions>
      <a id="open" v-bind:href="this.$config.API.baseUrl + this.$config.API.redirectPath + data._id" target="_blank">
        <md-button v-bind:class="{'md-primary': readOnly}">{{$lang.buttons.open}}</md-button>
      </a>
      <router-link v-if="readOnly != true" :to="{path: '/edit/' + data._id}">
        <md-button class="md-primary">{{$lang.buttons.edit}}</md-button>
      </router-link>
    </md-card-actions>
  </md-card>
</template>

<script>
export default {
  props: ['data', 'readOnly'],
  name: 'contentForm'
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
  overflow: hidden;
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
  .md-card-actions{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
