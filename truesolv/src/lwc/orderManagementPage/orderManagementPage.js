import {api, LightningElement, track, wire} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getAllProducts from '@salesforce/apex/ProductController.getAllProducts';
import getAllFilteredProducts from '@salesforce/apex/ProductController.getAllFilteredProducts';
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';

const CART_STORAGE_KEY = 'cartProducts';

export default class OrderManagementPage extends LightningElement {
    @track isProductCreateModalOpen = false;
    @track isCartModalOpen = false;
    @track isLoading = false;
    @track products = [];
    @track cartProducts = [];
    @track selectedFilters = {};
    @track searchQuery = '';
    @track accountName;
    @track accountNumber;
    @track currentPageReference;

    // TODO: передавать в корзину
    @api
    get recordId() {
        return this.currentPageReference?.state?.c__recordId;
    }

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
    }

    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_NAME_FIELD, ACCOUNT_NUMBER_FIELD] })
    wiredAccount({ error, data }) {
        if (data) {
            this.accountName = getFieldValue(data, ACCOUNT_NAME_FIELD);
            this.accountNumber = getFieldValue(data, ACCOUNT_NUMBER_FIELD);
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error fetching account',
                    message: error.toString(),
                    variant: 'error'
                })
            );
        }
    }

    @wire(getAllProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.error = undefined;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error fetching data',
                    message: error.toString(),
                    variant: 'error'
                })
            );
        }
    }

    connectedCallback() {
        const cachedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (cachedCart) {
            this.cartProducts = [...JSON.parse(cachedCart)];
        }
    }

    // Search change event triggers
    handleSearchQueryChange(event) {
        this.searchQuery = event.detail.searchQuery;
        this.fetchFilteredProducts();
    }

    handleFilterChange(event) {
        this.selectedFilters[event.detail.filterName] = event.detail.filterValue;
        this.fetchFilteredProducts();
    }

    // Products list event triggers
    handleProductDeleted(event) {
        const productId = event.detail;
        this.products = this.products.filter(product => product.Id !== productId);
    }

    // Cart products list event triggers
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
        this.handleCloseCartModal();
        this.cartProducts.splice(0, this.cartProducts.length)
        this.saveCartToLocalStorage();
    }

    saveCartToLocalStorage() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cartProducts));
    }

    // Modal windows state change
    handleOpenProductCreateModal() {
        this.isProductCreateModalOpen = true;
    }

    handleCloseProductCreateModal(event) {
        if (event.detail) {
            this.products = [...this.products, event.detail];
        }
        this.isProductCreateModalOpen = false;
    }

    handleOpenCartModal() {
        this.isCartModalOpen = true;
    }

    handleCloseCartModal() {
        this.isCartModalOpen = false;
    }

    // Fetch products data
    fetchFilteredProducts() {
        this.isLoading = true;
        const { searchQuery, selectedFilters } = this;

        getAllFilteredProducts({searchQuery: searchQuery, filters: selectedFilters})
            .then(result => {
                this.products = result;
                this.isLoading = false;
            })
            .catch(error =>
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error fetching data',
                        message: error.toString(),
                        variant: 'error'
                    })
                )
            );
    }
}