import {LightningElement, track, wire} from 'lwc';
import getPicklistValues from '@salesforce/apex/ProductController.getPicklistValues';

export default class FilterSectionComponent extends LightningElement {
    @track typeOptions = [];
    @track familyOptions = [];
    @track selectedTypes = [];
    @track selectedFamilies = [];
    @track error;

    @wire(getPicklistValues)
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.typeOptions = data.Type__c.map(value => ({ label: value, value: value }));
            this.familyOptions = data.Family__c.map(value => ({ label: value, value: value }));
        } else if (error) {
            this.error = error;
        }
    }

    handleTypeChange(event) {
        this.selectedTypes = [...this.selectedTypes, event.detail.value];
    }

    handleFamilyChange(event) {
        this.selectedFamilies = [...this.selectedFamilies, event.detail.value];
    }
}