require(['configTest'], function() {
	require(['attributeType', 'parameter'],function(AttributeType, Parameter){
		
			QUnit.test( "AttributeType", function( assert ) {
				
				var attributeType = new AttributeType();
				
				var parameter = new Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType2 = new AttributeType().withName('testName').
										withType('integer').withParameter(parameter);
				assert.ok( attributeType2.equals(attributeType2),"Passed!: equals -> true" );
				assert.ok( !attributeType2.equals(attributeType),"Passed!: equals -> false" );
			});

	});
});