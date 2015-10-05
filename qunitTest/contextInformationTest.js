require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "ContextInformation", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				var date = new Date();

				var contextInformation = discoverer.buildContextInformation('', '');
				var contextInformation2 = discoverer.buildContextInformation('testName', 'integer', [['testKey', 'testType', 'testValue']]).withValue('testValue').withTimestamp(date);
				var contextInformation3 = discoverer.buildContextInformation('testName', 'integer', [['testKey', 'testType', 'testValue']]).withValue('testValue').withTimestamp(date);

				// types tests
				assert.ok( contextInformation2.isKindOf(contextInformation2),"Passed!: equals -> true" );
				assert.ok( !contextInformation2.isKindOf(contextInformation),"Passed!: equals -> false" );

				var contextInformation4 = discoverer.buildContextInformation('testName', 'integer', [['testKey', 'testType', 'testValue']]);
				assert.ok( contextInformation2.isKindOf(contextInformation4),"Passed!: equalsTypeOf()" );

				// value tests
				assert.equal( contextInformation2.getParameters().size(), 1, "Passed!: withParameter() -> size == 1" );
				
				assert.ok( contextInformation2.equals(contextInformation3),"Passed!: equals -> true" );
				assert.ok( !contextInformation2.equals(contextInformation),"Passed!: equals -> false" );
				
				contextInformation3 = discoverer.buildContextInformation('testName', 'integer', [['testKey', 'testType', 'testValue']]).withValue('testValue').withTimestamp(new Date());

				assert.ok( contextInformation2.equals(contextInformation3),"Passed!: equals -> date is not verified" );
			});

	});
});