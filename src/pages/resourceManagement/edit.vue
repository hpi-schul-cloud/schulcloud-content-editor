<template>
	<div class="container">
		<div id="content-card">
			<form id="contentForm" @submit.prevent="validateBeforeSubmit">
				<BaseCard>
					<template slot="head">
						<div v-if="editMode" class="title">{{ $lang.edit.title_edit }}</div>
						<div v-else class="title">{{ $lang.edit.title_create }}</div>
					</template>
					<template slot="body">
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
						<ContentLicense v-model="data.licenses" />
						<ContentCategory v-model="data.contentCategory" />
						<ContentMimetype v-model="data.mimeType" />
						<ContentTags v-model="data.tags" />
						<h3>Inhalte</h3>
						<div class="wrapper">
							<h4 class="subtitle">Inhalte veröffentlichen?</h4>
							<BaseCheckbox
								v-model="data.isPublished"
								label="published"
							></BaseCheckbox>
						</div>
						<ContentHostingProvider v-model="hostingOption" />
						<template v-if="hostingOption === 'hostedExternally'">
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
						</template>
						<template>
							<ContentEntrypointSelector
								v-show="hostingOption === 'hostedAtSchulcloud'"
								v-model="data.url"
								v-validate
								data-vv-name="entrypointSelector"
								FIX-data-vv-rules="{required: true, url: {require_protocol: false, require_host: false, allow_protocol_relative_urls: true}}"
								:error="errors.first('entrypointSelector')"
								:disabled="filetree.objects.length === 0"
								:files="entrypointFiles"
								:resource-id="$route.params.id || ''"
							/>
							<ContentThumbnailSelector
								v-show="hostingOption === 'hostedAtSchulcloud'"
								v-model="data.thumbnail"
								v-validate
								data-vv-name="thumbnailSelector"
								FIX-data-vv-rules="{required: true, url: {require_protocol: false, require_host: false, allow_protocol_relative_urls: true}}"
								:error="errors.first('thumbnailSelector')"
								:disabled="filetree.objects.length === 0"
								:files="thumbnailFiles"
								:resource-id="$route.params.id || ''"
							/>
							<FileUpload
								v-show="hostingOption === 'hostedAtSchulcloud'"
								:value="data.files"
								:filetree="filetree"
								@update:filetree="handleFiletreeUpdate($event)"
								@update="data.files = $event"
							/>
						</template>
					</template>
					<template slot="footer">
						<div class="button_wrapper">
							<BaseButton
								v-if="$route.params.id"
								styling="secondary"
								@click="dialog.active = true"
							>
								{{ $lang.buttons.delete }}
							</BaseButton>
							<ConfirmDialog :config="dialog" @confirm="deleteContent" />
							<BaseButton styling="secondary" @click="$router.go(-1)">
								{{ $lang.buttons.cancel }}
							</BaseButton>
							<BaseButton
								form="contentForm"
								type="submit"
								:disabled="!isFormValid"
							>
								{{ $lang.buttons.save }}
							</BaseButton>
						</div>
					</template>
				</BaseCard>
			</form>
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

import ContentCard from "@/components/ContentCard.vue";

const ConfirmDialog = () =>
	import(/* webpackChunkName: "ConfirmDialog" */ "@/components/dialogs/Confirm.vue");

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
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";

import filetree from "@/mixins/filetree.js";
import api from "@/mixins/api.js";

import FileUpload from "@/components/Upload.vue";

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
		BaseCheckbox,

		FileUpload,
	},
	mixins: [api, filetree],
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
				isPublished: false,
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
				return this.$_resourceGet(this.$route.params.id)
					.then((data) => {
						// JSON responses are automatically parsed.
						this.data = data;
						this.hostingOption = (this.data.url || "").startsWith(
							this.$config.API.contentServerUrl + this.$config.API.hostingEntry
						)
							? "hostedAtSchulcloud"
							: "hostedExternally";
					})
					.catch((e) => {
						this.errors.add(e);
					});
			}
		},
		loadFiletree() {
			if (this.editMode) {
				this.$_resourceFilesGet(this.$route.params.id)
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
			// deep copy to remove reactivity
			const newData = JSON.parse(JSON.stringify(this.data));
			newData.patchResourceUrl =
				this.hostingOption === "hostedAtSchulcloud" &&
				!newData.url.startsWith("http");

			const request = this.editMode
				? $_resourcePatch(newData)
				: $_resourceCreate(newData);
			return request.then(() => {
				this.$router.push({ name: "resourceManagement" });
			});
		},
		deleteContent() {
			return this.$_resourceDelete(this.$route.params.id).then(() => {
				this.$router.push({ name: "resourceManagement" });
			});
		},
	},
};
</script>

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

.subtitle {
	margin: 0;
	font-size: 0.9em;
	font-weight: 500;
}

.button_wrapper {
	display: flex;
	justify-content: space-between;
}
</style>
