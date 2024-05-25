import { LightningElement, wire, track } from 'lwc';
import getCurrentUser from '@salesforce/apex/OrderManagementController.getCurrentUser';

export default class OrderManagement extends LightningElement {
    user;
    error;
    searchQuery = '';

    // Options for Type and Family filters
    typeOptions = [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Apparel', value: 'apparel' },
        { label: 'Home Goods', value: 'home_goods' }
    ];

    familyOptions = [
        { label: 'Family A', value: 'family_a' },
        { label: 'Family B', value: 'family_b' },
        { label: 'Family C', value: 'family_c' }
    ];

    selectedTypes = [];
    selectedFamilies = [];

    @wire(getCurrentUser)
    wiredUser({ error, data }) {
        if (data) {
            this.user = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.user = undefined;
        }
    }

    handleTypeChange(event) {
        this.selectedTypes = event.detail.value;
    }

    handleFamilyChange(event) {
        this.selectedFamilies = event.detail.value;
    }

    handleSearch(event) {
        this.searchQuery = event.target.value;
        // TODO: добавить логику для фильтрации продуктов на основе searchQuery
    }
}