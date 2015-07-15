require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "AttributeType", function( assert ) {
				
				var attributeType = new contactJS.Attribute();
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType2 = new contactJS.Attribute().withName('testName').
										withType('integer').withParameter(parameter);

				assert.ok( attributeType2.equalsTypeOf(attributeType2),"Passed!: equals -> true" );
				assert.ok( !attributeType2.equalsTypeOf(attributeType),"Passed!: equals -> false" );
			});

	});
});