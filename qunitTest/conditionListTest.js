require(['configTest'], function() {
	require(['condition', 'equals', 'unequals', 'conditionList', 'attributeType'],function(Condition, Equals, UnEquals, ConditionList, AttributeType){
		
			QUnit.test( "ConditionList", function( assert ) {
				
				var type = new AttributeType().withName('test').withType('string');
		    	var type2 = new AttributeType().withName('test').withType('string');
		    	
				var method = new Equals();
		    	var method2 = new UnEquals();

		    	var condition = new Condition().withName('condition').withAttributeType(type)
		    									.withComparisonMethod(method);
		    	var condition2 = new Condition().withName('condition2').withAttributeType(type2)
												.withComparisonMethod(method);	
		    	var condition3 = new Condition().withName('condition3').withAttributeType(type)
												.withComparisonMethod(method2);	
				
				var array = new Array();
				array.push(condition2);
				array.push(condition3);
				var list = new ConditionList().withItems(array);
				assert.equal( list.size(), 2, "Passed!: Builder (withItems)" );
				
				var list2 = new ConditionList();
				list2.put(condition);
				
				assert.equal( list2.size(), 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
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