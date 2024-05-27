import {LightningElement, track, wire} from 'lwc';
import getPicklistValues from '@salesforce/apex/ProductController.getPicklistValues';

export default class FilterSectionComponent extends LightningElement {
    @track typeOptions = [];
    @track familyOptions = [];
    @track selectedType;
    @track selectedFamily;
    @track error;

    @wire(getPicklistValues)
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.typeOptions = [{ label: 'None', value: '' }].concat(data.Type__c.map(value => ({ label: value, value: value })));
            this.familyOptions = [{ label: 'None', value: '' }].concat(data.Family__c.map(value => ({ label: value, value: value })));
        } else if (error) {
            this.error = error;
        }
    }

    handleTypeChange(event) {
        this.selectedType = event.detail.value;
        this.dispatchEvent(
            new CustomEvent('filterchange', {
                detail: {
                    filterName: 'Type__c',
                    filterValue: this.selectedType
                }}));
    }

    handleFamilyChange(event) {
        this.selectedFamily = event.detail.value;
        this.dispatchEvent(
            new CustomEvent('filterchange', {
                detail: {
                    filterName: 'Family__c',
                    filterValue: this.selectedFamily
                }}));
    }
}