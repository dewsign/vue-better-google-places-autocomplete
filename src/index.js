import GooglePlacesAutocomplete from './GooglePlacesAutocomplete.vue'

const GooglePlacesAutocompletePlugin = {
    install(Vue) {
        Vue.component(GooglePlacesAutocomplete)
    }
}

export default GooglePlacesAutocompletePlugin
export { GooglePlacesAutocomplete, GooglePlacesAutocompletePlugin }
