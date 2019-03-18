<template>
	<tr
		id="contentForm"
		:class="{ changed: isDirty }"
		@submit.prevent="validateBeforeSubmit"
		@change="itemChanged"
	>
		<td>
			<MdField :class="{ 'md-input-invalid': errors.has('title') }">
				<MdInput v-model="contentData.title" type="text" />
				<span class="md-error">
					{{ errors.first("title") }}
				</span>
			</MdField>
		</td>
		<td>
			<MdField :class="{ 'md-input-invalid': errors.has('url') }">
				<MdInput v-model="contentData.url" />
				<span class="md-error">
					{{ errors.first("url") }}
				</span>
			</MdField>
		</td>
		<td class="hide-s">
			<MdField>
				<MdInput v-model="contentData.licenses" name="license" />
			</MdField>
		</td>
		<td class="hide-m">
			<MdField>
				<MdSelect
					id="contentCategory"
					v-model="contentData.contentCategory"
					name="contentCategory"
				>
					<MdOption value="" />
					<MdOption value="atomic">
						Atomic
					</MdOption>
					<MdOption value="interactive">
						Interactive
					</MdOption>
				</MdSelect>
			</MdField>
		</td>
		<td>
			<MdButton class="md-icon-button" @click="dialog.active = true">
				<MdIcon>delete</MdIcon>
			</MdButton>
			<ConfirmDialog :config="dialog" @confirm="deleteContent" />
			<MdButton class="md-icon-button md-primary" type="submit">
				<MdIcon>save</MdIcon>
			</MdButton>
		</td>
	</tr>
</template>

<script>
import Vue from "vue";

import VeeValidate from "vee-validate";

Vue.use(VeeValidate);

const ConfirmDialog = () =>
	import(/* webpackChunkName: "ConfirmDialog" */ "@/components/dialogs/confirm.vue");

export default {
	name: "ContentTableRow",
	components: {
		ConfirmDialog,
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
form {
	display: contents;
	td {
		padding: 0 8px;
		vertical-align: top;
		.md-field {
			min-height: initial;
			padding-top: 0;
			margin-top: 0;
		}
		&:last-of-type {
			width: 80px;
			white-space: nowrap;
		}
		.md-button {
			margin: 0;
		}
	}
}

.changed {
	background-color: lightgoldenrodyellow;
}
</style>
