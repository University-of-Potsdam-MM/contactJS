require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "Callback", function( assert ) {
				var discoverer = new contactJS.Discoverer();

				var contextInformation = discoverer.buildContextInformation('', '');
				var contextInformation2 = discoverer.buildContextInformation('testName', 'integer', [['testKey', 'testType', 'testValue']]);

				var array = [];
				array.push(contextInformation);
				var attList = new contactJS.ContextInformationList().withItems(array);
				var call = new contactJS.Callback().withName('test').withContextInformation(array);
				var call2 = new contactJS.Callback().withName('test').withContextInformation(attList);
				
				array.push(contextInformation2);
				var attList2 = new contactJS.ContextInformationList().withItems(array);
				var call3 = new contactJS.Callback().withName('test').withContextInformation(attList2);
				var call4 = new contactJS.Callback().withName('test1').withContextInformation(attList2);
				
				assert.ok( call.equals(call2),"Passed!: equals -> true" );
				assert.ok( !call.equals(call3),"Passed!: equals -> false" );
				assert.ok( !call4.equals(call3),"Passed!: equals -> false" );
			});

	});
});