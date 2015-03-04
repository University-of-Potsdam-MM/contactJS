require(['configTest'], function() {
	require(['attributeTypeList', 'attributeType','callback', 'parameter'],function(AttributeTypeList, AttributeType, Callback, Parameter){
		
			QUnit.test( "Callback", function( assert ) {
				
				var attributeType = new AttributeType();
				
				var parameter = new Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType2 = new AttributeType().withName('testName').
										withType('integer').withParameter(parameter);
				var array = new Array();
				array.push(attributeType);
				var attList = new AttributeTypeList().withItems(array);
				var call = new Callback().withName('test').withAttributeTypes(array);
				var call2 = new Callback().withName('test').withAttributeTypes(attList);
				
				array.push(attributeType2);
				var attList2 = new AttributeTypeList().withItems(array);
				var call3 = new Callback().withName('test').withAttributeTypes(attList2);
				var call4 = new Callback().withName('test1').withAttributeTypes(attList2);
				
				assert.ok( call.equals(call2),"Passed!: equals -> true" );
				assert.ok( !call.equals(call3),"Passed!: equals -> false" );
				assert.ok( !call4.equals(call3),"Passed!: equals -> false" );
			});

	});
});