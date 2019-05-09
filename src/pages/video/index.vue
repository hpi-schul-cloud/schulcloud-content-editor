<template>
	<div class="Play">
		<h3>Play {{ name }}</h3>
		<div class="playbody">
			<div id="playerhost" />
		</div>
		<ul v-if="errors && errors.length">
			<li v-for="error of errors" :key="error.message">
				{{ error.message }}
			</li>
		</ul>
	</div>
</template>

<script>
import axios from "axios";
import Mgplay from "@mediagoom/play";
let mgp = new Mgplay();

export default {
	name: "Play",
	props: ["mediaid", "idx"],
	data() {
		return {
			status: null,
			name: null,
			id: null,
			owner: null,
			hls3: null,
			dash: null,
			thumb: [],
			hls4: null,
			playready: null,
			widevine: null,
			errors: [],
			play() {
				alert(this.dash);
			},
		};
	},
	// Fetches assets when the component is created.
	created() {
		// axios.get(`/api/status/$(this.mediaid)`)
		let route = this.getRoute();
		axios
			.get("/" /*Berechtigungsprüfung*/)
			.then((response) => {
				// JSON responses are automatically parsed.
				let standard = {
					data: {
						status: "ok",
						owner: "uploader",
						hls3: "STATIC/main.m3u8",
						dash: "STATIC/index.mpd",
						thumb: ["img001.jpg", "img002.jpg"],
					},
				};

				this.status = standard.data.status;
				this.owner = standard.data.owner;
				this.dash = standard.data.dash;
				this.hls3 = standard.data.hls3;
				this.thumb = standard.data.thumb;
				this.id = route.query.videoId;
				this.name = route.query.videoId;
				mgp.play(
					"http:" +
						"//" +
						"localhost:3000" +
						"/play/" +
						this.owner +
						"/" +
						this.id +
						"/",
					standard.data
				);

				// alert(JSON.stringify(this.assets));
			})
			.catch((e) => {
				this.errors.push(e);
			});
	},
	methods: {
		getRoute: function() {
			return this.$route;
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
