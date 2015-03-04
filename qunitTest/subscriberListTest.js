require(['configTest'], function() {
	require(['subscriber', 'attributeTypeList', 'attributeType', 'callback', 'callbackList', 'subscriberList'],
			function(Subscriber, AttributeTypeList, AttributeType, Callback, CallbackList, SubscriberList){
		
			QUnit.test( "SubscriberList", function( assert ) {
				
			var attributeType2 = new AttributeType().withName('testName').
									withType('integer');
			var attArray = new Array();
			attArray.push(attributeType2);
			var attList = new AttributeTypeList().withItems(attArray);
			var call = new Callback().withName('test').withAttributeTypes(attList);
			
			var callArray = new Array();
			callArray.push(call);
			var callList = new CallbackList().withItems(callArray);
			
			var subscriber = new Subscriber().withSubscriberName('test')
									.withSubscriberId('test')
									.withSubscriptionCallbacks(callList)
									.withAttributesSubset(attList);
			
			var subscriber2 = new Subscriber().withSubscriberName('test1')
									.withSubscriberId('test1')
									.withSubscriptionCallbacks(callList)
									.withAttributesSubset(attList);
			var subscriber3 = new Subscriber().withSubscriberName('test2')
									.withSubscriberId('test2')
									.withSubscriptionCallbacks(callList);
				
				var array = new Array();
				array.push(subscriber2);
				array.push(subscriber3);
				var list = new SubscriberList().withItems(array);
				assert.ok( list.size() == 2, "Passed!: Builder (withItems)" );
				
				var list2 = new SubscriberList();
				list2.put(subscriber);
				
				assert.ok( list2.size() == 1, "Passed!: Put type to list (put)" );
				
				list2.putAll(array);
				assert.ok( list2.size() == 3, "Passed!: Put another two type to list (putAll)" );
				
				//contains
				assert.ok( list2.contains(subscriber), "Passed!: contains -> true" );
				assert.ok( !list.contains(subscriber), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equals(list2), "Passed!: equals -> true" );
				assert.ok( !list.equals(list2), "Passed!: equals -> false" );
				
			});

	});
});