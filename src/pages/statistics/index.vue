<template>
	<div>
		<h2 style="margin-bottom: 0" class="title">{{ $lang.stats.title }}</h2>
		<div class="subheading">{{ $lang.stats.article }}: {{ totalContent }}</div>
		<div class="subheading">{{ $lang.stats.most_clicked }}:</div>
		<div class="grid">
			<div
				v-for="item in mostClickedContent"
				:key="item.id"
				class="card-wrapper grid-xs-12 grid-s-6 grid-m-6 grid-l-4 grid-xl-4 height-100"
			>
				<b>{{ $lang.stats.clicks }}: {{ item.clickCount }}</b>
				<ContentCard :data="item" class="height-100" />
			</div>
		</div>
	</div>
</template>

<script>
const ContentCard = () => import("@/components/ContentCard.vue");

const qs = require("query-string");

export default {
	name: "ContentStats",
	components: {
		ContentCard,
	},
	data() {
		return {
			totalContent: 0,
			mostClickedContent: [],
		};
	},
	created() {
		this.getTotalContent();
		this.getMostClicked();
	},
	methods: {
		getTotalContent() {
			this.$http
				.get(
					this.$config.API.serverServerUrl + this.$config.API.getContentPath,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("jwt")}`,
						},
					}
				)
				.then((response) => {
					// JSON responses are automatically parsed.
					this.totalContent = response.data.total;
				})
				.catch((e) => {
					this.errors.push(e);
				});
		},
		getMostClicked() {
			// apiQuery
			const apiQuery = {
				"$sort[clickCount]": -1,
				$limit: 3,
			};
			const path = `${this.$config.API.getContentPath}?${qs.stringify(
				apiQuery
			)}`;
			this.$http
				.get(this.$config.API.serverServerUrl + path, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				})
				.then((response) => {
					// JSON responses are automatically parsed.
					this.mostClickedContent = response.data.data;
				})
				.catch((e) => {
					this.errors.push(e);
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.subheading {
	font-size: 16px;
}
.card-content {
	margin: 30px 5% 0 5%;
}
</style>
