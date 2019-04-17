<template>
	<article>
		<BaseCard>
			<template slot="media">
				<img
					:src="
						data.thumbnail ||
							'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
					"
					:alt="'Thumbnail for ~' + data.title + '~'"
				/>
			</template>
			<template slot="head">
				<h2 class="title">{{ data.title || "Titel" }}</h2>
				<div class="tags">
					<i class="material-icons">label</i>
					<span
						v-for="(tag, index) in (data.tags || []).slice(
							0,
							this.$config.card.displayedTags
						)"
						:key="`${index}-${tag}`"
					>
						{{ tag }},
					</span>
				</div>
			</template>
			<template slot="body">
				{{ (data.description || "Beschreibung...").substring(0, 300) }}
				{{ (data.description || "").length > 300 ? "..." : "" }}
			</template>
			<template slot="footer">
				<div class="button_wrapper">
					<div class="provider-name">{{ data.providerName }}</div>
					<div>
						<BaseButton
							v-if="data._id"
							styling="secondary"
							@click="dialog.active = true"
						>
							{{ $lang.buttons.open }}
						</BaseButton>
						<RouterLink
							v-if="readOnly != true"
							:to="{
								name: 'resourceManagement/edit',
								params: { id: data._id },
							}"
						>
							<BaseButton styling="secondary">
								{{ $lang.buttons.edit }}
							</BaseButton>
						</RouterLink>
					</div>
				</div>
			</template>
		</BaseCard>
		<BaseConfirm
			:active.sync="dialog.active"
			v-bind="dialog"
			@confirm="onConfirm"
		/>
	</article>
</template>

<script>
/* load confirmDialog async */
const BaseConfirm = () =>
	import(/* webpackChunkName: "BaseConfirm" */ "@/components/base/BaseConfirm");
import BaseCard from "@/components/base/BaseCard";
import BaseButton from "@/components/base/BaseButton";

export default {
	name: "ContentForm",
	components: {
		BaseButton,
		BaseCard,
		BaseConfirm,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
		readOnly: {
			type: Boolean,
			default: false,
		},
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
			window.open(
				this.$config.API.serverServerUrl +
					this.$config.API.viewContentPath +
					this.data._id,
				"_blank"
			);
		},
	},
};
</script>

<style lang="scss" scoped>
span {
	vertical-align: middle;
}
.tags {
	color: #999;
}
.button_wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
