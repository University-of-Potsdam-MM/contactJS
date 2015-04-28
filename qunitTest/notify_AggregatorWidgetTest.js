require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', 'contactJS'],
	         	function(GeoLocationWidget, contactJS){
		
			QUnit.asyncTest( "notify", function( assert ) {
                var discoverer = new contactJS.Discoverer();
				new GeoLocationWidget(discoverer);

				var latitudeType = new contactJS.Attribute().withName('latitude').withType('double');
				var longitudeType = new contactJS.Attribute().withName('longitude').withType('double');

                //initializes the Infrastructure
		    	var testAggregator = new contactJS.Aggregator(discoverer, [
					latitudeType,
					longitudeType
				]);
	    	
				//notify
				var checkValues = function(newValues){
					assert.equal( newValues.size(), 2,"notify Passed!: two available attributes" );

					var latitude = newValues.getAttributeWithTypeOf(latitudeType);
					assert.equal(latitude.getName(), 'latitude', "notify Passed!: latitude exists" );
					assert.notEqual(latitude.getValue(), 'undefined', "notify Passed!: value of latitude is no longer undefined" );
					
					var longitude = newValues.getAttributeWithTypeOf(longitudeType);
					assert.equal(longitude.getName(), 'longitude',"notify Passed!: longitude exists" );
					assert.notEqual(longitude.getValue(), 'undefined',"notify Passed!: value of longitude is no longer undefined" );
				};

				testAggregator.queryReferencedWidgets(function (attributeValues) {checkValues(attributeValues); QUnit.start();});
			});
	});
});