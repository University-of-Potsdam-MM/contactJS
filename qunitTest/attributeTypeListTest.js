require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "AttributeTypeList", function( assert ) {
				
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
								
		    	var latitudeType = new contactJS.Attribute().withName('latitude').withType('double').withParameter(parameter);
				var longitudeType = new contactJS.Attribute().withName('longitude').withType('double');
				var attributeType = new contactJS.Attribute().withName('testName').withType('integer');
				
				var array = [];
				array.push(latitudeType);
				array.push(longitudeType);
				var list = new contactJS.AttributeList().withItems(array);
				assert.equal( list.size(), 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.AttributeList();
				list2.put(attributeType);
				
				assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.equal( list2.size(), 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(attributeType), "Passed!: contains -> true" );
				assert.ok( !list.contains(attributeType), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equalsTypesIn(list2), "Passed!: equals -> true" );
				assert.ok( !list.equalsTypesIn(list2), "Passed!: equals -> false" );
				
				//getItem
				assert.ok( list2.getAttributeWithTypeOf(attributeType).equalsTypeOf(attributeType), "Passed!: getItem" );
				assert.ok( !list.getAttributeWithTypeOf(attributeType), "Passed!: getItem -> undefined" );
				
				//removeItem
				list2.removeAttributeWithTypeOf(attributeType);
				assert.equal( list2.size(),2, "Passed!: removeItem" );
				assert.ok( !list2.getItem('(testName:integer)'), "Passed!: item removed" );
				list.removeAttributeWithTypeOf(attributeType);
				assert.equal( list.size(), 2, "Passed!: removeItem: key does not exist" );
				
				//getItems
				assert.equal( list2.getItems().length, 2, "Passed!: getItems" );
				assert.ok( list2.getItems()[0].equalsTypeOf(latitudeType), "Passed!: getItems -> latitude" );
				assert.ok( list2.getItems()[1].equalsTypeOf(longitudeType), "Passed!: getItems -> longitude" );
				
				//empty
				var list3 = new contactJS.AttributeList();
				assert.ok( !list2.isEmpty(), "Passed!: isEmpty ->true" );
				assert.ok( list3.isEmpty(), "Passed!: isEmpty ->false" );
				
				//clear
				list2.clear();
				assert.ok( list2.isEmpty(), "Passed!: clear: isEmpty ->true" );
				assert.equal( list2.getItems().length, 0, "Passed!: clear: length == 0 ->true" );
			});

	});
});