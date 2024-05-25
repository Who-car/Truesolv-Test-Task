import { LightningElement, wire, track } from 'lwc';
import getAllProducts from '@salesforce/apex/ProductController.getAllProducts';

export default class OrderManagementPage extends LightningElement {
    searchQuery = '';
    @track isModalOpen = false;
    @track products;

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

    handleSearch(event) {
        this.searchQuery = event.target.value;
        // TODO: добавить логику для фильтрации продуктов на основе searchQuery
    }

    handleProductDeleted(event) {
        const productId = event.detail;
        this.products = this.products.filter(product => product.Id !== productId);
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal(newProduct) {
        console.log(newProduct)
        if (newProduct) {
            this.products = [...this.products, newProduct];
        }
        this.isModalOpen = false;
    }
}