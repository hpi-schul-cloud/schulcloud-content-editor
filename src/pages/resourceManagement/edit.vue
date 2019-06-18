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

						<div v-show="data.isProtected">
							<BaseCheckbox
								v-model="data.drmOptions.pdfIsProtected"
								label="Pdf schützen?"
							/>
							<BaseCheckbox
								v-model="data.drmOptions.videoIsProtected"
								label="Video schützen?"
							/>
							<BaseCheckbox
								v-model="data.drmOptions.watermark"
								label="Wasserzeichen"
								@click.native="
									changeWatermarkPosition(
										data.drmOptions.xWatermarkPosition || undefined,
										data.drmOptions.yWatermarkPosition || undefined,
										data.drmOptions.watermarkBoxSize || undefined
									)
								"
							/>
							<div class="drm_options">
								<div v-show="data.drmOptions.watermark === true">
									<div class="watermark_positioning">
										<div>
											<input
												v-model="data.drmOptions.watermarkBoxSize"
												type="range"
												class="top_slider"
												min="10"
												max="100"
												@input="
													changeWatermarkPosition(
														data.drmOptions.xWatermarkPosition,
														data.drmOptions.yWatermarkPosition,
														data.drmOptions.watermarkBoxSize
													)
												"
											/>
										</div>
										<div class="pictur_box">
											<div id="watermark_box" ref="watermark_box"></div>
										</div>
										<div>
											<input
												v-model="data.drmOptions.yWatermarkPosition"
												type="range"
												class="vertical_slider"
												min="0"
												max="100"
												@input="
													changeWatermarkPosition(
														data.drmOptions.xWatermarkPosition,
														data.drmOptions.yWatermarkPosition,
														data.drmOptions.watermarkBoxSize
													)
												"
											/>
										</div>
										<input
											v-model="data.drmOptions.xWatermarkPosition"
											class="horizontal_slider"
											type="range"
											min="0"
											max="100"
											@input="
												changeWatermarkPosition(
													data.drmOptions.xWatermarkPosition,
													data.drmOptions.yWatermarkPosition,
													data.drmOptions.watermarkBoxSize
												)
											"
										/>
									</div>
									<BaseCheckbox
										v-model="data.drmOptions.watermarkExceedFrame"
										label="Watermark Exceed Frame"
									/>
									<ContentWatermarkSelector
										v-model="data.drmOptions.watermarkImage"
										v-validate
										data-vv-name="watermarkSelector"
										FIX-data-vv-rules="{required: true, url: {require_protocol: false, require_host: false, allow_protocol_relative_urls: true}}"
										:error="errors.first('watermarkSelector')"
										:disabled="filetree.objects.length === 0"
										:files="thumbnailFiles"
										:resource-id="$route.params.id || ''"
									/>
								</div>
								<ContentDrmOptions v-model="data.drmOptions" />
							</div>
						</div>
						<ContentHostingProvider v-model="hostingOption" />
						<template v-if="hostingOption === 'hostedExternally'">
							<ContentUrl
								v-model="data.url"
								v-validate="{ url: { require_host: false } }"
								:error="errors.first('url')"
								data-vv-rules="required|url"
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
								v-validate
								:error="errors.first('entrypointSelector')"
								:disabled="filetree.objects.length === 0"
								:files="entrypointFiles"
								:resource-id="$route.params.id || ''"
								data-vv-name="entrypointSelector"
								FIX-data-vv-rules="{required: true, url: {require_protocol: false, require_host: false, allow_protocol_relative_urls: true}}"
							/>
							<ContentThumbnailSelector
								v-show="hostingOption === 'hostedAtSchulcloud'"
								v-model="data.thumbnail"
								v-validate
								:error="errors.first('thumbnailSelector')"
								:disabled="filetree.objects.length === 0"
								:files="thumbnailFiles"
								:resource-id="$route.params.id || ''"
								data-vv-name="thumbnailSelector"
								FIX-data-vv-rules="{required: true, url: {require_protocol: false, require_host: false, allow_protocol_relative_urls: true}}"
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
							<BaseConfirm
								:active.sync="dialog.active"
								v-bind="dialog"
								@confirm="deleteContent"
							/>
							<BaseButton styling="secondary" @click="$router.go(-1)">
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
import ContentDrmOptions from "@/components/resourceManagement/edit/inputs/ContentDrmOptions";
import BaseButton from "@/components/base/BaseButton";
import BaseCard from "@/components/base/BaseCard";
import BaseCheckbox from "@/components/base/BaseCheckbox";
import ContentWatermarkSelector from "@/components/resourceManagement/edit/inputs/ContentWatermarkSelector";

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
		ContentDrmOptions,
		BaseButton,
		BaseCard,
		BaseCheckbox,
		BaseConfirm,
		ContentWatermarkSelector,

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
				providerId: "",
				url: "",
				title: "",
				description: "",
				thumbnail: "",
				contentCategory: "",
				licenses: ["Test License"],
				tags: [],
				drmOptions: {
					exif: {},
				},
				files: { delete: [], save: [] },
				isPublished: false,
				isProtected: undefined,
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
		data: {
			handler: function(to) {
				if (to.isProtected === undefined) {
					to.isProtected = this.getObjValues(this.data.drmOptions, []).some(
						(val) => val
					);
				}
			},
			deep: true,
		},
	},
	created() {
		this.data.providerId = this.userInfo.providerId;
		this.loadContent();
		this.loadFiletree();
	},
	methods: {
		allDataLoaded() {
			this.changeWatermarkPosition(
				this.data.drmOptions.xWatermarkPosition,
				this.data.drmOptions.yWatermarkPosition,
				this.data.drmOptions.watermarkBoxSize
			);
		},
		changeWatermarkPosition(
			xWatermarkPosition = 50,
			yWatermarkPosition = 50,
			watermarkBoxSize = 55
		) {
			this.data.drmOptions.xWatermarkPosition = xWatermarkPosition;
			this.data.drmOptions.yWatermarkPosition = yWatermarkPosition;
			this.data.drmOptions.watermarkBoxSize = watermarkBoxSize;

			watermarkBoxSize *= 2;
			this.$refs.watermark_box.style.height = watermarkBoxSize + "px";
			this.$refs.watermark_box.style.width = watermarkBoxSize + "px";
			xWatermarkPosition =
				(xWatermarkPosition / 100) * (200 - watermarkBoxSize);
			yWatermarkPosition =
				(yWatermarkPosition / 100) * (200 - watermarkBoxSize);

			let ypos = yWatermarkPosition - 4;
			let xpos = xWatermarkPosition - 4;

			this.$refs.watermark_box.style.transform =
				"translate(" + xpos + "px," + ypos + "px" + ")";
		},
		getObjValues(objs, returnArray) {
			let objArray = Object.values(objs);
			objArray.forEach((obj) => {
				if (!(typeof obj == "object")) {
					returnArray.push(obj);
				} else {
					this.getObjValues(obj, returnArray);
				}
			});
			return returnArray;
		},
		handleFiletreeUpdate(newFiletree) {
			this.filetree = newFiletree;
		},
		loadContent() {
			if (this.editMode) {
				return this.$_resourceGet(this.$route.params.id)
					.then((data) => {
						// JSON responses are automatically parsed.
						// this.data = data;
						Object.assign(this.data, data);
						this.hostingOption = (this.data.url || "").startsWith(
							this.$config.API.contentServerUrl + this.$config.API.hostingEntry
						)
							? "hostedAtSchulcloud"
							: "hostedExternally";
					})
					.then(() => {
						this.allDataLoaded();
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
.top_slider {
	width: 200px;
	height: 15px;
	background: #d3d3d3;
	border-radius: 5px;
	outline: none;
	opacity: 0.7;
	-webkit-transition: 0.2s;
	transition: opacity 0.2s;
	-webkit-appearance: none;
}
.vertical_slider {
	width: 200px;
	height: 15px;
	background: #d3d3d3;
	border-radius: 5px;
	outline: none;
	opacity: 0.7;
	-webkit-transition: 0.2s;
	transition: opacity 0.2s;
	transform: rotate(90deg) translate(92px, 87px);
	-webkit-appearance: none;
}
.horizontal_slider {
	width: 200px;
	height: 15px;
	background: #d3d3d3;
	border-radius: 5px;
	outline: none;
	opacity: 0.7;
	-webkit-transition: 0.2s;
	transition: opacity 0.2s;
	transform: translate(-203px, 185px);
	-webkit-appearance: none;
}
.drm_options {
	padding: 50px;
	margin: 20px;
	border: 3px solid grey;
}
.pictur_box {
	position: relative;
	float: left;
	width: 200px;
	height: 200px;
	border: 3px solid grey;
}
#watermark_box {
	position: absolute;
	width: 40px;
	height: 40px;
	margin-top: 0;
	margin-left: 0;
	border: 3px solid grey;
}

.watermark_positioning {
	width: 500px;
	height: 250px;
	overflow: hidden;
}

.third {
	position: relative;
	top: 100px;
	width: 100px;
}
.vertical_slider::-webkit-slider-thumb {
	width: 25px;
	height: 25px;
	cursor: pointer;
	background: rgb(76, 160, 175);
	border-radius: 50%;
	-webkit-appearance: none;
	appearance: none;
}
.top_slider::-webkit-slider-thumb {
	width: 25px;
	height: 25px;
	cursor: pointer;
	background: rgb(76, 160, 175);
	border-radius: 50%;
	-webkit-appearance: none;
	appearance: none;
}
.horizontal_slider::-webkit-slider-thumb {
	width: 25px;
	height: 25px;
	cursor: pointer;
	background: rgb(76, 160, 175);
	border-radius: 50%;
	-webkit-appearance: none;
	appearance: none;
}
</style>
