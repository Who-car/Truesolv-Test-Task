public class ProductCardController {
    @AuraEnabled(Cacheable=true)
    public static List<Product__c> getAllProducts() {
        return [SELECT Name__c, Description__c, Type__c, Family__c, Image__c, Price__c FROM Product__c];
    }

    @AuraEnabled
    public static Product__c createProduct(String name, String description, String type, String family, Decimal price) {
        Product__c newProduct = new Product__c(
                Name__c = name,
                Description__c = description,
                Type__c = type,
                Family__c = family,
                Price__c = price
        );

        insert newProduct;
        return newProduct;
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