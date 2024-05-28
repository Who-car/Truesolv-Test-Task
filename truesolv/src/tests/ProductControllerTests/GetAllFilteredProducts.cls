@IsTest
public class GetAllFilteredProducts {

    @TestSetup
    static void setup() {
        List<Product__c> products = new List<Product__c>();
        for (Integer i = 0; i < 5; i++) {
            products.add(new Product__c(
                    Name__c = 'Test Product ' + i,
                    Description__c = 'Description ' + i,
                    Type__c = Math.mod(i, 2) == 0 ? 'Toys' : 'Electronics',
                    Family__c = Math.mod(i, 2) == 0 ? 'Video Games' : 'Laptops',
                    Price__c = 100.0 * i,
                    Image__c = 'http://example.com/image' + i + '.png'
            ));
        }
        insert products;
    }

    @IsTest
    static void testSingleAction() {
        Test.startTest();
        String searchQuery = 'Test Product 1';
        Map<String, String> filters = new Map<String, String>();
        filters.put('Type__c', 'Electronics');

        List<Product__c> products = ProductController.getAllFilteredProducts(searchQuery, filters);
        Test.stopTest();
        System.assertEquals(1, products.size(), 'Expected 1 product');
        System.assertEquals('Test Product 1', products[0].Name__c, 'Expected product name to be "Test Product 1"');
    }

    @IsTest
    static void testBulkAction() {
        Test.startTest();
        String searchQuery = 'Test Product';
        Map<String, String> filters = new Map<String, String>();

        List<Product__c> products = ProductController.getAllFilteredProducts(searchQuery, filters);
        Test.stopTest();
        System.assertEquals(5, products.size(), 'Expected 5 products');
    }

    @IsTest
    static void testFilterByType() {
        Test.startTest();
        Map<String, String> filters = new Map<String, String>();
        filters.put('Type__c', 'Toys');

        List<Product__c> products = ProductController.getAllFilteredProducts('', filters);
        Test.stopTest();
        System.assertEquals(3, products.size(), 'Expected 3 products of Toys');
    }

    @IsTest
    static void testFilterByFamily() {
        Test.startTest();
        Map<String, String> filters = new Map<String, String>();
        filters.put('Family__c', 'Video Games');

        List<Product__c> products = ProductController.getAllFilteredProducts('', filters);
        Test.stopTest();
        System.assertEquals(3, products.size(), 'Expected 3 products of Video Games');
    }

    @IsTest
    static void testFilterByTypeAndFamily() {
        Test.startTest();
        Map<String, String> filters = new Map<String, String>();
        filters.put('Type__c', 'Electronics');
        filters.put('Family__c', 'Laptops');

        List<Product__c> products = ProductController.getAllFilteredProducts('', filters);
        Test.stopTest();
        System.assertEquals(2, products.size(), 'Expected 2 products of Electronics and Laptops');
    }

    @IsTest
    static void testSearchAndFilter() {
        Test.startTest();
        String searchQuery = 'Test Product';
        Map<String, String> filters = new Map<String, String>();
        filters.put('Type__c', 'Electronics');

        List<Product__c> products = ProductController.getAllFilteredProducts(searchQuery, filters);
        Test.stopTest();
        System.assertEquals(2, products.size(), 'Expected 2 products with search query and Electronics');
    }
}
