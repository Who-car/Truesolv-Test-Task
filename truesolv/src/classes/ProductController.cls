public class ProductController {
    @AuraEnabled(Cacheable=true)
    public static List<Product__c> getAllProducts() {
        return [SELECT Name__c, Description__c, Type__c, Family__c, Image__c, Price__c FROM Product__c];
    }

    @AuraEnabled(Cacheable=true)
    public static Map<String, List<String>> getPicklistValues() {
        Map<String, List<String>> picklistValues = new Map<String, List<String>>();

        List<String> typeValues = new List<String>();
        List<String> familyValues = new List<String>();

        // Get the picklist values for Type__c
        Schema.DescribeFieldResult typeField = Product__c.Type__c.getDescribe();
        for (Schema.PicklistEntry entry : typeField.getPicklistValues()) {
            typeValues.add(entry.getValue());
        }

        // Get the picklist values for Family__c
        Schema.DescribeFieldResult familyField = Product__c.Family__c.getDescribe();
        for (Schema.PicklistEntry entry : familyField.getPicklistValues()) {
            familyValues.add(entry.getValue());
        }

        picklistValues.put('Type__c', typeValues);
        picklistValues.put('Family__c', familyValues);

        return picklistValues;
    }

    @AuraEnabled
    public static Product__c createProduct(String name, String description, String type, String family, Decimal price, String image) {
        Product__c newProduct = new Product__c(
                Name__c = name,
                Description__c = description,
                Type__c = type,
                Family__c = family,
                Price__c = price,
                Image__c = image
        );

        insert newProduct;
        return newProduct;
    }

    @AuraEnabled
    public static void deleteProduct(Id productId) {
        try {
            Product__c product = [SELECT Id FROM Product__c WHERE Id = :productId LIMIT 1];
            delete product;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting product: ' + e.getMessage());
        }
    }

    @AuraEnabled(Cacheable=true)
    public static String fetchImageUrl(String productName) {
        String imageUrl = '';
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('http://www.glyffix.com/api/Image?word=' + EncodingUtil.urlEncode(productName, 'UTF-8'));
            request.setMethod('GET');
            HttpResponse response = (HttpResponse) http.send(request);
            if (response.getStatusCode() == 200) {
                Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                List<Object> data = (List<Object>) jsonResponse.get('data');
                if (!data.isEmpty()) {
                    Map<String, Object> firstItem = (Map<String, Object>) data.get(0);
                    imageUrl = (String) firstItem.get('imageurl');
                }
            }
        } catch (Exception e) {
            System.debug('Error fetching image URL: ' + e.getMessage());
        }
        return imageUrl;
    }
}