<template>
	<div>
		<h2 style="margin-bottom: 0" class="title">{{ $lang.stats.title }}</h2>
		<div class="subheading">{{ $lang.stats.article }}: {{ totalContent }}</div>
		<lineChart :chartdata="importedResources" />
	</div>
</template>

<script>
import api from "@/mixins/api.js";
import lineChart from "@/components/statistics/lineChart";

export default {
	components: {
		lineChart,
	},
	mixins: [api],
	data() {
		return {
			importedResources: {
				labels: [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
				],
				datasets: [
					{
						label: "published Articles",
						backgroundColor: getComputedStyle(
							document.documentElement
						).getPropertyValue("--accentColor"),
						data: [40, 39, 10, 40, 39, 80, 40],
					},
				],
			},
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
