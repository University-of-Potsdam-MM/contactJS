require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "AttributeValue", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				var date = new Date();

				var attribute = discoverer.buildAttribute('', '');
				var attribute2 = discoverer.buildAttribute('testName', 'integer', [['testKey', 'testType', 'testValue']]).withValue('testValue').withTimestamp(date);
				var attribute3 = discoverer.buildAttribute('testName', 'integer', [['testKey', 'testType', 'testValue']]).withValue('testValue').withTimestamp(date);

				// types tests
				assert.ok( attribute2.equalsTypeOf(attribute2),"Passed!: equals -> true" );
				assert.ok( !attribute2.equalsTypeOf(attribute),"Passed!: equals -> false" );

				var attributeType = discoverer.buildAttribute('testName', 'integer', [['testKey', 'testType', 'testValue']]);
				assert.ok( attribute2.equalsTypeOf(attributeType),"Passed!: equalsTypeOf()" );

				// value tests
				assert.equal( attribute2.getParameters().size(), 1, "Passed!: withParameter() -> size == 1" );
				
				assert.ok( attribute2.equalsValueOf(attribute3),"Passed!: equals -> true" );
				assert.ok( !attribute2.equalsValueOf(attribute),"Passed!: equals -> false" );
				
				attribute3 = discoverer.buildAttribute('testName', 'integer', [['testKey', 'testType', 'testValue']]).withValue('testValue').withTimestamp(new Date());

				assert.ok( attribute2.equalsValueOf(attribute3),"Passed!: equals -> date is not verified" );
			});

	});
});