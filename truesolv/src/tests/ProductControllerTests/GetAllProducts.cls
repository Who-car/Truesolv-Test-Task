@IsTest
public class GetAllProducts {

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
        List<Product__c> products = ProductController.getAllProducts();
        Test.stopTest();
        System.assertEquals(5, products.size(), 'Expected 5 products');
    }
}