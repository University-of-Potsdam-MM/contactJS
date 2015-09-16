require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "AttributeTypeList", function( assert ) {
				var discoverer = new contactJS.Discoverer();

		    	var latitudeAttribute = discoverer.buildAttribute('latitude', 'double', [['testKey', 'testType', 'testValue']]);
				var longitudeAttribute = discoverer.buildAttribute('longitude', 'double').withValue('here');
				var attribute = discoverer.buildAttribute('testName', 'integer');

				var array = [];
				array.push(latitudeAttribute);
				array.push(longitudeAttribute);
				var list = new contactJS.AttributeList().withItems(array);
				assert.equal( list.size(), 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.AttributeList();
				list2.put(attribute);
				
				assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.equal( list2.size(), 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(attribute), "Passed!: contains -> true" );
				assert.ok( !list.contains(attribute), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equalsTypesIn(list2), "Passed!: equals -> true" );
				assert.ok( !list.equalsTypesIn(list2), "Passed!: equals -> false" );
				
				//getItem
				assert.ok( list2.getAttributeWithTypeOf(attribute).equalsTypeOf(attribute), "Passed!: getItem" );
				assert.ok( !list.getAttributeWithTypeOf(attribute), "Passed!: getItem -> undefined" );
				
				//removeItem
				list2.removeAttributeWithTypeOf(attribute);
				assert.equal( list2.size(),2, "Passed!: removeItem" );
				assert.ok( !list2.getItem('(testName:integer)'), "Passed!: item removed" );
				list.removeAttributeWithTypeOf(attribute);
				assert.equal( list.size(), 2, "Passed!: removeItem: key does not exist" );
				
				//getItems
				assert.equal( list2.getItems().length, 2, "Passed!: getItems" );
				assert.ok( list2.getItems()[0].equalsTypeOf(latitudeAttribute), "Passed!: getItems -> latitude" );
				assert.ok( list2.getItems()[1].equalsTypeOf(longitudeAttribute), "Passed!: getItems -> longitude" );
				
				//empty
				var list3 = new contactJS.AttributeList();
				assert.ok( !list2.isEmpty(), "Passed!: isEmpty ->true" );
				assert.ok( list3.isEmpty(), "Passed!: isEmpty ->false" );
				
				//clear
				list2.clear();
				assert.ok( list2.isEmpty(), "Passed!: clear: isEmpty ->true" );
				assert.equal( list2.getItems().length, 0, "Passed!: clear: length == 0 ->true" );

				//getSubset
				var sublist = new contactJS.AttributeList();
				sublist.put(latitudeAttribute);
				var subset = list.getSubset(sublist);
				assert.equal( subset.size(), 1, "Passed!: Subset contains only one value" );
				assert.ok( subset.contains(latitudeAttribute), "Passed!: subset contains latitude" );
				assert.ok( !subset.contains(longitudeAttribute), "Passed!: subset not contains longitude" );

				//getSubsetWithoutItems
				var subset2 = list.getSubsetWithoutItems(sublist);
				assert.equal( subset2.size(), 1, "Passed!: Subset contains only one value" );
				assert.ok( !subset2.contains(latitudeAttribute), "Passed!: subset not contains latitude" );
				assert.ok( subset2.contains(longitudeAttribute), "Passed!: subset contains longitude" );
			});

	});
});