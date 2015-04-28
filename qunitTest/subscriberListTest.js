require(['configTest'], function() {
	require(['contactJS'],
			function(contactJS){
		
			QUnit.test( "SubscriberList", function( assert ) {
				
				var attributeType2 = new contactJS.Attribute().withName('testName').withType('integer');

				var attList = new contactJS.AttributeList().withItems([attributeType2]);

				var call = new contactJS.Callback().withName('test').withAttributeTypes(attList);
				var callList = new contactJS.CallbackList().withItems([call]);
			
				var subscriber = new contactJS.Subscriber().withSubscriberName('test')
									.withSubscriberId('test')
									.withSubscriptionCallbacks(callList)
									.withAttributesSubset(attList);
			
				var subscriber2 = new contactJS.Subscriber().withSubscriberName('test1')
									.withSubscriberId('test1')
									.withSubscriptionCallbacks(callList)
									.withAttributesSubset(attList);
				var subscriber3 = new contactJS.Subscriber().withSubscriberName('test2')
									.withSubscriberId('test2')
									.withSubscriptionCallbacks(callList);

				var list = new contactJS.SubscriberList().withItems([subscriber2, subscriber3]);
				assert.ok( list.size() == 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.SubscriberList();
				list2.put(subscriber);
				
				assert.ok( list2.size() == 1, "Passed!: Put type to list (put)" );
				
				list2.putAll([subscriber2, subscriber3]);
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