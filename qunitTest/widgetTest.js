require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', 'contactJS'], function(GeoLocationWidget, contactJS){
		QUnit.asyncTest("widgetTest.js", function( assert ) {
			var discoverer = new contactJS.Discoverer();
			var testWidget = new GeoLocationWidget(discoverer);

			var latitudeAttribute = discoverer.buildContextInformation('latitude', 'double');
			var longitudeAttribute = discoverer.buildContextInformation('longitude', 'double');

			var id = testWidget.getId();
			assert.ok( id && id !== "null" && id !== "undefined", "Passed!: id is not null" );
			assert.ok( testWidget instanceof contactJS.Widget, "Passed!: type -> Widget" );
			assert.equal( testWidget.getName(), 'GeoLocationWidget', "Passed!: name -> GeoLocationWidget" );

			//attributeTypes
			var types = testWidget.getOutputContextInformation();
			assert.equal(types.size(), 2,"getWidgetAttributeTypes Passed!: two types were returned" );
			var constantTypes = testWidget.getConstantOutputContextInformation();
			assert.equal(constantTypes.size(), 0,"getWidgetConstantAttributeTypes Passed!: zero constantTypes was returned" );

			//callbacks
			var callbacks = testWidget.getCallbackList();
			assert.equal(callbacks.size(), 1,"queryCallbacks Passed!: one callback was returned" );

			//subscriber
			var subscriber = testWidget.getSubscriber();
			assert.equal(subscriber.size(), 0,"getSubscriber Passed!: zero subscriber was returned" );

			//attributes
			var attributes = testWidget.getOutputContextInformation();
			assert.equal(attributes.size(), 2,"queryAttributes Passed!: two attributes were returned" );
			var latitude = attributes.getContextInformationOfKind(latitudeAttribute);
			assert.equal(latitude.getName(), 'latitude',"queryAttributes Passed!: latitude exists" );
			assert.equal(latitude.getValue(), contactJS.ContextInformation.VALUE_UNKNOWN, "queryAttributes Passed!: value of latitude is undefined" );

			var longitude = attributes.getContextInformationOfKind(longitudeAttribute);
			assert.equal(longitude.getName(), 'longitude',"queryAttributes Passed!: longitude exists" );
			assert.equal(longitude.getValue(), contactJS.ContextInformation.VALUE_UNKNOWN, "queryAttributes Passed!: value of longitude is undefined" );

			//updateAndQuery without callback
			var attributes2 = testWidget.updateAndQueryWidget();
			assert.equal(attributes2.size(), 2,"updateAndQueryWidget without callback Passed!: two attributes were returned" );
			var latitude2 = attributes2.getContextInformationOfKind(latitudeAttribute);
			assert.equal(latitude2.getName(), 'latitude',"updateAndQueryWidget without callbackPassed!: latitude exists" );
			assert.equal(latitude2.getValue(), contactJS.ContextInformation.VALUE_UNKNOWN, "value of latitude is not updated yet: " +latitude2.getValue() );

			var longitude2 = attributes.getContextInformationOfKind(longitudeAttribute);
			assert.equal(longitude2.getName(), 'longitude' ,"updateAndQueryWidget without callbackPassed!: longitude exists" );
			assert.equal(longitude2.getValue(), contactJS.ContextInformation.VALUE_UNKNOWN, "value of longitude is not updated yet: " + longitude2.getValue() );

			testWidget.updateAndQueryWidget(function () {
				var attributes2 = testWidget.queryWidget();
				assert.equal(attributes2.size(), 2, "updateAndQueryWidget with callback Passed!: two attributes were returned" );
				var latitude2 = attributes2.getContextInformationOfKind(latitudeAttribute);
				assert.equal(latitude2.getName(), 'latitude', "updateAndQueryWidget with callback Passed!: latitude exists" );
				assert.notEqual(latitude2.getValue(), 'undefined', "value of latitude is: " +latitude2.getValue() );

				var longitude2 = attributes.getContextInformationOfKind(longitudeAttribute);
				assert.equal(longitude2.getName(), 'longitude',"updateAndQueryWidget with callback Passed!: longitude exists" );
				assert.notEqual(longitude2.getValue(), 'undefined', "value of longitude is: " + longitude2.getValue() );

				QUnit.start();
			});
		});
	});
});