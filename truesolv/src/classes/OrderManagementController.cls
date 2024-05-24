
public with sharing class OrderManagementController {
    @AuraEnabled(Cacheable=true)
    public static User getCurrentUser() {
        return [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];
    }
}