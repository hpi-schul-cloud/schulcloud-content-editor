<template>
	<div md-gutter class="container-fluid grid">
		<div class="grid-xl-8 grid-s-12">
			<MdCard>
				<MdCardHeader>
					<div v-if="$route.params.id" class="md-title">
						{{ $lang.edit.title_edit }}
					</div>
					<div v-else class="md-title">{{ $lang.edit.title_create }}</div>
				</MdCardHeader>
				<MdCardContent>
					<form id="contentForm" @submit.prevent="validateBeforeSubmit">
						{{ data }}
						<ContentTitle
							v-model="data.title"
							v-validate
							data-vv-name="title"
							data-vv-rules="required"
							:error="errors.first('title')"
						/>
						<ContentDescription
							v-model="data.description"
							v-validate
							data-vv-name="description"
							data-vv-rules="max:500"
							:error="errors.first('description')"
						/>
						<ContentUrl
							v-model="data.url"
							v-validate
							data-vv-name="url"
							data-vv-rules="required|url"
							:error="errors.first('url')"
						/>
						<ContentUrlThumbnail
							v-model="data.thumbnail"
							v-validate
							data-vv-name="thumbnail"
							data-vv-rules="url"
							:error="errors.first('thumbnail')"
						/>
						<ContentLicense v-model="data.licenses" />
						<ContentCategory v-model="data.categorie" />
						<ContentMimetype v-model="data.mimeType" />
						<ContentTags v-model="data.tags" />
					</form>
				</MdCardContent>
				<FileUpload :filetree.sync="filetree" />
				<MdCardActions>
					<MdButton
						v-if="$route.params.id"
						class="delete"
						@click="dialog.active = true"
						>{{ $lang.buttons.delete }}</MdButton
					>
					<ConfirmDialog :config="dialog" @confirm="deleteContent" />
					<MdButton style="color: initial;" @click="$router.go(-1)">{{
						$lang.buttons.cancel
					}}</MdButton>
					<MdButton
						class="md-primary"
						type="submit"
						form="contentForm"
						:disabled="!isFormValid"
						>{{ $lang.buttons.save }}</MdButton
					>
				</MdCardActions>
			</MdCard>
		</div>
		<div class="grid-xl-4 grid-s-12">
			<div class="preview-wrapper">
				<h2>{{ $lang.edit.livepreview }}:</h2>
				<ContentCard :data="data" :read-only="true" />
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import VeeValidate from "vee-validate";

Vue.use(VeeValidate);

import ContentCard from "@/components/base/contentCard.vue";

const ConfirmDialog = () =>
	import(/* webpackChunkName: "ConfirmDialog" */ "@/components/dialogs/confirm.vue");

import ContentTitle from "@/components/inputs/ContentTitle.vue";
import ContentDescription from "@/components/inputs/ContentDescription.vue";
import ContentUrl from "@/components/inputs/ContentUrl.vue";
import ContentUrlThumbnail from "@/components/inputs/ContentUrlThumbnail.vue";
import ContentLicense from "@/components/inputs/ContentLicense.vue";
import ContentCategory from "@/components/inputs/ContentCategory.vue";
import ContentMimetype from "@/components/inputs/ContentMimetype.vue";
import ContentTags from "@/components/inputs/ContentTags.vue";

import FileUpload from "@/components/base/upload.vue";

export default {
	name: "ContentForm",
	components: {
		ContentCard,
		ConfirmDialog,
		ContentTitle,
		ContentDescription,
		ContentUrl,
		ContentUrlThumbnail,
		ContentLicense,
		ContentCategory,
		ContentMimetype,
		ContentTags,

		FileUpload,
	},
	props: {
		editMode: Boolean,
	},
	data() {
		return {
			data: {
				providerName: "",
				url: "",
				title: "",
				description: "",
				thumbnail: "",
				contentCategory: "",
				licenses: ["Test License"],
				tags: [],
			},
			dialog: {
				active: false,
				title: this.$lang.edit.dialog.title,
				content: this.$lang.edit.dialog.content,
				confirm: this.$lang.edit.dialog.confirm,
				cancle: this.$lang.edit.dialog.cancle,
			},
			userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
			filetree: [
				{
					id: "file1_id",
					type: "file",
					name: "file 1",
				},
				{
					id: "folder1_id",
					type: "folder",
					name: "folder 1",
					objects: [
						{
							id: "file2_id",
							type: "file",
							name: "file 2",
						},
						{
							id: "folder1_id/folder2_id",
							type: "folder",
							name: "folder 2",
							objects: [
								{
									id: "file3_id",
									type: "file",
									name: "file 3",
								},
							],
						},
						{
							id: "file4_id",
							type: "file",
							name: "file 4",
						},
					],
				},
			],
		};
	},
	computed: {
		isFormValid() {
			return Object.keys(this.fields).every((key) => this.fields[key].valid);
		},
	},
	watch: {
		$route() {
			this.loadContent();
		},
	},
	created() {
		this.loadContent();
	},
	methods: {
		loadContent() {
			if (this.editMode) {
				this.$http
					.get(
						this.$config.API.serverServerUrl +
							this.$config.API.getContentPath +
							this.$route.params.id,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("jwt")}`,
							},
						}
					)
					.then((response) => {
						// JSON responses are automatically parsed.
						this.data = response.data;
					})
					.catch((e) => {
						this.errors.push(e);
					});
			}
		},
		validateBeforeSubmit() {
			if (this.isFormValid) {
				this.submitContent();
			}
		},
		submitContent() {
			const d = this.data;
			const newData = {
				providerName: d.providerName,
				url: d.url,
				title: d.title,
				description: d.description,
				thumbnail: d.thumbnail,
				contentCategory: d.contentCategory,
				licenses: d.licenses,
				tags: d.tags,
				mimeType: d.mimeType,
			};
			let request;
			if (this.$route.params.id) {
				request = this.$http.patch(
					this.$config.API.contentServerUrl +
						this.$config.API.pushContentPath +
						this.$route.params.id,
					newData,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("jwt")}`,
						},
					}
				);
			} else {
				newData.originId = Date.now().toString();
				request = this.$http.post(
					this.$config.API.contentServerUrl + this.$config.API.pushContentPath,
					newData,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("jwt")}`,
						},
					}
				);
			}
			request.then(() => {
				this.$router.push({ path: "/" });
			});
		},
		deleteContent() {
			this.$http
				.delete(
					this.$config.API.contentServerUrl +
						this.$config.API.pushContentPath +
						this.$route.params.id,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("jwt")}`,
						},
					}
				)
				.then(() => {
					this.$router.push({ path: "/" });
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.container-fluid {
	max-width: 1000px;
	padding: 30px 16px;
}
.gutter > div {
	padding: 5px;
}

.md-card {
	width: 100%;
}

.preview-wrapper {
	display: block;
	width: 100%;
}

textarea {
	min-height: 12rem !important;
}

.md-card-actions {
	.delete {
		position: absolute;
		left: 8px;
	}
}
</style>
