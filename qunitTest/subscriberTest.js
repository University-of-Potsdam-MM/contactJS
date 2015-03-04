require(['configTest'], function() {
	require(['subscriber', 'attributeTypeList', 'attributeType', 'callback', 'callbackList', 'parameter'],function(Subscriber, AttributeTypeList, AttributeType, Callback, CallbackList, Parameter){
		
			QUnit.test( "Subscriber", function( assert ) {
				
				var parameter = new Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType = new AttributeType();
				var attributeType2 = new AttributeType().withName('testName').
										withType('integer').withParameter(parameter);
				var attArray = new Array();
				attArray.push(attributeType);
				var attList = new AttributeTypeList().withItems(attArray);
				
				attArray.push(attributeType2);
				var attList2 = new AttributeTypeList().withItems(attArray);
				var call = new Callback().withName('test').withAttributeTypes(attList2);
				
				var callArray = new Array();
				callArray.push(call);
				var callList = new CallbackList().withItems(callArray);
				
				var subscriber = new Subscriber().withSubscriberName('test')
										.withSubscriberId('test2')
										.withSubscriptionCallbacks(callList)
										.withAttributesSubset(attList);
				
				var subscriber2 = new Subscriber().withSubscriberName('test')
										.withSubscriberId('test2')
										.withSubscriptionCallbacks(callList)
										.withAttributesSubset(attList);
				var subscriber3 = new Subscriber().withSubscriberName('test')
										.withSubscriberId('test3')
										.withSubscriptionCallbacks(callList);
				var test = subscriber.getAttributesSubset();
				
				
				assert.ok(test.size() == 1,"Passed!: AttributeSubset.size() == 1");
				assert.ok( subscriber.equals(subscriber2),"Passed!: equals -> true" );
				assert.ok( !subscriber.equals(subscriber3),"Passed!: equals -> false" );

			});

	});
});