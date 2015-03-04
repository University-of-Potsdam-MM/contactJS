require(['configTest'], function() {
	require(['equals', 'attributeType'],function(Equals, AttributeType){
		
			QUnit.test( "Equals", function( assert ) {
				
		    	var method = new Equals();
		    	
//		    	var testA = new AttributeType().withName('test').withType('string');
//		    	var testA2 = new AttributeType().withName('test').withType('string');
				
		    	
				assert.ok( method.process(null, 'test', 'test'), "Passed!: equals -> true" );
				assert.ok( method.process(null, 1, 1), "Passed!: equals -> true" );
//				assert.ok( method.process(null, testA, testA2), "Passed!: equals -> true" );
				assert.ok( !method.process(null, '2', 2), "Passed!: equals -> false" );
				assert.ok( !method.process(null, 3, 2),"Passed!: equals -> false" );
				assert.ok( !method.process(null, 'test','test3'),"Passed!: equals -> false" );
			});

	});
});