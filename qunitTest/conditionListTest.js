require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		QUnit.test( "ConditionList", function( assert ) {
			var discoverer = new contactJS.Discoverer();

			var contextInformation = discoverer.buildContextInformation('test', 'string');
			var contextInformation2 = discoverer.buildContextInformation('test', 'string');

			var method = new contactJS.Equals();
			var method2 = new contactJS.UnEquals();

			var condition = new contactJS.Condition().withName('condition').withContextInformation(contextInformation).withComparisonMethod(method);
			var condition2 = new contactJS.Condition().withName('condition2').withContextInformation(contextInformation2).withComparisonMethod(method);
			var condition3 = new contactJS.Condition().withName('condition3').withContextInformation(contextInformation).withComparisonMethod(method2);

			var list = new contactJS.ConditionList().withItems([condition2, condition3]);
			assert.equal(list.size(), 2, "Passed!: Builder (withItems)" );

			var list2 = new contactJS.ConditionList();
			list2.put(condition);

			assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );

			list2.putAll([condition2, condition3]);
			assert.equal( list2.size(), 3, "Passed!: Put another two type to list (putAll)" );

			//contains
			assert.ok( list2.contains(condition), "Passed!: contains -> true" );
			assert.ok( !list.contains(condition), "Passed!: contains -> false" );

			//equals
			assert.ok( list2.equals(list2), "Passed!: equals -> true" );
			assert.ok( !list.equals(list2), "Passed!: equals -> false" );
		});
	});
});