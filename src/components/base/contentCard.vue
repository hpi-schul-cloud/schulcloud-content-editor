<template>
  <article>
    <MdCard class="card-content height-100">
      <MdCardMedia md-ratio="16:9">
        <img
          :src="(data.thumbnail||'https://placeholdit.co//i/320x180?bg=CCC&fc=000&text=Platzhalter')"
          :alt="'Thumbnail for ~' + data.title + '~'"
        >
      </MdCardMedia>

      <MdCardHeader>
        <h2 class="md-title">
          {{ data.title||"Titel" }}
        </h2>
        <div class="md-subhead">
          <div class="tags">
            <MdIcon>label</MdIcon>
            <span
              v-for="(tag, index) in (data.tags||[]).slice(0,this.$config.card.displayedTags)"
              :key="`${index}-${tag}`"
            >
              {{ tag }},
            </span>
          </div>
        </div>
      </MdCardHeader>

      <MdCardContent>
        {{ (data.description||"Beschreibung...").substring(0, 300) }}{{ ((data.description||"").length>300)?'...':'' }}
      </MdCardContent>

      <MdCardActions>
        <div class="providerName">
          {{ data.providerName }}
        </div>
        <MdButton
          v-if="data._id"
          :class="{'md-primary': readOnly}"
          @click="dialog.active = true"
        >
          {{ $lang.buttons.open }}
        </MdButton>
        <RouterLink
          v-if="readOnly != true"
          :to="{path: '/edit/' + data._id}"
        >
          <MdButton class="md-primary">
            {{ $lang.buttons.edit }}
          </MdButton>
        </RouterLink>
      </MdCardActions>
    </MdCard>
    <ConfirmDialog
      :config="dialog"
      @confirm="onConfirm"
    />
  </article>
</template>

<script>
  /* load confirmDialog async */
const ConfirmDialog = () => import(/* webpackChunkName: "confirmDialog" */ '@/components/dialogs/confirm.vue');

export default {
	name: 'ContentForm',
	components: {
		ConfirmDialog,
	},
	props: {
		data: {
			type: Object,
			required: true
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dialog: {
				active: false,
				title: this.$lang.contentCard.dialog.title,
				content: this.$lang.contentCard.dialog.content,
				confirm: this.$lang.contentCard.dialog.confirm,
				cancle: this.$lang.contentCard.dialog.cancle,
			},
		};
	},
	methods: {
		onConfirm() {
			window.open(this.$config.API.baseUrl + this.$config.API.viewContentPath + this.data._id, '_blank');
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
    .md-card-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .providerName {
        position: absolute;
        left: 16px;
      }
    }
  }
</style>
