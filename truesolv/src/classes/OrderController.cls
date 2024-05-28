public with sharing class OrderController {
    public class CartItemWrapper {
        @AuraEnabled public Product__c product { get; set; }
        @AuraEnabled public Integer quantity { get; set; }
    }

    @AuraEnabled
    public static Id checkoutCart(List<CartItemWrapper> cartItems, Id accountId) {
        if (cartItems.isEmpty()) {
            throw new AuraHandledException('Cart is empty');
        }

        String orderName = 'Order №' + generateUniqueId() + '\n' + Date.today().toString();
        Order__c newOrder = new Order__c(
                Name__c = orderName,
                AccountId__c = accountId
        );

        insert newOrder;
        List<OrderItem__c> orderItems = new List<OrderItem__c>();

        for (CartItemWrapper cartItem : cartItems) {
            OrderItem__c orderItem = new OrderItem__c(
                    OrderId__c = newOrder.Id,
                    ProductId__c = cartItem.product.Id,
                    Quantity__c = cartItem.quantity,
                    Price__c = cartItem.product.Price__c
            );
            orderItems.add(orderItem);
        }
        insert orderItems;

        return newOrder.Id;
    }

    private static String generateUniqueId() {
        return String.valueOf(Math.abs(Crypto.getRandomInteger())).substring(0, 4);
    }
}