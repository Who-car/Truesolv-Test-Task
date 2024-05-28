@IsTest
public class CheckoutCart {

    @IsTest
    static void testCheckoutCart() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        Product__c testProduct1 = ProductController.createProduct(
                'Product 1',
                'Description 1',
                'Electronics',
                'Laptops',
                123.45,
                'http://example.com/newimage.png'
        );
        Product__c testProduct2 = ProductController.createProduct(
                'Product 2',
                'Description 2',
                'Electronics',
                'Laptops',
                123.45,
                'http://example.com/newimage.png'
        );

        OrderController.CartItemWrapper item1 = new OrderController.CartItemWrapper();
        item1.product = testProduct1;
        item1.quantity = 2;

        OrderController.CartItemWrapper item2 = new OrderController.CartItemWrapper();
        item2.product = testProduct2;
        item2.quantity = 1;

        List<OrderController.CartItemWrapper> cartItems = new List<OrderController.CartItemWrapper>{ item1, item2 };

        Test.startTest();
        Id newOrderId = OrderController.checkoutCart(cartItems);
        Test.stopTest();

        Order__c newOrder = [SELECT Id, Name__c, AccountId__c FROM Order__c WHERE Id = :newOrderId];
        System.assertNotEquals(null, newOrder, 'Order should be created');
        System.assertEquals(testAccount.Id, newOrder.AccountId__c, 'Order should be linked to the correct account');

        List<OrderItem__c> orderItems = [SELECT OrderId__c, ProductId__c, Quantity__c, Price__c FROM OrderItem__c WHERE OrderId__c = :newOrderId];
        System.assertEquals(2, orderItems.size(), 'There should be 2 order items');
    }

    @IsTest
    static void testCheckoutCartEmpty() {
        List<OrderController.CartItemWrapper> cartItems = new List<OrderController.CartItemWrapper>();
        AuraHandledException ex = new AuraHandledException('Cart is empty');

        try {
            Test.startTest();
            OrderController.checkoutCart(cartItems);
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown');
        } catch (AuraHandledException e) {
            System.assertEquals(ex.getMessage(), e.getMessage());
        }
    }
}
