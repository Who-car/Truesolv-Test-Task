import {LightningElement, api, wire} from 'lwc';
import getCurrentUser from '@salesforce/apex/UserController.getCurrentUser';

export default class HeaderComponent extends LightningElement {
    user;
    error;

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

    handleOpenModal() {
        this.dispatchEvent(new CustomEvent('openmodal'));
    }
}