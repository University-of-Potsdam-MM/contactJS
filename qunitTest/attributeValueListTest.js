require(['configTest'], function() {
	require(['contactJS'],
			function(contactJS){
		
			QUnit.test( "AttributeValueList", function( assert ) {
				
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
								
		    	var latitudeValue = new contactJS.Attribute().withName('latitude')
											.withType('double').withValue('there').withParameter(parameter);
				var longitudeValue = new contactJS.Attribute().withName('longitude')
											.withType('double').withValue('here');
				var attributeValue = new contactJS.Attribute().withName('testName')
											.withType('integer');
				
				var array = [];
				array.push(latitudeValue);
				array.push(longitudeValue);
				var list = new contactJS.AttributeList().withItems(array);
				assert.ok( list.size() == 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.AttributeList();
				list2.put(attributeValue);
				
				assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.equal( list2.size(), 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(attributeValue), "Passed!: contains -> true" );
				assert.ok( !list.contains(attributeValue), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equals(list2), "Passed!: equals -> true" );
				assert.ok( !list.equals(list2), "Passed!: equals -> false" );
				
				//getSubset
				var sublist = new contactJS.AttributeList();
				sublist.put(latitudeValue);
				var subset = list.getSubset(sublist);
				assert.equal( subset.size(), 1, "Passed!: Subset contains only one value" );
				assert.ok( subset.contains(latitudeValue), "Passed!: subset contains latitude" );
				assert.ok( !subset.contains(longitudeValue), "Passed!: subset not contains longitude" );
				//getSubsetWithoutItems
				var subset2 = list.getSubsetWithoutItems(sublist);
				assert.equal( subset2.size(), 1, "Passed!: Subset contains only one value" );
				assert.ok( !subset2.contains(latitudeValue), "Passed!: subset not contains latitude" );
				assert.ok( subset2.contains(longitudeValue), "Passed!: subset contains longitude" );
			});

	});
});