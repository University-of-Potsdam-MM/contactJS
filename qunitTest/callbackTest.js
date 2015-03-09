require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "Callback", function( assert ) {
				
				var attributeType = new contactJS.AttributeType();
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType2 = new contactJS.AttributeType().withName('testName').
										withType('integer').withParameter(parameter);
				var array = new Array();
				array.push(attributeType);
				var attList = new contactJS.AttributeTypeList().withItems(array);
				var call = new contactJS.Callback().withName('test').withAttributeTypes(array);
				var call2 = new contactJS.Callback().withName('test').withAttributeTypes(attList);
				
				array.push(attributeType2);
				var attList2 = new contactJS.AttributeTypeList().withItems(array);
				var call3 = new contactJS.Callback().withName('test').withAttributeTypes(attList2);
				var call4 = new contactJS.Callback().withName('test1').withAttributeTypes(attList2);
				
				assert.ok( call.equals(call2),"Passed!: equals -> true" );
				assert.ok( !call.equals(call3),"Passed!: equals -> false" );
				assert.ok( !call4.equals(call3),"Passed!: equals -> false" );
			});

	});
});