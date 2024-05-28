import {LightningElement} from 'lwc';

const DEBOUNCE_DELAY = 1000;

export default class SearchComponent extends LightningElement {
    debounceTimeout;

    handleSearch(event) {
        const searchQuery = event.target.value;

        clearTimeout(this.debounceTimeout);

        this.debounceTimeout = setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('search', {detail: { searchQuery }})
            );
        }, DEBOUNCE_DELAY);
    }
}