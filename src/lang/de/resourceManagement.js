const search = {
	searchbar: {
		label: "Suche nach Inhalten",
		placeholder: "Zentripetalkraft",
	},
	number_of_found_items: "Einträge gefunden",
	nothing_found: "keine Ergebnisse gefunden",
	nothing_found_help:
		"Probiere es mit einem anderen Schlüsselwort oder anderen Filtern erneut.",
};

const bulk = {
	enableBulkEdit: "Massenbearbeitung",
	enableBulkEditAdvanced: "Erweiterten Modus aktivieren",
	replace: "Ersetzen",
	search: "Suchen",
	visibleColoumns: "Sichtbare Spalten",
	wip: "Verarbeite Anfrage",
	confirmPatch: (n) => `${n} Resource${n ? "n" : ""} bearbeiten?`,
	confirmDelete: (n) => `${n} Resource${n ? "n" : ""} löschen?`,
};

export default {
	create: "Inhalt erstellen",
	import: "Inhalte importieren",
	search,
	bulk,
};
