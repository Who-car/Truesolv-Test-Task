import {api, LightningElement, track} from 'lwc';

export default class CartPanelComponent extends LightningElement {
    @api products;

    @track cartItems = [
        { id: 1, name: 'Item 1', quantity: 1 },
        { id: 2, name: 'Item 2', quantity: 2 }
    ];

    handleClose() {
        this.dispatchEvent(new CustomEvent('closecart'));
    }

    handleRemoveItem(event) {
        const itemId = event.detail.itemId;
        this.dispatchEvent(new CustomEvent('removeitem', {
            detail: { itemId }
        }));
    }

    handleCheckout() {
        this.dispatchEvent(new CustomEvent('checkout'));
    }
}