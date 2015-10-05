require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "Condition", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				
				var contextInformation = discoverer.buildContextInformation('test', 'string').withValue('foo');
		    	var contextInformation2 = discoverer.buildContextInformation('test', 'string').withValue('bar');
		    	
		    	var method = new contactJS.Equals();
		    	var method2 = new contactJS.UnEquals();

		    	var conditionTest = new contactJS.Condition().withContextInformation(contextInformation).withComparisonMethod(method);
		    	var conditionTest2 = new contactJS.Condition().withContextInformation(contextInformation).withComparisonMethod(method);
		    	var conditionTest3 = new contactJS.Condition().withContextInformation(contextInformation).withComparisonMethod(method2);
		    	
		    	assert.ok( conditionTest.equals(conditionTest2),"Passed!: equals -> true" );
				assert.ok( !conditionTest.equals(conditionTest3),"Passed!: equals -> false" );
						
				assert.ok( conditionTest.compare(contextInformation, contextInformation),"Passed!: conditionMethod equal -> true" );
				assert.ok( !conditionTest.compare(contextInformation, contextInformation2),"Passed!: conditionMethod equal -> false" );
				assert.ok( conditionTest3.compare(contextInformation, contextInformation2),"Passed!: conditionMethod unequal -> true" );
				assert.ok( !conditionTest3.compare(contextInformation, contextInformation),"Passed!: conditionMethod unequal -> false" );
			});

	});
});