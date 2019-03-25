<template>
	<div class="container">
		<div id="content-card">
			<BaseCard>
				<template slot="head">
					<div v-if="editMode" class="title">
						{{ $lang.edit.title_edit }}
					</div>
					<div v-else class="title">{{ $lang.edit.title_create }}</div>
				</template>
				<template slot="content">
					<form id="contentForm" @submit.prevent="validateBeforeSubmit">
						<h3>Metadaten</h3>
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
							data-vv-rules="max:500|required"
							:error="errors.first('description')"
						/>
						<ContentUrlThumbnail
							v-model="data.thumbnail"
							v-validate
							data-vv-name="thumbnail"
							data-vv-rules="url"
							:error="errors.first('thumbnail')"
						/>
						<ContentLicense v-model="data.licenses" />
						<ContentCategory v-model="data.contentCategory" />
						<ContentMimetype v-model="data.mimeType" />
						<ContentTags v-model="data.tags" />
						<h3>Inhalte</h3>
						<ContentHostingProvider v-model="hostingOption" />
						<ContentUrl
							v-show="hostingOption === 'hostedExternally'"
							v-model="data.url"
							v-validate
							data-vv-name="url"
							data-vv-rules="required|url"
							:error="errors.first('url')"
						/>
						<ContentEntrypointSelector
							v-show="hostingOption === 'hostedAtSchulcloud'"
							v-model="data.url"
							v-validate
							data-vv-name="entrypointSelector"
							data-vv-rules="required|url"
							:error="errors.first('entrypointSelector')"
							:disabled="filetree.objects.length === 0"
							:files="entrypointFiles"
							:content-id="$route.params.id || ''"
						/>
						<ContentThumbnailSelector
							v-show="hostingOption === 'hostedAtSchulcloud'"
							v-model="data.thumbnail"
							v-validate
							data-vv-name="thumbnailSelector"
							data-vv-rules="required|url"
							:error="errors.first('thumbnailSelector')"
							:disabled="filetree.objects.length === 0"
							:files="thumbnailFiles"
							:content-id="$route.params.id || ''"
						/>
						<FileUpload
							v-show="hostingOption === 'hostedAtSchulcloud'"
							:value="data.files"
							:filetree="filetree"
							@update:filetree="handleFiletreeUpdate($event)"
							@update="data.files = $event"
						/>
						<button
							ref="submitButton"
							style="display:none"
							type="submit"
						></button>
					</form>
				</template>
				<template slot="footer">
					<div class="button_wrapper">
						<BaseButton
							v-if="$route.params.id"
							:secondary="true"
							@ButtonClicked="dialog.active = true"
						>
							{{ $lang.buttons.delete }}
						</BaseButton>
						<ConfirmDialog :config="dialog" @confirm="deleteContent" />
						<BaseButton :secondary="true" @ButtonClicked="$router.go(-1)">
							{{ $lang.buttons.cancel }}
						</BaseButton>
						<BaseButton
							form="contentForm"
							type="submit"
							:disabled="!isFormValid"
							@ButtonClicked="$refs.submitButton.click()"
						>
							{{ $lang.buttons.save }}
						</BaseButton>
					</div>
				</template>
			</BaseCard>
		</div>
		<div id="preview-card">
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

import ContentCard from "@/components/contentCard.vue";

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
import ContentHostingProvider from "@/components/inputs/ContentHostingProvider.vue";
import ContentEntrypointSelector from "@/components/inputs/ContentEntrypointSelector.vue";
import ContentThumbnailSelector from "@/components/inputs/ContentThumbnailSelector.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseCard from "@/components/base/BaseCard.vue";

import filetree from "@/mixins/filetree.js";

import FileUpload from "@/components/upload.vue";

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
		ContentHostingProvider,
		ContentEntrypointSelector,
		ContentThumbnailSelector,
		BaseButton,
		BaseCard,

		FileUpload,
	},
	mixins: [filetree],
	props: {
		editMode: Boolean,
	},
	data() {
		return {
			data: {
				providerName: "Cornelsen",
				url: "",
				title: "",
				description: "",
				thumbnail: "",
				contentCategory: "",
				licenses: ["Test License"],
				tags: [],
				files: { delete: [], save: [] },
			},
			dialog: {
				active: false,
				title: this.$lang.edit.dialog.title,
				content: this.$lang.edit.dialog.content,
				confirm: this.$lang.edit.dialog.confirm,
				cancle: this.$lang.edit.dialog.cancle,
			},
			userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
			filetree: { objects: [] },
			hostingOption: "",
		};
	},
	computed: {
		isFormValid() {
			return Object.keys(this.fields).every((key) => this.fields[key].valid);
		},
		entrypointFiles() {
			return this.filetree.objects
				.filter((file) => {
					return file.type === "file";
				})
				.map((file) => {
					return file.name;
				});
		},
		thumbnailFiles() {
			return this.filetree.objects
				.filter((file) => {
					return (
						file.type === "file" &&
						file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
					);
				})
				.map((file) => {
					return file.name;
				});
		},
	},
	watch: {
		$route() {
			this.loadContent();
		},
	},
	created() {
		this.loadContent();
		this.loadFiletree();
	},
	methods: {
		handleFiletreeUpdate(newFiletree) {
			this.filetree = newFiletree;
		},
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
						this.data = response.body;
						this.hostingOption = (this.data.url || "").startsWith(
							this.$config.API.contentServerUrl + this.$config.API.hostingEntry
						)
							? "hostedAtSchulcloud"
							: "hostedAtSchulcloud";
					})
					.catch((e) => {
						this.errors.add(e);
					});
			}
		},
		loadFiletree() {
			if (this.editMode) {
				this.$http
					.get(
						this.$config.API.contentServerUrl +
							this.$config.API.getFiletreePath +
							this.$route.params.id,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("jwt")}`,
							},
						}
					)
					.then((response) => {
						// JSON responses are automatically parsed.
						this.filetree = this.$_normalizeTree(response.data);
					})
					.catch((e) => {
						this.errors.add(e);
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
				files: d.files,
			};
			let request;
			if (this.editMode) {
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
.container {
	display: flex;
	max-width: 1000px;
	margin: 1em auto;
}

#content-card {
	flex: 2;
	margin-right: 1em;
}

#preview-card {
	flex: 1;
}

.preview-wrapper {
	display: block;
	width: 100%;
}

h3 {
	margin: 2.5em 0 0.5em 0;
	&:first-of-type {
		margin-top: 0;
	}
}

.button_wrapper {
	display: flex;
	justify-content: space-between;
}
</style>
