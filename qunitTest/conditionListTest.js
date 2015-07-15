require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		QUnit.test( "ConditionList", function( assert ) {
			var type = new contactJS.Attribute().withName('test').withType('string');
			var type2 = new contactJS.Attribute().withName('test').withType('string');

			var method = new contactJS.Equals();
			var method2 = new contactJS.UnEquals();

			var condition = new contactJS.Condition().withName('condition').withAttributeType(type)
											.withComparisonMethod(method);
			var condition2 = new contactJS.Condition().withName('condition2').withAttributeType(type2)
											.withComparisonMethod(method);
			var condition3 = new contactJS.Condition().withName('condition3').withAttributeType(type)
											.withComparisonMethod(method2);

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