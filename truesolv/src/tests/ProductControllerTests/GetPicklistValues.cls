@IsTest
public class GetPicklistValues {

    @IsTest
    static void testGetPicklistValues() {
        Test.startTest();
        Map<String, List<String>> picklistValues = ProductController.getPicklistValues();
        Test.stopTest();
        System.assert(picklistValues.containsKey('Type__c'), 'Expected Type__c in picklist values');
        System.assert(picklistValues.containsKey('Family__c'), 'Expected Family__c in picklist values');
    }
}