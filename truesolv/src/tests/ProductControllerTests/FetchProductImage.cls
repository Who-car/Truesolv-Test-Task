@IsTest
public class FetchProductImage {

    @IsTest
    static void testFetchProductImage() {
        Test.startTest();
        String imageUrl = ProductController.fetchProductImage('Test');
        Test.stopTest();
        System.assertNotEquals(null, imageUrl, 'Expected image URL not to be null');
    }

    @IsTest
    static void testFetchProductImageWithInvalidProduct() {
        Test.startTest();
        String imageUrl = ProductController.fetchProductImage('InvalidProduct');
        Test.stopTest();
        System.assertEquals('https://trcglobus.ru/uploads/no_image.png', imageUrl, 'Expected fallback image URL');
    }
}