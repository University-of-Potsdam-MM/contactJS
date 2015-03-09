require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "AttributeTypeList", function( assert ) {
				
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
								
		    	var latitudeType = new contactJS.AttributeType().withName('latitude')
											.withType('double').withParameter(parameter);
				var longitudeType = new contactJS.AttributeType().withName('longitude')
											.withType('double');
				var attributeType = new contactJS.AttributeType().withName('testName')
											.withType('integer');
				
				var array = new Array();
				array.push(latitudeType);
				array.push(longitudeType);
				var list = new contactJS.AttributeTypeList().withItems(array);
				assert.equal( list.size(), 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.AttributeTypeList();
				list2.put(attributeType);
				
				assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.equal( list2.size(), 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(attributeType), "Passed!: contains -> true" );
				assert.ok( !list.contains(attributeType), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equals(list2), "Passed!: equals -> true" );
				assert.ok( !list.equals(list2), "Passed!: equals -> false" );
				
				//containsKey
				assert.ok( list2.containsKey('testName'), "Passed!: containsKey -> true" );
				assert.ok( !list.containsKey('testName'), "Passed!: containsKey -> false" );
				
				//getItem
				assert.ok( list2.getItem('testName').equals(attributeType), "Passed!: getItem" );
				assert.ok( !list.getItem('testName'), "Passed!: getItem -> undefined" );
				
				//removeItem
				list2.removeItem('testName');
				assert.equal( list2.size(),2, "Passed!: removeItem" );
				assert.ok( !list2.getItem('testName'), "Passed!: item removed" );
				list.removeItem('testName');
				assert.equal( list.size(), 2, "Passed!: removeItem: key does not exist" );
				
				//getKeys
				assert.equal( list2.getKeys().length, 2, "Passed!: getKeys" );
				assert.equal( list2.getKeys()[0], 'latitude', "Passed!: getKeys -> latitude" );
				assert.equal( list2.getKeys()[1], 'longitude', "Passed!: getKeys -> longitude" );
				
				//getItems
				assert.equal( list2.getItems().length, 2, "Passed!: getItems" );
				assert.ok( list2.getItems()[0].equals(latitudeType), "Passed!: getItems -> latitude" );
				assert.ok( list2.getItems()[1].equals(longitudeType), "Passed!: getItems -> longitude" );
				
				//empty
				var list3 = new contactJS.AttributeTypeList();
				assert.ok( !list2.isEmpty(), "Passed!: isEmpty ->true" );
				assert.ok( list3.isEmpty(), "Passed!: isEmpty ->false" );
				
				//clear
				list2.clear();
				assert.ok( list2.isEmpty(), "Passed!: clear: isEmpty ->true" );
				assert.equal( list2.getItems().length, 0, "Passed!: clear: length == 0 ->true" );
			});

	});
});