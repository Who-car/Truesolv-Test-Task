import {api, LightningElement} from 'lwc';

export default class CartPanelItemComponent extends LightningElement {
    @api product;
    @api quantity;

    @api item;

    handleRemove() {
        this.dispatchEvent(new CustomEvent('removeitem', {
            detail: { itemId: this.item.id }
        }));
    }

    handleIncrease() {
        this.dispatchEvent(new CustomEvent('increase', { detail: this.product.Id }));
    }

    handleDecrease() {
        this.dispatchEvent(new CustomEvent('decrease', { detail: this.product.Id }));
    }

    handleDelete() {
        this.dispatchEvent(new CustomEvent('delete', { detail: this.product.Id }));
    }
}