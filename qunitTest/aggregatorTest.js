require(['configTest'], function() {
	require(['../examples/TestAggregator', '../examples/GeoLocationWidget', 'contactJS'],
	         	function(TestAggregator, GeoLocationWidget, contactJS){
		
			QUnit.test( "TestAggregator ", function( assert ) {

                //initializes the infrastructure
                var discoverer = new contactJS.Discoverer();
		    	var testAggregator = new TestAggregator(discoverer);
		    	
		    	var id = testAggregator.getId();
				assert.ok( id && id !== "null" && id !== "undefined","Passed!: id is not null" );
				assert.equal( testAggregator.getType(), 'Aggregator',"Passed!: type -> Aggregator" );
				assert.equal( testAggregator.getName(), 'TestAggregator',"Passed!: name -> TestAggregator" );
				
				var data = testAggregator.getCurrentData();
				assert.equal( data.size(), 3,"Passed!: no available attributes" );
				
				var widgetHandles = testAggregator.getWidgets();
				assert.equal( widgetHandles.size(), 0,"Passed!: no subscribed Widgets" );
				
				var geoLocationWidget = new GeoLocationWidget(discoverer);
				
				//subscription
				var widget = discoverer.getDescriptions([contactJS.Widget]);
		    	   	
		    	var handle = new contactJS.WidgetHandle().withName('GeoLocationWidget').withId(widget[0].getId());
		    	
		    	var latitudeType = new contactJS.AttributeType().withName('latitude')
								.withType('double');
				var longitudeType = new contactJS.AttributeType().withName('longitude')
								.withType('double');
				var list = new contactJS.AttributeTypeList();
				list.put(latitudeType);
				list.put(longitudeType);

				var call = new contactJS.Callback().withName('UPDATE').withAttributeTypes(list);
				var callarray = new Array();
				callarray.push(call);
				var callList = new contactJS.CallbackList().withItems(callarray);

				testAggregator.addWidgetSubscription(handle, callList);
				
		    	widgetHandles = testAggregator.getWidgets();
				assert.equal( widgetHandles.size(), 1,"subscribe Passed!: one subscribed Widget" );
				
				var geoLocationWidget = discoverer.getComponent(widget[0].getId());
		    	var subscriber = geoLocationWidget.getSubscriber();
				assert.equal(subscriber.size(), 1,"subscribe Passed!: one subscribed Widget in geolocationWidget too");
				
				var values = testAggregator.getAttributeValues();
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