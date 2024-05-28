import {LightningElement, api, wire} from 'lwc';
import getAccountInfo from '@salesforce/apex/UserController.getAccountInfo';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

export default class HeaderComponent extends LightningElement {
    account;

    @wire(getAccountInfo)
    wiredUser({ error, data }) {
        if (data) {
            this.account = data;
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