<template>
    <div>
        <slot
            name="input"
            :context="context"
            :actions="{ selectItemFromList, shiftResultsSelection, unshiftResultsSelection }"
            :events="{ inputHasReceivedFocus, inputHasChanged }"
        >
            <input
                type="text"
                v-model="context.input"
                @focus="inputHasReceivedFocus"
                @input="inputHasChanged"
                @keydown.enter.prevent="selectItemFromList"
                @keydown.down.prevent="shiftResultsSelection"
                @keydown.up.prevent="unshiftResultsSelection"
            >
        </slot>
        <ul v-if="hasResults">
            <li
                v-for="(result, index) in autocomplete.results"
                :class="{ highlighted: index === autocomplete.resultsHighlight }"
                :key="result.id"
                @click="resultHasBeenSelected(result)"
            >
                <slot name="item" :place="result">
                    {{ result.description }}
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

    name: "GooglePlacesAutocomplete",

    data() {
        return {
            autocomplete: {
                service: null,
                sessionToken: null,
                results: [],
                resultsHighlight: 0,
                status: null,
                selected: {},
            },
            context: {
                input: '',
                disableSearch: false,
            },
        }
    },

    props: {

        bounds: {
            type: Object,
            required: false,
            default: null,
        },

    },

    computed: {

        hasResults() {
            return this.autocomplete.results.length > 0
        },

        searchValue() {
            return this.context.input
        },

    },

    watch: {

        searchValue(newValue, oldValue) {
            if (newValue || !oldValue) return

            this.$emit('resultCleared')
        },

    },

    methods: {

        initGoogleAutoCompleteService() {
            this.$set(this.autocomplete, 'sessionToken', new window.google.maps.places.AutocompleteSessionToken())
            this.$set(this.autocomplete, 'service', new window.google.maps.places.AutocompleteService())
        },

        selectItemFromList() {
            const { results, resultsHighlight } = this.autocomplete
            const { input } = this.context

            if (!input || !results.length) return

            this.resultHasBeenSelected(results[resultsHighlight])
        },

        shiftResultsSelection() {
            const { results, resultsHighlight } = this.autocomplete
            let newIndex = Math.min(results.length, resultsHighlight) + 1

            if (newIndex >= results.length) newIndex = 0

            this.$set(this.autocomplete, 'resultsHighlight', newIndex)
        },

        unshiftResultsSelection() {
            const { results, resultsHighlight } = this.autocomplete
            let newIndex = Math.min(results.length, resultsHighlight) - 1

            if (newIndex < 0) newIndex = results.length - 1

            this.$set(this.autocomplete, 'resultsHighlight', newIndex)
        },

        inputHasReceivedFocus() {
            if (this.autocomplete.service) return

            this.initGoogleAutoCompleteService()
        },

        inputHasChanged() {
            const { service, sessionToken } = this.autocomplete
            const { input } = this.context
            const { bounds } = this

            this.$set(this.autocomplete, 'resultsHighlight', 0)

            if (!input) {
                this.$set(this.autocomplete, 'selected', {})
                this.$set(this.autocomplete, 'results', [])
                return
            }

            service.getPlacePredictions({
                input,
                sessionToken,
                bounds,
            }, (predictions, status) => {
                this.$set(this.autocomplete, 'status', status)

                if (status !== window.google.maps.places.PlacesServiceStatus.OK) return

                this.$set(this.autocomplete, 'results', predictions)
            })
        },

        resultHasBeenSelected({ place_id: placeId, description }) {
            const placeService = new window.google.maps.places.PlacesService(document.createElement('div'))

            placeService.getDetails({
                placeId,
                fields: [
                    'place_id',
                    'formatted_address',
                    'geometry',
                ],
            }, (place) => {
                this.$set(this.autocomplete, 'selected', place)
                this.$set(this.context, 'input', description)
                this.$set(this.autocomplete, 'results', [])
                this.$emit('resultChanged', place)
            })
        },

    },

}
</script>

<style scoped>
    .highlighted {
        background-color: lavender;
    }
</style>
