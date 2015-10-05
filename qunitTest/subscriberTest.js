require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "Subscriber", function( assert ) {
				var discoverer = new contactJS.Discoverer();

				var contextInformation = discoverer.buildContextInformation('', '');
				var contextInformation2 = discoverer.buildContextInformation('testName', 'integer', [['testKey', 'testType', 'testValue']]);

				var attList = new contactJS.ContextInformationList().withItems([contextInformation]);
				var attList2 = new contactJS.ContextInformationList().withItems([contextInformation, contextInformation2]);

				var call = new contactJS.Callback().withName('test').withContextInformation(attList2);

				var callList = new contactJS.CallbackList().withItems([call]);
				
				var subscriber = new contactJS.Subscriber().withSubscriberName('test')
										.withSubscriberId('test2')
										.withSubscriptionCallbacks(callList)
										.withContextInformationSubset(attList);
				
				var subscriber2 = new contactJS.Subscriber().withSubscriberName('test')
										.withSubscriberId('test2')
										.withSubscriptionCallbacks(callList)
										.withContextInformationSubset(attList);

				var subscriber3 = new contactJS.Subscriber().withSubscriberName('test')
										.withSubscriberId('test3')
										.withSubscriptionCallbacks(callList);

				var test = subscriber.getContextInformationSubset();

				assert.equal(test.size(), 1, "Passed!: AttributeSubset.size() == 1");
				assert.ok( subscriber.equals(subscriber2),"Passed!: equals -> true" );
				assert.ok( !subscriber.equals(subscriber3),"Passed!: equals -> false" );

			});

	});
});