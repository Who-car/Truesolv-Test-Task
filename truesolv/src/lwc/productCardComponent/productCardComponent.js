import {LightningElement, api, track, wire} from 'lwc';
import isCurrentUserManager from '@salesforce/apex/UserController.isCurrentUserManager';
import deleteProduct from '@salesforce/apex/ProductController.deleteProduct';
import fetchProductImage from '@salesforce/apex/ProductController.fetchProductImage';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

export default class ProductCardComponent extends LightningElement {
    // TODO: Details modal window
    // TODO: Toast notification when adding to cart
    @track isManager = false;
    @track isLoading = true;
    @track data;

    @api
    get product() {
        return this.data;
    }
    set product(value) {
        this.data = {...value};
        this.loadImage();
    }

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

    loadImage() {
        if (!this.data.Image__c) {
            fetchProductImage({productName: this.data.Name__c})
                .then(result => {
                    this.data.Image__c = result;
                    this.isLoading = false;
                })
                .catch(error =>
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Authentication failed',
                            message: error.toString(),
                            variant: 'error'
                        })
                    ))
        } else {
            this.isLoading = false;
        }
    }

    handleProductDelete() {
        deleteProduct({ productId: this.data.Id })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Product deleted successfully',
                        variant: 'success',
                    })
                );
                this.dispatchEvent(
                    new CustomEvent('productdeleted', { detail: this.data.Id })
                );
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

    handleAddToCart() {
        this.dispatchEvent(
            new CustomEvent('addtocart', {detail: {product: this.data}})
        );
    }
}