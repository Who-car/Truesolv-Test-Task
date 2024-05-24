import { LightningElement, wire, track } from 'lwc';
import getCurrentUser from '@salesforce/apex/OrderManagementController.getCurrentUser';

export default class OrderManagement extends LightningElement {
    user;
    error;
    searchQuery = '';

    @track products = [
        { id: 1, name: 'Product 1', description: 'Description of Product 1', image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Product 2', description: 'Description of Product 2', image: '' },
        { id: 3, name: 'Product 3', description: 'Description of Product 3', image: 'https://via.placeholder.com/150' }
    ];

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