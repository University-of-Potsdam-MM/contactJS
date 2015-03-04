require(['configTest'], function() {
	require(['parameter'],function(Parameter){
		
			QUnit.test( "Parameter", function( assert ) {
				
								
				var parameter = new Parameter().withKey('testKey').withValue('testValue');
				var parameter2 = new Parameter().withKey('testKey').withValue('testValue');
				var parameter3 = new Parameter().withKey('testName2').
										withValue('integer');
				assert.ok( parameter.equals(parameter2), "Passed!: equal");
				assert.ok( !parameter.equals(parameter3), "Passed!: unequal");
			});

	});
});