require(['configTest'], function() {
	require(['attributeTypeList', 'attributeType','callback', 'parameter', 'callbackList'],function(AttributeTypeList, AttributeType, Callback, Parameter, CallbackList){
		
			QUnit.test( "CallbackList", function( assert ) {
				
				
				var attributeType = new AttributeType();
				
				var parameter = new Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType2 = new AttributeType().withName('testName').
										withType('integer').withParameter(parameter);
				var array = new Array();
				array.push(attributeType);
				var attList = new AttributeTypeList().withItems(array);
				
				var call = new Callback().withName('test').withAttributeTypes(array);
				var call2 = new Callback().withName('test2').withAttributeTypes(attList);
				var call3 = new Callback().withName('test3').withAttributeTypes(attList);
				
				var array = new Array();
				array.push(call2);
				array.push(call3);
				var list = new CallbackList().withItems(array);
				assert.equal( list.size(),2, "Passed!: Builder (withItems)" );
				
				var list2 = new CallbackList();
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