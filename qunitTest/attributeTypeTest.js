require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "AttributeType", function( assert ) {
				
				var attributeType = new contactJS.AttributeType();
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType2 = new contactJS.AttributeType().withName('testName').
										withType('integer').withParameter(parameter);
				assert.ok( attributeType2.equals(attributeType2),"Passed!: equals -> true" );
				assert.ok( !attributeType2.equals(attributeType),"Passed!: equals -> false" );
			});

	});
});