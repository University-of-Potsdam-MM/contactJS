require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "ContextInformationList", function( assert ) {
				var discoverer = new contactJS.Discoverer();

		    	var latitudeContextInformation = discoverer.buildContextInformation('latitude', 'double', [['testKey', 'testType', 'testValue']]);
				var longitudeContextInformation = discoverer.buildContextInformation('longitude', 'double').withValue('here');
				var contextInformation = discoverer.buildContextInformation('testName', 'integer');

				var array = [];
				array.push(latitudeContextInformation);
				array.push(longitudeContextInformation);
				var list = new contactJS.ContextInformationList().withItems(array);
				assert.equal( list.size(), 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.ContextInformationList();
				list2.put(contextInformation);
				
				assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.equal( list2.size(), 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(contextInformation), "Passed!: contains -> true" );
				assert.ok( !list.contains(contextInformation), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.isKindOf(list2), "Passed!: equals -> true" );
				assert.ok( !list.isKindOf(list2), "Passed!: equals -> false" );
				
				//getItem
				assert.ok( list2.getContextInformationOfKind(contextInformation).isKindOf(contextInformation), "Passed!: getItem" );
				assert.ok( !list.getContextInformationOfKind(contextInformation), "Passed!: getItem -> undefined" );
				
				//removeItem
				list2.removeContextInformationOfKind(contextInformation);
				assert.equal( list2.size(),2, "Passed!: removeItem" );
				assert.ok( !list2.getItem('(testName:integer)'), "Passed!: item removed" );
				list.removeContextInformationOfKind(contextInformation);
				assert.equal( list.size(), 2, "Passed!: removeItem: key does not exist" );
				
				//getItems
				assert.equal( list2.getItems().length, 2, "Passed!: getItems" );
				assert.ok( list2.getItems()[0].isKindOf(latitudeContextInformation), "Passed!: getItems -> latitude" );
				assert.ok( list2.getItems()[1].isKindOf(longitudeContextInformation), "Passed!: getItems -> longitude" );
				
				//empty
				var list3 = new contactJS.ContextInformationList();
				assert.ok( !list2.isEmpty(), "Passed!: isEmpty ->true" );
				assert.ok( list3.isEmpty(), "Passed!: isEmpty ->false" );
				
				//clear
				list2.clear();
				assert.ok( list2.isEmpty(), "Passed!: clear: isEmpty ->true" );
				assert.equal( list2.getItems().length, 0, "Passed!: clear: length == 0 ->true" );

				//getSubset
				var sublist = new contactJS.ContextInformationList();
				sublist.put(latitudeContextInformation);
				var subset = list.getSubset(sublist);
				assert.equal( subset.size(), 1, "Passed!: Subset contains only one value" );
				assert.ok( subset.contains(latitudeContextInformation), "Passed!: subset contains latitude" );
				assert.ok( !subset.contains(longitudeContextInformation), "Passed!: subset not contains longitude" );

				//getSubsetWithoutItems
				var subset2 = list.getSubsetWithoutItems(sublist);
				assert.equal( subset2.size(), 1, "Passed!: Subset contains only one value" );
				assert.ok( !subset2.contains(latitudeContextInformation), "Passed!: subset not contains latitude" );
				assert.ok( subset2.contains(longitudeContextInformation), "Passed!: subset contains longitude" );
			});

	});
});