public with sharing class OrderTriggerHandler {
    public static void handleOrderItemTrigger(List<OrderItem__c> newItems, List<OrderItem__c> oldItems, Boolean isInsert, Boolean isUpdate, Boolean isDelete) {
        Set<Id> orderIds = new Set<Id>();

        if (isInsert || isUpdate) {
            for (OrderItem__c item : newItems) {
                orderIds.add(item.OrderId__c);
            }
        }

        if (isDelete) {
            for (OrderItem__c item : oldItems) {
                orderIds.add(item.OrderId__c);
            }
        }

        updateOrderTotals(orderIds);
    }

    private static void updateOrderTotals(Set<Id> orderIds) {
        List<Order__c> ordersToUpdate = new List<Order__c>();

        for (Id orderId : orderIds) {
            List<OrderItem__c> orderItems = [
                    SELECT Quantity__c, Price__c
                    FROM OrderItem__c
                    WHERE OrderId__c = :orderId
            ];

            Decimal totalQuantity = 0;
            Decimal totalPrice = 0;

            for (OrderItem__c item : orderItems) {
                totalQuantity += item.Quantity__c;
                totalPrice += item.Quantity__c * item.Price__c;
            }

            Order__c order = new Order__c(
                    Id = orderId,
                    TotalProductCount__c = totalQuantity,
                    TotalPrice__c = totalPrice
            );
            ordersToUpdate.add(order);
        }

        update ordersToUpdate;
    }
}
