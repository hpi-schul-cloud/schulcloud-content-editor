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
							:error="errors.first('title')"
							data-vv-name="title"
							data-vv-rules="required"
						/>
						<ContentDescription
							v-model="data.description"
							v-validate
							:error="errors.first('description')"
							data-vv-name="description"
							data-vv-rules="max:500|required"
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
						<div class="wrapper">
							<h4 class="subtitle">Inhalte schützen?</h4>
							<BaseCheckbox
								v-model="data.isProtected"
								label="Inhalte schützen?"
							/>
						</div>
						<ContentHostingProvider v-model="hostingOption" />
						<template v-if="hostingOption === 'hostedExternally'">
							<ContentUrl
								v-model="data.url"
								v-validate="{ required: true, url: { require_host: false } }"
								:error="errors.first('url')"
								data-vv-name="url"
							/>
							<ContentUrlThumbnail
								v-model="data.thumbnail"
								v-validate="{ url: { require_host: false } }"
								:error="errors.first('thumbnail')"
								data-vv-name="thumbnail"
							/>
						</template>
						<template>
							<ContentEntrypointSelector
								v-show="hostingOption === 'hostedAtSchulcloud'"
								v-model="data.url"
								v-validate="{ required: true, url: { require_host: false } }"
								:error="errors.first('entrypointSelector')"
								:disabled="filetree.objects.length === 0"
								:files="entrypointFiles"
								:resource-id="$route.params.id || ''"
								data-vv-name="entrypointSelector"
							/>
							<ContentThumbnailSelector
								v-show="hostingOption === 'hostedAtSchulcloud'"
								v-model="data.thumbnail"
								v-validate="{
									required: true,
									url: {
										require_host: false,
									},
								}"
								:error="errors.first('thumbnailSelector')"
								:disabled="filetree.objects.length === 0"
								:files="thumbnailFiles"
								:resource-id="$route.params.id || ''"
								data-vv-name="thumbnailSelector"
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
								@click="dialog.active = true"
								styling="secondary"
							>
								{{ $lang.buttons.delete }}
							</BaseButton>
							<BaseConfirm
								:active.sync="dialog.active"
								v-bind="dialog"
								@confirm="deleteContent"
							/>
							<BaseButton @click="$router.go(-1)" styling="secondary">
								{{ $lang.buttons.cancel }}
							</BaseButton>
							<BaseButton
								:disabled="!isFormValid"
								form="contentForm"
								type="submit"
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

import ContentCard from "@/components/resourceManagement/edit/ContentCard";
const BaseConfirm = () => import("@/components/base/BaseConfirm");

import ContentTitle from "@/components/resourceManagement/edit/inputs/ContentTitle";
import ContentDescription from "@/components/resourceManagement/edit/inputs/ContentDescription";
import ContentUrl from "@/components/resourceManagement/edit/inputs/ContentUrl";
import ContentUrlThumbnail from "@/components/resourceManagement/edit/inputs/ContentUrlThumbnail";
import ContentLicense from "@/components/resourceManagement/edit/inputs/ContentLicense";
import ContentCategory from "@/components/resourceManagement/edit/inputs/ContentCategory";
import ContentMimetype from "@/components/resourceManagement/edit/inputs/ContentMimetype";
import ContentTags from "@/components/resourceManagement/edit/inputs/ContentTags";
import ContentHostingProvider from "@/components/resourceManagement/edit/inputs/ContentHostingProvider";
import ContentEntrypointSelector from "@/components/resourceManagement/edit/inputs/ContentEntrypointSelector";
import ContentThumbnailSelector from "@/components/resourceManagement/edit/inputs/ContentThumbnailSelector";
import BaseButton from "@/components/base/BaseButton";
import BaseCard from "@/components/base/BaseCard";
import BaseCheckbox from "@/components/base/BaseCheckbox";

import filetree from "@/mixins/filetree.js";
import api from "@/mixins/api.js";
import { mapGetters } from "vuex";

import FileUpload from "@/components/resourceManagement/edit/fileUpload/Upload";

export default {
	components: {
		ContentCard,
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
		BaseConfirm,

		FileUpload,
	},
	mixins: [api, filetree],
	props: {
		editMode: Boolean,
	},
	data() {
		return {
			data: {
				originId: Date.now().toString(), // TODO FIX
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
				isProtected: false,
			},
			dialog: {
				active: false,
				title: this.$lang.edit.dialog.title,
				content: this.$lang.edit.dialog.content,
				confirmText: this.$lang.edit.dialog.confirm,
				cancelText: this.$lang.edit.dialog.cancle,
			},
			filetree: { objects: [] },
			hostingOption: "",
		};
	},
	computed: {
		...mapGetters("user", {
			userInfo: "GET_USER",
		}),
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
				return this.$_resourceFilesGet(this.$route.params.id)
					.then((response) => {
						this.filetree = this.$_normalizeTree(response);
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
			const request = this.editMode
				? this.$_resourcePatch(newData)
				: this.$_resourceCreate(newData);
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
