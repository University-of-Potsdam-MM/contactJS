require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "Parameter", function( assert ) {
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				var parameter2 = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				var parameter3 = new contactJS.Parameter().withKey('testName2').
										withValue('integer');
				assert.ok( parameter.equals(parameter2), "Passed!: equal");
				assert.ok( !parameter.equals(parameter3), "Passed!: unequal");
			});

	});
});