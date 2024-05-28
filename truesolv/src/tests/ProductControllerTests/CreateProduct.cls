@IsTest
public class CreateProduct {

    @IsTest
    static void testCreateProduct() {
        Test.startTest();
        Product__c newProduct = ProductController.createProduct(
                'New Product',
                'New Description',
                'Electronics',
                'Laptops',
                123.45,
                'http://example.com/newimage.png'
        );
        Test.stopTest();
        System.assertEquals('New Product', newProduct.Name__c, 'Expected product name to be "New Product"');
        System.assertEquals('New Description', newProduct.Description__c, 'Expected description to be "New Description"');
        System.assertEquals('Electronics', newProduct.Type__c, 'Expected type to be "Electronics"');
        System.assertEquals('Laptops', newProduct.Family__c, 'Expected family to be "Laptops"');
        System.assertEquals(123.45, newProduct.Price__c, 'Expected price to be 123.45');
        System.assertEquals('http://example.com/newimage.png', newProduct.Image__c, 'Expected image URL to be "http://example.com/newimage.png"');
    }

    @IsTest
    static void testCreateProductWithMissingFields() {
        try {
            Test.startTest();
            Product__c newProduct = ProductController.createProduct(
                    null,
                    'New Description',
                    'Electronics',
                    'Laptops',
                    123.45,
                    'http://example.com/newimage.png'
            );
            Test.stopTest();
            System.assert(false, 'Expected an exception to be thrown');
        } catch (DmlException e) {
            System.assert(true, 'Exception was thrown as expected');
        }
    }

    @IsTest
    static void testCreateProductWithEmptyDescription() {
        Test.startTest();
        Product__c newProduct = ProductController.createProduct(
                'New Product',
                '',
                'Electronics',
                'Laptops',
                123.45,
                'http://example.com/newimage.png'
        );
        Test.stopTest();
        System.assertEquals('New Product', newProduct.Name__c, 'Expected product name to be "New Product"');
        System.assertEquals('', newProduct.Description__c, 'Expected description to be empty');
        System.assertEquals('Electronics', newProduct.Type__c, 'Expected type to be "New Type"');
        System.assertEquals('Laptops', newProduct.Family__c, 'Expected family to be "New Family"');
        System.assertEquals(123.45, newProduct.Price__c, 'Expected price to be 123.45');
        System.assertEquals('http://example.com/newimage.png', newProduct.Image__c, 'Expected image URL to be "http://example.com/newimage.png"');
    }

    @IsTest
    static void testCreateProductWithNegativePrice() {
        try {
            Test.startTest();
            Product__c newProduct = ProductController.createProduct(
                    'New Product',
                    'New Description',
                    'Electronics',
                    'Laptops',
                    -100.00,
                    'http://example.com/newimage.png'
            );
            Test.stopTest();
            System.assert(false, 'Expected an exception to be thrown');
        } catch (DmlException e) {
            System.assert(true, 'Exception was thrown as expected');
        }
    }

    @IsTest
    static void testCreateProductWithUnsupportedPicklistValues() {
        try {
            Test.startTest();
            Product__c newProduct = ProductController.createProduct(
                    'New Product',
                    'New Description',
                    'New Type',
                    'New Family',
                    100.00,
                    'http://example.com/newimage.png'
            );
            Test.stopTest();
            System.assert(false, 'Expected an exception to be thrown');
        } catch (DmlException e) {
            System.assert(true, 'Exception was thrown as expected');
        }
    }
}
