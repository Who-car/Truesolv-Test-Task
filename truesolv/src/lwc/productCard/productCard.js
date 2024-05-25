import {LightningElement, track, wire} from 'lwc';
import fetchImageUrl from '@salesforce/apex/ProductCardController.fetchImageUrl';
import getAllProducts from '@salesforce/apex/ProductCardController.getAllProducts';
import createProduct from '@salesforce/apex/ProductCardController.createProduct';

export default class ProductCard extends LightningElement {
    // @track products = [
    //     { id: 1, name: 'Laptop', description: 'Description of Product 1', image: 'https://via.placeholder.com/150' },
    //     { id: 2, name: 'Laptop', description: 'Description of Product 2', image: 'https://via.placeholder.com/150' },
    //     { id: 3, name: 'Laptop', description: 'Description of Product 3', image: 'https://via.placeholder.com/150' }
    // ];
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

    handleAddProduct() {
        // This is an example. You would typically gather this data from user inputs
        const name = 'New Product';
        const description = 'Description of New Product';
        const type = 'Type1';
        const family = 'Family1';
        const price = 100.0;

        createProduct({ name, description, type, family, price })
            .then(product => {
                this.products = [...this.products, product];
            })
            .catch(error => {
                this.error = error;
            });
    }

    connectedCallback() {
        // Загрузка продуктов при инициализации компонента
        this.loadProducts();
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
