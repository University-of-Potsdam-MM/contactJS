require(['configTest'], function() {
	require(['condition', 'equals', 'unequals', 'attributeValue'],function(Condition, Equals, UnEquals, AttributeValue){
		
			QUnit.test( "Condition", function( assert ) {
				
				var testA = new AttributeValue().withName('test').withType('string').withValue('blubb');
		    	var testA2 = new AttributeValue().withName('test').withType('string').withValue('blubb2');
		    	
		    	var method = new Equals();
		    	var method2 = new UnEquals();

		    	var conditionTest = new Condition().withAttributeType(testA.getAttributeType())
		    									.withComparisonMethod(method);
		    	var conditionTest2 = new Condition().withAttributeType(testA.getAttributeType())
												.withComparisonMethod(method);	
		    	var conditionTest3 = new Condition().withAttributeType(testA.getAttributeType())
												.withComparisonMethod(method2);	
		    	
		    	
		    	assert.ok( conditionTest.equals(conditionTest2),"Passed!: equals -> true" );
				assert.ok( !conditionTest.equals(conditionTest3),"Passed!: equals -> false" );
						
				assert.ok( conditionTest.compare(testA, testA),"Passed!: conditionMethod equal -> true" );
				assert.ok( !conditionTest.compare(testA, testA2),"Passed!: conditionMethod equal -> false" );
				assert.ok( conditionTest3.compare(testA, testA2),"Passed!: conditionMethod unequal -> true" );
				assert.ok( !conditionTest3.compare(testA, testA),"Passed!: conditionMethod unequal -> false" );
			});

	});
});