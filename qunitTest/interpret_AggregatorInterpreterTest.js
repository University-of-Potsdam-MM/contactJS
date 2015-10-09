require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', '../examples/AddressInterpreter', 'contactJS'],
	         	function(GeoLocationWidget, AddressInterpreter, contactJS){
		
			QUnit.asyncTest( "interpret_AggregatorInterpreterTest.js", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				new GeoLocationWidget(discoverer);
				new AddressInterpreter(discoverer);

				var formattedAddressContextInformation = discoverer.buildContextInformation('formattedAddress', 'string');

				var testAggregator = new contactJS.Aggregator(discoverer, new contactJS.ContextInformationList().withItems([
					formattedAddressContextInformation
				]));
				
				var interpreters = discoverer.getComponents([contactJS.Interpreter]);

				//put data into aggregator
				var latitudeValue = discoverer.buildContextInformation('latitude', 'double').withValue(52.3992404);
				var longitudeValue = discoverer.buildContextInformation('longitude', 'double').withValue(13.066132);

				var list = new contactJS.ContextInformationList().withItems([latitudeValue, longitudeValue]);
				testAggregator.putData(list);

				//if aggregator provides more attributes
				var typeList = new contactJS.ContextInformationList().withItems([latitudeValue, longitudeValue]);

				var aggData = testAggregator.getCurrentData();
				var data = aggData.getSubset(typeList);
				assert.equal(data.size(), 2, "Passed!: two available attributes");

				testAggregator.interpretData(interpreters[0].getId(), typeList, new contactJS.ContextInformationList().withItems([formattedAddressContextInformation]), function (interpret) {
					testAggregator.addOutputContextInformation(interpret.getContextInformationOfKind(formattedAddressContextInformation));

					var data2 = testAggregator.getCurrentData();
					assert.equal(data2.size(), 3, "Passed!: three available attributes");
					var item = data2.getContextInformationOfKind(formattedAddressContextInformation);
					assert.ok(item, "Callback passed!: interpreted data exists");
					var add = "Charlottenstraße 70, 14467 Potsdam, Deutschland";
					assert.equal(item.getValue(), add ,"Passed!: interpreted data equals expected value" );

					QUnit.start();
				});
			});
	});
});