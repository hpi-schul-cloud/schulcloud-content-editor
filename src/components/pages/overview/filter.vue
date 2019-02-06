<template>
	<div class="filter">
		<MdChip
			v-for="chip in activeFilter"
			:key="chip[0]"
			v-model="activeFilter"
			md-clickable
			md-deletable
			@click="visibleProvider = chip[0]"
			@md-delete.stop="removeFilter(chip[0], true)"
			>{{ chip[1].displayString }}</MdChip
		>

		<MdMenu md-direction="bottom-end">
			<MdButton md-menu-trigger>
				<MdIcon> <i class="material-icons">add</i> </MdIcon>FILTER HINZUFÜGEN
			</MdButton>
			<MdMenuContent>
				<MdMenuItem
					v-if="!isApplied('provider')"
					@click="visibleProvider = 'provider'"
					>Provider</MdMenuItem
				>
				<MdMenuItem
					v-if="!isApplied('createdat')"
					@click="visibleProvider = 'createdat'"
					>Erstellt am</MdMenuItem
				>
			</MdMenuContent>
		</MdMenu>

		<ProviderFilterDialog
			identifier="provider"
			:active="visibleProvider == 'provider'"
			@set="setFilter"
			@cancle="cancle"
		/>
		<CreatedatFilterDialog
			identifier="createdat"
			:active="visibleProvider == 'createdat'"
			@set="setFilter"
			@cancle="cancle"
		/>
	</div>
</template>

<script>
import ProviderFilterDialog from "@/components/dialogs/filter/provider.vue";
import CreatedatFilterDialog from "@/components/dialogs/filter/date.vue";

export default {
	name: "SearchFilter",
	components: {
		ProviderFilterDialog,
		CreatedatFilterDialog,
	},
	data() {
		return {
			visibleProvider: "",
			activeFilter: [],
		};
	},
	watch: {
		activeFilter() {
			this.sendNewQuery();
		},
	},
	methods: {
		setFilter(identifier, filterData) {
			this.visibleProvider = "";

			filterData = JSON.parse(JSON.stringify(filterData)); // deep copy

			this.removeFilter(identifier, false);
			this.activeFilter.push([identifier, filterData]);
		},
		removeFilter(key, emit) {
			this.activeFilter = this.activeFilter.filter((item) => item[0] != key);
			if (emit) {
				this.$emit("reset", key);
			}
		},
		cancle() {
			this.visibleProvider = "";
		},
		sendNewQuery() {
			const apiQuery = {};
			const urlQuery = {};
			this.activeFilter.forEach((value) => {
				Object.assign(apiQuery, value[1].apiQuery);
				Object.assign(urlQuery, value[1].urlQuery);
			}, {});
			this.$emit("newFilter", apiQuery, urlQuery);
		},
		isApplied(identifier) {
			return this.activeFilter.map((i) => i[0]).includes(identifier);
		},
	},
};
</script>
