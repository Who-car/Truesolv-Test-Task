import {api, LightningElement} from 'lwc';

export default class CartPanelItemComponent extends LightningElement {
    @api quantity;
    @api item;

    get truncatedDescription() {
        const maxLength = 100;
        if (this.item.Description__c.length > maxLength) {
            return this.item.Description__c.substring(0, maxLength) + '...';
        }
        return this.item.Description__c;
    }

    handleRemove() {
        this.dispatchEvent(new CustomEvent('removeitem', {
            detail: { itemId: this.item.Id }
        }));
    }

    handleDecreaseQuantity() {
        console.log('Decreasing quantity for item:', this.item.Id);
        const quantity = Math.max(1, this.quantity - 1);
        this.dispatchEvent(new CustomEvent('updatequantity', {
            detail: { itemId: this.item.Id, quantity }
        }));
    }

    handleIncreaseQuantity() {
        console.log('Increasing quantity for item:', this.item.Id);
        const quantity = this.quantity + 1;
        this.dispatchEvent(new CustomEvent('updatequantity', {
            detail: { itemId: this.item.Id, quantity }
        }));
    }
}