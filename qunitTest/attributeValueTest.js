require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "AttributeValue", function( assert ) {
				

				var attributeValue = new contactJS.Attribute();
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				var date = new Date();
				var attributeValue2 = new contactJS.Attribute().withName('testName').
										withType('integer').withParameter(parameter).
										withValue('testValue').withTimestamp(date);
				
				var attributeValue3 = new contactJS.Attribute().withName('testName').withType('integer')
										.withParameter(parameter).withValue('testValue')
										.withTimestamp(date);


				assert.equal( attributeValue2.getParameters().size(), 1, "Passed!: withParameter() -> size == 1" );
				
				assert.ok( attributeValue2.equalsValueOf(attributeValue3),"Passed!: equals -> true" );
				assert.ok( !attributeValue2.equalsValueOf(attributeValue),"Passed!: equals -> false" );
				
				var attributeValue3 = new contactJS.Attribute().withName('testName').
						withType('integer').withParameter(parameter).
						withValue('testValue').withTimestamp(new Date());
				assert.ok( attributeValue2.equalsValueOf(attributeValue3),"Passed!: equals -> date is not verified" );
				/*
				 * getAttributeType
				 */
				var attributeType = new contactJS.Attribute().withName('testName').
				withType('integer').withParameter(parameter);
				
				assert.ok( attributeValue2.equalsTypeOf(attributeType),"Passed!: getAttributeType()" );
				
			});

	});
});