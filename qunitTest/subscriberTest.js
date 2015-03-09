require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "Subscriber", function( assert ) {
				
				var parameter = new contactJS.Parameter().withKey('testKey').withValue('testValue');
				
				var attributeType = new contactJS.AttributeType();
				var attributeType2 = new contactJS.AttributeType().withName('testName').
										withType('integer').withParameter(parameter);
				var attArray = new Array();
				attArray.push(attributeType);
				var attList = new contactJS.AttributeTypeList().withItems(attArray);
				
				attArray.push(attributeType2);
				var attList2 = new contactJS.AttributeTypeList().withItems(attArray);
				var call = new contactJS.Callback().withName('test').withAttributeTypes(attList2);
				
				var callArray = new Array();
				callArray.push(call);
				var callList = new contactJS.CallbackList().withItems(callArray);
				
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
				
				
				assert.ok(test.size() == 1,"Passed!: AttributeSubset.size() == 1");
				assert.ok( subscriber.equals(subscriber2),"Passed!: equals -> true" );
				assert.ok( !subscriber.equals(subscriber3),"Passed!: equals -> false" );

			});

	});
});