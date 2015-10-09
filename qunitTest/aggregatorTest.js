require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', 'contactJS'], function(GeoLocationWidget, contactJS){
		QUnit.test( "aggregatorTest.js", function(assert) {
			var discoverer = new contactJS.Discoverer();

			var latitudeType = discoverer.buildContextInformation('latitude', 'double');
			var longitudeType = discoverer.buildContextInformation('longitude', 'double');

			//initializes the infrastructure
			new GeoLocationWidget(discoverer);

			var testAggregator = new contactJS.Aggregator(discoverer);

			var aggregatorId = testAggregator.getId();
			assert.ok(aggregatorId && aggregatorId !== "null" && aggregatorId !== "undefined", "Passed!: id is not null" );
			assert.ok(testAggregator instanceof contactJS.Aggregator, "Passed!: type -> Aggregator");
			assert.equal(testAggregator.getName(), 'Aggregator',"Passed!: name -> Aggregator");

			var aggregatorData = testAggregator.getCurrentData();
			assert.equal(aggregatorData.size(), 0, "Passed!: no available attributes" );

			var widgetIds = testAggregator.getWidgets();
			assert.equal(widgetIds.length, 0,"Passed!: no subscribed Widgets" );

			//subscription
			var widgets = discoverer.getComponents([contactJS.Widget]);

			var list = new contactJS.ContextInformationList().withItems([latitudeType, longitudeType]);
			var callList = new contactJS.CallbackList().withItems([new contactJS.Callback().withName('UPDATE').withContextInformation(list)]);
			testAggregator.addWidgetSubscription(widgets[0], callList);

			widgetIds = testAggregator.getWidgets();
			assert.equal( widgetIds.length, 1,"subscribe Passed!: one subscribed Widget" );

			var geoLocationWidget = discoverer.getComponent(widgets[0].getId());
			subscriber = geoLocationWidget.getSubscriber();

			assert.equal(subscriber.size(), 1,"subscribe Passed!: one subscribed Widget in geolocationWidget too");

			var values = testAggregator.getOutputContextInformation();
			assert.equal( values.size(), 2, "Passed!: two available attributes" );
			var latitude = values.getContextInformationOfKind(latitudeType);
			assert.equal(latitude.getName(), 'latitude',"subscribed Attributes Passed!: latitude exists" );
			assert.equal(latitude.getValue(), contactJS.ContextInformation.VALUE_UNKNOWN, "subscribed Attributes Passed!: value of latitude is NO_VALUE" );

			var longitude =values.getContextInformationOfKind(longitudeType);
			assert.equal(longitude.getName(), 'longitude',"subscribed Attributes Passed!: longitude exists" );
			assert.equal(longitude.getValue(), contactJS.ContextInformation.VALUE_UNKNOWN, "subscribed Attributes Passed!: value of longitude is NO_VALUE" );

			// unsubscribe
			testAggregator.unsubscribeFrom(widgetIds[0]);
			assert.equal( widgetIds.length, 0,"unsubscribeFrom Passed!: no widgetHandles in Aggregator" );
			var subscriber = geoLocationWidget.getSubscriber();
			assert.equal(subscriber.size(), 0,"unsubscribeFrom Passed!: no subscriber in Widget" );
		});
	});
});