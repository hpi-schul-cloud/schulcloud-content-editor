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
				<pre>{{ JSON.stringify(item, null, 2) }}</pre>
			</div>
		</div>
	</div>
</template>

<script>
import api from "@/mixins/api.js";

export default {
	mixins: [api],
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
			return this.$_resourceGet()
				.then((data) => {
					// JSON responses are automatically parsed.
					this.totalContent = data.total;
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
			return this.$_resourceFind(apiQuery)
				.then((data) => {
					// JSON responses are automatically parsed.
					this.mostClickedContent = data.data;
				})
				.catch((e) => {
					this.errors.push(e);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.subheading {
	font-size: 16px;
}
.card-content {
	margin: 30px 5% 0 5%;
}
</style>
