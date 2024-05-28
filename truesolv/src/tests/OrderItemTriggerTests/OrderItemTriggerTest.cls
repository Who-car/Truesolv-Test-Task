@IsTest
public class OrderItemTriggerTest {

    @IsTest
    static void testOrderItemTrigger() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        Order__c testOrder = new Order__c(Name__c = 'Test Order', AccountId__c = testAccount.Id);
        insert testOrder;

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

        OrderItem__c orderItem1 = new OrderItem__c(OrderId__c = testOrder.Id, ProductId__c = testProduct1.Id, Quantity__c = 2, Price__c = testProduct1.Price__c);
        OrderItem__c orderItem2 = new OrderItem__c(OrderId__c = testOrder.Id, ProductId__c = testProduct2.Id, Quantity__c = 1, Price__c = testProduct2.Price__c);
        insert new List<OrderItem__c>{ orderItem1, orderItem2 };

        Order__c updatedOrder = [SELECT TotalProductCount__c, TotalPrice__c FROM Order__c WHERE Id = :testOrder.Id];
        System.assertEquals(3, updatedOrder.TotalProductCount__c, 'Total product count should be correct');
        System.assertEquals(370.35, updatedOrder.TotalPrice__c, 'Total price should be correct');
    }
}
