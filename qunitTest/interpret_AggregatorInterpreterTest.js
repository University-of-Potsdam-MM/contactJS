require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', '../examples/AddressInterpreter', 'contactJS'],
	         	function(GeoLocationWidget, AddressInterpreter, contactJS){
		
			QUnit.asyncTest( "interpret", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				new GeoLocationWidget(discoverer);
				new AddressInterpreter(discoverer);

				var formattedAddressType = discoverer.buildAttribute('formattedAddress', 'string');

				var testAggregator = new contactJS.Aggregator(discoverer, new contactJS.AttributeList().withItems([
					formattedAddressType
				]));
				
				var interpreters = discoverer.getComponents([contactJS.Interpreter]);
				
				//put data into aggregator
				var latitudeValue = discoverer.buildAttribute('latitude', 'double').withValue(52.3992404);
				var longitudeValue = discoverer.buildAttribute('longitude', 'double').withValue(13.066132);

				var list = new contactJS.AttributeList().withItems([latitudeValue, longitudeValue]);
				testAggregator.putData(list);	
				
				//if aggregator provides more attributes
				var typeList = new contactJS.AttributeList().withItems([latitudeValue, longitudeValue]);

				var aggData = testAggregator.getCurrentData();
				var data = aggData.getSubset(typeList);
				assert.equal(data.size(), 2, "Passed!: two available attributes");

				testAggregator.interpretData(interpreters[0].getId(), typeList, new contactJS.AttributeList().withItems([formattedAddressType]), function (interpret) {
					testAggregator.addOutAttribute(interpret.getAttributeWithTypeOf(formattedAddressType));

					var data2 = testAggregator.getCurrentData();
					assert.equal( data2.size(), 3,"Passed!: three available attributes" );
					var item = data2.getAttributeWithTypeOf(formattedAddressType);
					assert.ok(item,"Callback passed!: interpreted data exists" );
					var add = "Charlottenstraße 70, 14467 Potsdam, Deutschland";
					assert.equal(item.getValue(), add ,"Passed!: interpreted data equals expected value" );

					QUnit.start();
				});
			});
			


	});
});