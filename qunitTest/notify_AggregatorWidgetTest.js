require(['configTest'], function() {
	require(['../examples/TestAggregator', '../examples/GeoLocationWidget', 'contactJS'],
	         	function(TestAggregator, GeoLocationWidget, contactJS){
		
			QUnit.asyncTest( "notify", function( assert ) {
				
		    	var testAggregator = new TestAggregator();
		    					
				//initializes the Infrastructure
				var discoverer = new contactJS.Discoverer();
				testAggregator.setDiscoverer(discoverer);
				var geoLocationWidget = new GeoLocationWidget();
				geoLocationWidget.setDiscoverer(discoverer);
				
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
				var callarray = [];
				callarray.push(call);
				var callList = new contactJS.CallbackList().withItems(callarray);

				testAggregator.addWidgetSubscription(handle, callList);
	    	
				//notify
				var geoLocationWidget = discoverer.getComponent(widget[0].getId());
				var checkValues = function(){
					geoLocationWidget.notify();
					var newValues = testAggregator.getAttributeValues();
					assert.equal( newValues.size(), 3,"notify Passed!: two available attributes" );

					var latitude = newValues.getItem('latitude');
					assert.equal(latitude.getName(), 'latitude',"notify Passed!: latitude exists" );
					assert.notEqual(latitude.getValue(), 'undefined', "notify Passed!: value of latitude is no longer undefined" );
					
					var longitude = newValues.getItem('longitude');
					assert.equal(longitude.getName(), 'longitude',"notify Passed!: longitude exists" );
					assert.notEqual(longitude.getValue(), 'undefined',"notify Passed!: value of longitude is no longer undefined" );
					
				};
		    	geoLocationWidget.updateAndQueryWidget(function () {checkValues(); QUnit.start();});
		    	
		    	
			});

	});
});