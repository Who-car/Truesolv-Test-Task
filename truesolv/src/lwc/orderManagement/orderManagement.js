import { LightningElement, wire, track } from 'lwc';
import getCurrentUser from '@salesforce/apex/OrderManagementController.getCurrentUser';
import createProduct from '@salesforce/apex/ProductCardController.createProduct';

export default class OrderManagement extends LightningElement {
    user;
    error;
    searchQuery = '';
    @track isModalOpen = false;
    @track newProduct = {
        Name: '',
        Description__c: '',
        Type__c: '',
        Family__c: '',
        Price__c: 0
    };

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

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.newProduct[field] = event.target.value;
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.resetNewProduct();
    }

    saveProduct() {
        createProduct({
            name: this.newProduct.Name,
            description: this.newProduct.Description__c,
            type: this.newProduct.Type__c,
            family: this.newProduct.Family__c,
            price: this.newProduct.Price__c
        })
            .then(product => {
                this.products = [...this.products, product];
                this.closeModal();
            })
            .catch(error => {
                this.error = error;
            });

        this.closeModal();
    }

    resetNewProduct() {
        this.newProduct = {
            Name: '',
            Description__c: '',
            Type__c: '',
            Family__c: '',
            Price__c: 0
        };
    }
}