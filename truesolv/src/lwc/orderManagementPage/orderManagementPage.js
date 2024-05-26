import { LightningElement, wire, track } from 'lwc';
import getAllProducts from '@salesforce/apex/ProductController.getAllProducts';
import getAllFilteredProducts from '@salesforce/apex/ProductController.getAllFilteredProducts';

const CART_STORAGE_KEY = 'cartProducts';

export default class OrderManagementPage extends LightningElement {
    searchQuery = '';
    @track isModalOpen = false;
    @track isCartOpen = true;
    @track products = [];
    @track cartProducts = [];

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

    connectedCallback() {
        const cachedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (cachedCart) {
            this.cartProducts = JSON.parse(cachedCart);
        }
    }

    handleSearch(event) {
        const searchQuery = event.detail.searchQuery;
        const resultQuery = searchQuery
            ? getAllFilteredProducts({ searchQuery })
            : getAllProducts();

        resultQuery
            .then(result => {
                this.products = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.products = [];
            });
    }

    handleProductDeleted(event) {
        const productId = event.detail;
        this.products = this.products.filter(product => product.Id !== productId);
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal(event) {
        if (event.detail) {
            this.products = [...this.products, event.detail];
        }
        this.isModalOpen = false;
    }

    openCart() {
        this.isCartOpen = true;
    }

    closeCart() {
        this.isCartOpen = false;
    }

    handleAddToCart(event) {
        this.cartProducts.push(event.detail.product);
        this.saveCartToLocalStorage();
    }

    handleRemoveFromCart(event) {
        const productId = event.detail.productId;
        this.cartProducts = this.cartProducts.filter(product => product.id !== productId);
        this.saveCartToLocalStorage();
    }

    saveCartToLocalStorage() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cartProducts));
    }
}