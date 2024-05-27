
public with sharing class UserController {
    @AuraEnabled(Cacheable=true)
    public static User getCurrentUser() {
        return [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];
    }

    @AuraEnabled(Cacheable=true)
    public static Boolean isCurrentUserManager() {
        User currentUser = [SELECT IsManager__c FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return currentUser.IsManager__c;
    }

    @AuraEnabled(Cacheable=true)
    public static Id getCurrentUserAccountId() {
        Account account = [SELECT Id, (SELECT Id FROM Contacts) FROM Account LIMIT 1];
        return account.Id;
    }
}