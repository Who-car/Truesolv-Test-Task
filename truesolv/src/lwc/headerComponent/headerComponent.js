import {LightningElement, api, track, wire} from 'lwc';
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import isCurrentUserManager from '@salesforce/apex/UserController.isCurrentUserManager';

export default class HeaderComponent extends LightningElement {
    @api accountName;
    @api accountNumber;
    @track isManager;

    @wire(isCurrentUserManager)
    wiredIsManager({ error, data }) {
        if (data) {
            this.isManager = data;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Authentication failed',
                    message: error.body.toString(),
                    variant: 'error'
                })
            );
        }
    }


    handleOpenProductCreateModal() {
        this.dispatchEvent(new CustomEvent('openproductcreatemodal'));
    }

    handleOpenCart() {
        this.dispatchEvent(new CustomEvent('opencart'));
    }
}