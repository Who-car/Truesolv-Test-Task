import {LightningElement, track, wire} from 'lwc';
import getAllProducts from '@salesforce/apex/ProductController.getAllProducts';
import getAllFilteredProducts from '@salesforce/apex/ProductController.getAllFilteredProducts';

const CART_STORAGE_KEY = 'cartProducts';
const DEBOUNCE_DELAY = 1000;

export default class OrderManagementPage extends LightningElement {
    searchQuery = '';
    debounceTimeout;

    @track isModalOpen = false;
    @track isCartOpen = false;
    @track isLoading = false;
    @track products = [];
    @track cartProducts = [];
    @track selectedFilters = {};

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
            this.cartProducts = [...JSON.parse(cachedCart)];
        }
    }

    handleSearch(event) {
        this.searchQuery = event.detail.searchQuery;

        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.fetchFilteredProducts();
        }, DEBOUNCE_DELAY);
    }

    handleFilterChange(event) {
        const { filterName, filterValue } = event.detail;
        this.selectedFilters[filterName] = filterValue;
        this.fetchFilteredProducts();
    }

    fetchFilteredProducts() {
        this.isLoading = true;
        const { searchQuery, selectedFilters } = this;
        console.log('filters: ', selectedFilters)
        console.log('type: ', selectedFilters['Type__c'])
        try {
            getAllFilteredProducts({searchQuery: searchQuery, filters: selectedFilters})
                .then(result => {
                    this.products = result;
                    this.isLoading = false;
                })
                .catch(error => console.log(error));
        } catch (error) {
            console.log('the error: ', error)
        }
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
        this.cartProducts.push({product: event.detail.product, quantity: 1});
        this.saveCartToLocalStorage();
    }

    handleCartChange(event) {
        const newCart = event.detail.newCart;
        this.cartProducts = [...newCart];
        this.saveCartToLocalStorage();
    }

    handleCartClean() {
        this.cartProducts.splice(0, this.cartProducts.length)
        this.saveCartToLocalStorage();
    }

    saveCartToLocalStorage() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cartProducts));
    }
}