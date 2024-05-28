public class ProductController {
    @AuraEnabled(Cacheable=true)
    public static List<Product__c> getAllProducts() {
        return [SELECT Name__c, Description__c, Type__c, Family__c, Image__c, Price__c FROM Product__c];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Product__c> getAllFilteredProducts(String searchQuery, Map<String, String> filters) {
        String searchPattern = '%' + String.escapeSingleQuotes(searchQuery) + '%';
        List<String> queryParts = new List<String>();

        String query = 'SELECT Id, Name__c, Description__c, Type__c, Family__c, Image__c, Price__c FROM Product__c';

        if (String.isNotBlank(searchQuery)) {
            queryParts.add('(Name__c LIKE \'' + searchPattern + '\' OR Description__c LIKE \'' + searchPattern + '\')');
        }

        if (filters != null && !filters.isEmpty()) {
            if (filters.containsKey('Type__c') && String.isNotBlank(filters.get('Type__c'))) {
                queryParts.add('Type__c = \'' + String.escapeSingleQuotes(filters.get('Type__c')) + '\'');
            }
            if (filters.containsKey('Family__c') && String.isNotBlank(filters.get('Family__c'))) {
                queryParts.add('Family__c = \'' + String.escapeSingleQuotes(filters.get('Family__c')) + '\'');
            }
        }

        if (!queryParts.isEmpty()) {
            query += ' WHERE ' + String.join(queryParts, ' AND ');
        }

        return Database.query(query);
    }


    @AuraEnabled(Cacheable=true)
    public static String fetchProductImage(String productName) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('http://www.glyffix.com/api/Image?word=' + EncodingUtil.urlEncode(productName, 'UTF-8'));
        request.setMethod('GET');

        try {
            HttpResponse response = http.send(request);
            if (response.getStatusCode() == 200) {
                Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                if (responseBody.containsKey('data')) {
                    List<Object> dataList = (List<Object>) responseBody.get('data');
                    if (!dataList.isEmpty()) {
                        Map<String, Object> firstImage = (Map<String, Object>) dataList.get(0);
                        if (firstImage.containsKey('imageurl')) {
                            return (String) firstImage.get('imageurl');
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.debug('Error fetching product image: ' + e.getMessage());
        }

        // fallback image
//        TODO: unit tests
//        TODO: create 3 more users: trututiu (isManager = true), iskander (isAdmin = true), sergey
        return 'https://trcglobus.ru/uploads/no_image.png';
    }

    @AuraEnabled(Cacheable=true)
    public static Map<String, List<String>> getPicklistValues() {
        Map<String, List<String>> picklistValues = new Map<String, List<String>>();

        List<String> typeValues = new List<String>();
        List<String> familyValues = new List<String>();

        Schema.DescribeFieldResult typeField = Product__c.Type__c.getDescribe();
        for (Schema.PicklistEntry entry : typeField.getPicklistValues()) {
            typeValues.add(entry.getValue());
        }

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
}