require(['configTest'], function() {
	require(['unequals', 'attributeType'],function(UnEquals, AttributeType){
		
			QUnit.test( "UnEquals", function( assert ) {
				
		    	var method = new UnEquals();
		    	
//		    	var testA = new AttributeType().withName('test').withType('string');
//		    	var testA2 = new AttributeType().withName('test').withType('string');
				
		    	
				assert.ok( method.process('test', 'test2'), "Passed!: unequals -> true" );
				assert.ok( method.process(null, 1, 2), "Passed!: unequals -> true" );
//				assert.ok( method.process(null, testA, testA2), "Passed!: equals -> true" );
				assert.ok( method.process(null, '2', 2), "Passed!: unequals -> true" );
				assert.ok( !method.process(null, 2, 2),"Passed!: unequals -> false" );
				assert.ok( !method.process(null, 'test','test'),"Passed!: unequals -> false" );
			});

	});
});