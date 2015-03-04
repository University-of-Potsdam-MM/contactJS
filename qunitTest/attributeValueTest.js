require(['configTest'], function() {
	require(['easejs', 'attributeType','attributeValue', 'parameter'],function(easejs, AttributeType, AttributeValue, Parameter){
		
			QUnit.test( "AttributeValue", function( assert ) {
				

				var attributeValue = new AttributeValue();
				
				var parameter = new Parameter().withKey('testKey').withValue('testValue');			
				var date = new Date();
				var attributeValue2 = new AttributeValue().withName('testName').
										withType('integer').withParameter(parameter).
										withValue('testValue').withTimestamp(date);
				
				var attributeValue3 = new AttributeValue().withName('testName').withType('integer')
										.withParameter(parameter).withValue('testValue')
										.withTimestamp(date);


				assert.equal( attributeValue2.getParameters().size(), 1, "Passed!: withParameter() -> size == 1" );
				
				assert.ok( attributeValue2.equals(attributeValue3),"Passed!: equals -> true" );
				assert.ok( !attributeValue2.equals(attributeValue),"Passed!: equals -> false" );
				
				var attributeValue3 = new AttributeValue().withName('testName').
						withType('integer').withParameter(parameter).
						withValue('testValue').withTimestamp(new Date());
				assert.ok( attributeValue2.equals(attributeValue3),"Passed!: equals -> date is not verified" );
				/*
				 * getAttributeType
				 */
				var attributeType = new AttributeType().withName('testName').
				withType('integer').withParameter(parameter);
				
				assert.ok( attributeValue2.getAttributeType().equals(attributeType),"Passed!: getAttributeType()" );
				
			});

	});
});