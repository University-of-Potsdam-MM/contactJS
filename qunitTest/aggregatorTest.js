require(['configTest'], function() {
	require(['testAggregator', 'discoverer','attributeValue', 'attributeValueList', 'attributeType', 'attributeTypeList', 
	         'callback', 'callbackList', 'widgetHandle', 'geoLocationWidget'],
	         	function(TestAggregator, Discoverer, AttributeValue, AttributeValueList, AttributeType, AttributeTypeList, 
	         			Callback, CallbackList, WidgetHandle, GeoLocationWidget){
		
			QUnit.test( "TestAggregator ", function( assert ) {
				
		    	var testAggregator = new TestAggregator();
		    	
		    	var id = testAggregator.getId();
				assert.ok( id && id !== "null" && id !== "undefined","Passed!: id is not null" );
				assert.equal( testAggregator.getType(), 'Aggregator',"Passed!: type -> Aggregator" );
				assert.equal( testAggregator.getName(), 'TestAggregator',"Passed!: name -> TestAggregator" );
				
				var data = testAggregator.getCurrentData();
				assert.equal( data.size(), 3,"Passed!: no available attributes" );
				
				var widgetHandles = testAggregator.getWidgets();
				assert.equal( widgetHandles.size(), 0,"Passed!: no subscribed Widgets" );
			
				//initializes the infrastructure
				var discoverer = new Discoverer();
				testAggregator.setDiscoverer(discoverer);
				
				var geoLocationWidget = new GeoLocationWidget();
				geoLocationWidget.setDiscoverer(discoverer);
				
				//subscription
				var widget = discoverer.getWidgetDescriptions();
		    	   	
		    	var handle = new WidgetHandle().withName('GeoLocationWidget').withId(widget[0].getId());
		    	
		    	var latitudeType = new AttributeType().withName('latitude')
								.withType('double');
				var longitudeType = new AttributeType().withName('longitude')
								.withType('double');
				var list = new AttributeTypeList();
				list.put(latitudeType);
				list.put(longitudeType);

				var call = new Callback().withName('UPDATE').withAttributeTypes(list);
				var callarray = new Array();
				callarray.push(call);
				var callList = new CallbackList().withItems(callarray);

				testAggregator.addWidgetSubscription(handle, callList);
				
		    	widgetHandles = testAggregator.getWidgets();
				assert.equal( widgetHandles.size(), 1,"subscribe Passed!: one subscribed Widget" );
				
				var geoLocationWidget = discoverer.getComponent(widget[0].getId());
		    	var subscriber = geoLocationWidget.getSubscriber();
				assert.equal(subscriber.size(), 1,"subscribe Passed!: one subscribed Widget in geolocationWidget too");
				
				var values = testAggregator.queryAttributes();
				assert.equal( values.size(), 3,"Passed!: two available attributes" );
				var latitude = values.getItem('latitude');
				assert.equal(latitude.getName(), 'latitude',"subscribed Attributes Passed!: latitude exists" );
				assert.equal(latitude.getValue(), 'undefined',"subscribed Attributes Passed!: value of latitude is undefined" );
				
				var longitude =values.getItem('longitude');
				assert.equal(longitude.getName(), 'longitude',"subscribed Attributes Passed!: longitude exists" );
				assert.equal(longitude.getValue(), 'undefined',"subscribed Attributes Passed!: value of longitude is undefined" );
					
				//unsubscribe
		    	testAggregator.unsubscribeFrom(handle);
		    	assert.equal( widgetHandles.size(), 0,"unsubscribeFrom Passed!: no widgetHandles in Aggregator" );
		    	var subscriber = geoLocationWidget.getSubscriber();
				assert.equal(subscriber.size(), 0,"unsubscribeFrom Passed!: no subscriber in Widget" );
		    	
			});

	});
});