import {LightningElement, api, track, wire} from 'lwc';
import createProduct from '@salesforce/apex/ProductController.createProduct';
import getPicklistValues from '@salesforce/apex/ProductController.getPicklistValues';

export default class ProductCreateModalComponent extends LightningElement {
    @track error;
    @track typeOptions = [];
    @track familyOptions = [];
    @track newProduct = {
        Name__c: '',
        Description__c: '',
        Type__c: '',
        Family__c: '',
        Price__c: 0,
        Image__c: ''
    };

    @wire(getPicklistValues)
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.typeOptions = data.Type__c.map(value => ({ label: value, value: value }));
            this.familyOptions = data.Family__c.map(value => ({ label: value, value: value }));
        } else if (error) {
            this.error = error;
        }
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.newProduct[field] = event.target.value;
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    saveProduct() {
        createProduct({
            name: this.newProduct.Name,
            description: this.newProduct.Description__c,
            type: this.newProduct.Type__c,
            family: this.newProduct.Family__c,
            price: this.newProduct.Price__c,
            image: this.newProduct.Image__c
        })
            .then(product => {
                this.dispatchEvent(new CustomEvent('closemodal', { detail: product }));
                this.resetNewProduct();
            })
            .catch(error => {
                this.error = error;
                console.log(error)
            });
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