require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "ParameterList", function( assert ) {

				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				var parameter2 = new contactJS.Parameter().withKey('testKey2').withValue('testValue2');
				var parameter3 = new contactJS.Parameter().withKey('testKey3').withValue('testValue3');

				var array = new Array();
				array.push(parameter2);
				array.push(parameter3);

				var list = new contactJS.ParameterList().withItems(array);
				assert.ok( list.size() == 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.ParameterList();
				list2.put(parameter);
				
				assert.ok( list2.size() == 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.ok( list2.size() == 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(parameter), "Passed!: contains -> true" );
				assert.ok( !list.contains(parameter), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equals(list2), "Passed!: equals -> true" );
				assert.ok( !list.equals(list2), "Passed!: equals -> false" );
				
			});

	});
});