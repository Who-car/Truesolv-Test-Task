import {LightningElement, track, wire} from 'lwc';
import fetchImageUrl from '@salesforce/apex/ProductCardController.fetchImageUrl';
import getAllProducts from '@salesforce/apex/ProductCardController.getAllProducts';

export default class ProductCard extends LightningElement {
    @track products;
    @track error;

    @wire(getAllProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.products = undefined;
        }
    }

    async connectedCallback() {
        await this.loadProducts();
    }

    async loadProducts() {
        try {
            this.products = await Promise.all(this.products.map(async (product) => {
                if (!product.image) {
                    product.image = await fetchImageUrl({ productName: product.name });
                }
                return product;
            }));
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }
}
