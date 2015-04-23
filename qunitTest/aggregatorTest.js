require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', 'contactJS'],
	         	function(GeoLocationWidget, contactJS){
		
			QUnit.test( "TestAggregator ", function( assert ) {
				var latitudeType = new contactJS.Attribute().withName('latitude').withType('double');
				var longitudeType = new contactJS.Attribute().withName('longitude').withType('double');

                //initializes the infrastructure
                var discoverer = new contactJS.Discoverer();
		    	var testAggregator = new contactJS.Aggregator(discoverer);
                new GeoLocationWidget(discoverer);
		    	
		    	var aggregatorId = testAggregator.getId();
				assert.ok(aggregatorId && aggregatorId !== "null" && aggregatorId !== "undefined","Passed!: id is not null" );
				assert.equal(testAggregator.getType(), 'Aggregator',"Passed!: type -> Aggregator");
				assert.equal(testAggregator.getName(), 'Aggregator',"Passed!: name -> Aggregator");
				
				var aggregatorData = testAggregator.getCurrentData();
				assert.equal(aggregatorData.size(), 0, "Passed!: no available attributes" );
				
				var widgetIds = testAggregator.getWidgets();
				assert.equal(widgetIds.length, 0,"Passed!: no subscribed Widgets" );
				
				//subscription
				var widgetDescriptions = discoverer.getDescriptions([contactJS.Widget]);

				var list = new contactJS.AttributeList().withItems([latitudeType, longitudeType]);
				var callList = new contactJS.CallbackList().withItems([new contactJS.Callback().withName('UPDATE').withAttributeTypes(list)]);
				testAggregator.addWidgetSubscription(widgetDescriptions[0], callList);
				
		    	widgetIds = testAggregator.getWidgets();
				assert.equal( widgetIds.length, 1,"subscribe Passed!: one subscribed Widget" );
				
				geoLocationWidget = discoverer.getComponent(widgetDescriptions[0].getId());
		    	subscriber = geoLocationWidget.getSubscriber();

				assert.equal(subscriber.size(), 1,"subscribe Passed!: one subscribed Widget in geolocationWidget too");
				
				var values = testAggregator.getAttributeValues();
				assert.equal( values.size(), 2, "Passed!: two available attributes" );
				var latitude = values.getAttributeWithTypeOf(latitudeType);
				assert.equal(latitude.getName(), 'latitude',"subscribed Attributes Passed!: latitude exists" );
				assert.equal(latitude.getValue(), 'NO_VALUE',"subscribed Attributes Passed!: value of latitude is NO_VALUE" );
				
				var longitude =values.getAttributeWithTypeOf(longitudeType);
				assert.equal(longitude.getName(), 'longitude',"subscribed Attributes Passed!: longitude exists" );
				assert.equal(longitude.getValue(), 'NO_VALUE',"subscribed Attributes Passed!: value of longitude is NO_VALUE" );
					
				//unsubscribe
		    	testAggregator.unsubscribeFrom(widgetIds[0]);
		    	assert.equal( widgetIds.length, 0,"unsubscribeFrom Passed!: no widgetHandles in Aggregator" );
		    	var subscriber = geoLocationWidget.getSubscriber();
				assert.equal(subscriber.size(), 0,"unsubscribeFrom Passed!: no subscriber in Widget" );
			});

	});
});