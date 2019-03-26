<template>
	<tr
		id="contentForm"
		:class="{ changed: isDirty }"
		@submit.prevent="validateBeforeSubmit"
		@change="itemChanged"
	>
		<td>
			<ContentTitle
				v-model="contentData.title"
				v-validate
				data-vv-name="title"
				data-vv-rules="required"
				:without-label="true"
				:error="errors.first('title')"
			/>
		</td>
		<td>
			<ContentUrl
				v-model="contentData.url"
				v-validate
				data-vv-name="url"
				data-vv-rules="required|url"
				:without-label="true"
				:error="errors.first('url')"
			/>
		</td>
		<td class="hide-s">
			<ContentLicense v-model="contentData.licenses" :without-label="true" />
		</td>
		<td class="hide-m">
			<ContentCategory
				v-model="contentData.contentCategory"
				:without-label="true"
			/>
		</td>
		<td>
			<BaseButton
				:secondary="true"
				:round-shape="true"
				@ButtonClicked="dialog.active = true"
			>
				<img src="@/assets/icon-delete.svg" />
			</BaseButton>
			<ConfirmDialog :config="dialog" @confirm="deleteContent" />
			<BaseButton
				type="submit"
				:round-shape="true"
				@ButtonClicked="submitContent"
			>
				<img src="@/assets/icon-save.svg" />
			</BaseButton>
		</td>
	</tr>
</template>

<script>
import Vue from "vue";

import VeeValidate from "vee-validate";
import ContentTitle from "@/components/inputs/ContentTitle.vue";
import ContentUrl from "@/components/inputs/ContentUrl.vue";
import ContentLicense from "@/components/inputs/ContentLicense.vue";
import ContentCategory from "@/components/inputs/ContentCategory.vue";
import BaseButton from "@/components/base/BaseButton.vue";

Vue.use(VeeValidate);

const ConfirmDialog = () =>
	import(/* webpackChunkName: "ConfirmDialog" */ "@/components/dialogs/confirm.vue");

export default {
	name: "ContentTableRow",
	components: {
		ConfirmDialog,
		ContentTitle,
		ContentUrl,
		ContentLicense,
		BaseButton,
		ContentCategory,
	},
	props: {
		contentData: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			isDirty: false,
			dialog: {
				active: false,
				title: this.$lang.edit.dialog.title,
				content: this.$lang.edit.dialog.content,
				confirm: this.$lang.edit.dialog.confirm,
				cancle: this.$lang.edit.dialog.cancle,
			},
		};
	},
	watch: {
		"data.contentCategory": function() {
			this.itemChanged();
		},
		"data.licenses": function() {
			this.itemChanged();
		},
	},
	methods: {
		required(item) {
			return item && item != "";
		},
		isUrl(item) {
			return item.match(
				/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi
			);
		},
		maxLength(text, length) {
			return text.length <= length;
		},
		validateBeforeSubmit() {
			if (
				this.isUrl(this.contentData.url) &&
				this.required(this.contentData.title)
			) {
				alert("Form Submitted!");
				this.submitContent();
				return;
			}
			alert("Correct the errors!");
		},
		submitContent() {
			this.clearItemChanged();

			if (this.$route.params.id) {
				this.$http.patch(
					this.$config.API.contentServerUrl +
						this.$config.API.pushContentPath +
						this.contentData._id,
					this.contentData,
					{
						headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
					}
				);
			} else {
				this.$http.post(
					this.$config.API.contentServerUrl + this.$config.API.pushContentPath,
					this.contentData,
					{
						headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
					}
				);
			}
		},
		itemChanged() {
			this.isDirty = true;
		},
		clearItemChanged() {
			this.isDirty = false;
		},
		deleteContent() {
			this.clearItemChanged();
			this.$http
				.delete(
					this.$config.API.contentServerUrl +
						this.$config.API.pushContentPath +
						this.contentData._id,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("jwt")}`,
						},
					}
				)
				.then(() => {
					this.$router.push({ path: "/" });
				});
			this.$emit("delete", this.contentData._id);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
td {
	width: 200px;
	padding: 0 8px;
	vertical-align: top;

	&:last-of-type {
		width: 80px;
		white-space: nowrap;
	}
}

.changed {
	background-color: lightgoldenrodyellow;
}
</style>
