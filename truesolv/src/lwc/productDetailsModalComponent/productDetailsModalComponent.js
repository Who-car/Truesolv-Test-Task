import {api, LightningElement} from 'lwc';

export default class ProductDetailsModalComponent extends LightningElement {
    @api product;

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleAddToCart() {
        this.dispatchEvent(new CustomEvent('addtocart'));
    }
}