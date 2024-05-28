trigger OrderItemTrigger on OrderItem__c (after insert, after update, after delete) {
    OrderTriggerHandler.handleOrderItemTrigger(Trigger.new, Trigger.old, Trigger.isInsert, Trigger.isUpdate, Trigger.isDelete);
}
