require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "CallbackList", function( assert ) {
				
				
				var attribute = new contactJS.Attribute();
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				
				var attribute2 = new contactJS.Attribute().withName('testName').withType('integer').withParameter(parameter);

				var array = [];
				array.push(attribute);
				var attList = new contactJS.AttributeList().withItems(array);
				
				var call = new contactJS.Callback().withName('test').withAttributeTypes(array);
				var call2 = new contactJS.Callback().withName('test2').withAttributeTypes(attList);
				var call3 = new contactJS.Callback().withName('test3').withAttributeTypes(attList);
				
				var array = [];
				array.push(call2);
				array.push(call3);
				var list = new contactJS.CallbackList().withItems(array);
				assert.equal( list.size(),2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.CallbackList();
				list2.put(call);
				
				assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.equal( list2.size(), 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(call), "Passed!: contains -> true" );
				assert.ok( !list.contains(call), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equals(list2), "Passed!: equals -> true" );
				assert.ok( !list.equals(list2), "Passed!: equals -> false" );
				
			});

	});
});