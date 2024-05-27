import {api, LightningElement, track, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import checkoutCart from '@salesforce/apex/OrderController.checkoutCart';

export default class CartPanelComponent extends NavigationMixin(LightningElement) {
    @track cartItems;
    @api
    get products() {
        return this.cartItems;
    }

    set products(value) {
        this.cartItems = [...value]
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent('closecart'));
    }

    handleUpdateQuantity(event) {
        const itemId = event.detail.itemId;
        const quantity = event.detail.quantity;

        this.cartItems = this.cartItems.map(cartItem => {
            if (cartItem.product.Id === itemId) {
                return {
                    ...cartItem,
                    quantity: quantity
                };
            }
            return cartItem;
        });

        this.dispatchEvent(new CustomEvent('cartchange', {detail: {newCart: this.cartItems}}))
    }

    handleRemoveItem(event) {
        const itemId = event.detail.itemId;
        this.cartItems = this.cartItems.filter(item => item.product.Id !== itemId);
        this.dispatchEvent(new CustomEvent('cartchange', {detail: {newCart: this.cartItems}}))
    }

    async handleCheckout() {
        try {
            const orderId = await checkoutCart({ cartItems: this.cartItems });
            this.dispatchEvent(
                new CustomEvent('checkoutsuccess')
            );

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Order created successfully',
                    variant: 'success'
                })
            );

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: orderId,
                    objectApiName: 'Order__c',
                    actionName: 'view'
                }
            });
        } catch (error) {
            console.log(error)
            console.log('error: ', error.toString())
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating order',
                    message: error,
                    variant: 'error'
                })
            );
        }
    }
}