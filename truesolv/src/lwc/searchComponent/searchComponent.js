import {LightningElement} from 'lwc';

export default class SearchComponent extends LightningElement {
    handleSearch(event) {
        const searchQuery = event.target.value;
        const searchEvent = new CustomEvent('search', {
            detail: { searchQuery }
        });
        this.dispatchEvent(searchEvent);
    }
}