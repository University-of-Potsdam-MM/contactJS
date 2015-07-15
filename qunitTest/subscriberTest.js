require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "Subscriber", function( assert ) {
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType = new contactJS.Attribute();
				var attributeType2 = new contactJS.Attribute().withName('testName').withType('integer').withParameter(parameter);

				var attList = new contactJS.AttributeList().withItems([attributeType]);
				var attList2 = new contactJS.AttributeList().withItems([attributeType, attributeType2]);

				var call = new contactJS.Callback().withName('test').withAttributeTypes(attList2);

				var callList = new contactJS.CallbackList().withItems([call]);
				
				var subscriber = new contactJS.Subscriber().withSubscriberName('test')
										.withSubscriberId('test2')
										.withSubscriptionCallbacks(callList)
										.withAttributesSubset(attList);
				
				var subscriber2 = new contactJS.Subscriber().withSubscriberName('test')
										.withSubscriberId('test2')
										.withSubscriptionCallbacks(callList)
										.withAttributesSubset(attList);

				var subscriber3 = new contactJS.Subscriber().withSubscriberName('test')
										.withSubscriberId('test3')
										.withSubscriptionCallbacks(callList);

				var test = subscriber.getAttributesSubset();

				assert.equal(test.size(), 1, "Passed!: AttributeSubset.size() == 1");
				assert.ok( subscriber.equals(subscriber2),"Passed!: equals -> true" );
				assert.ok( !subscriber.equals(subscriber3),"Passed!: equals -> false" );

			});

	});
});