public with sharing class UserController {
    @AuraEnabled(Cacheable=true)
    public static User getCurrentUser() {
        return [SELECT Id, User.Account.Name FROM User WHERE Id = :UserInfo.getUserId()];
    }

    @AuraEnabled(Cacheable=true)
    public static Account getAccountInfo() {
        return [SELECT Name, AccountNumber FROM Account LIMIT 1];
    }

    @AuraEnabled(Cacheable=true)
    public static Boolean isCurrentUserManager() {
        User currentUser = [SELECT IsManager__c FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return currentUser.IsManager__c;
    }

    @AuraEnabled(Cacheable=true)
    public static Id getAccountId() {
        Account account = [SELECT Id FROM Account LIMIT 1];
        return account.Id;
    }
}