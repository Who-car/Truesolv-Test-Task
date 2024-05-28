import {LightningElement, api} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class OrderRedirectButton extends NavigationMixin(LightningElement) {
    @api recordId;

    handleRedirect() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/lightning/n/Order_Management?c__recordId=${this.recordId}`
            }
        });
    }
}