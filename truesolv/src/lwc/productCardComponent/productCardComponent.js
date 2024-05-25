import {LightningElement, api, track, wire} from 'lwc';
import isCurrentUserManager from '@salesforce/apex/UserController.isCurrentUserManager';
import deleteProduct from '@salesforce/apex/ProductController.deleteProduct';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

export default class ProductCardComponent extends LightningElement {
    @api product;
    @track isManager = false;

    @wire(isCurrentUserManager)
    wiredIsManager({ error, data }) {
        if (data) {
            this.isManager = data;
        } else if (error) {
            console.error('Error fetching user role', error);
        }
    }

    handleDelete() {
        deleteProduct({ productId: this.product.Id })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Product deleted successfully',
                        variant: 'success',
                    })
                );
                this.dispatchEvent(new CustomEvent('productdeleted', { detail: this.product.Id }));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error deleting product: ' + error.body.message,
                        variant: 'error',
                    })
                );
            });
    }
}