@IsTest
public class DeleteProduct {

    @TestSetup
    static void setup() {
        Product__c product = new Product__c(
                Name__c = 'Test Product',
                Description__c = 'Description',
                Type__c = 'Electronics',
                Family__c = 'Laptops',
                Price__c = 100.0,
                Image__c = 'http://example.com/image.png'
        );
        insert product;
    }

    @IsTest
    static void testDeleteProduct() {
        Product__c product = [SELECT Id FROM Product__c LIMIT 1];

        Test.startTest();
        ProductController.deleteProduct(product.Id);
        Test.stopTest();

        Integer count = [SELECT COUNT() FROM Product__c WHERE Id = :product.Id];
        System.assertEquals(0, count, 'Expected product to be deleted');
    }

    @IsTest
    static void testDeleteNonExistingProduct() {
        try {
            Test.startTest();
            ProductController.deleteProduct('nonExistingId');
            Test.stopTest();
            System.assert(false, 'Expected an exception to be thrown');
        } catch (Exception e) {
            System.assert(true, 'Exception was thrown as expected');
        }
    }

    @IsTest
    static void testDeleteProductWithInvalidId() {
        try {
            Test.startTest();
            ProductController.deleteProduct('InvalidId');
            Test.stopTest();
            System.assert(false, 'Expected an exception to be thrown');
        } catch (Exception e) {
            System.assert(true, 'Exception was thrown as expected');
        }
    }
}