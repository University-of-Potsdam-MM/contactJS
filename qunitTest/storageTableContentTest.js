require(['configTest'], function() {
	require(['contactJS'], function(contactJS){
		QUnit.asyncTest( "Storage Table Content", function( assert ) {
			var discoverer = new contactJS.Discoverer();

			//initializes the test environment
			var testAggregator = new contactJS.Aggregator(discoverer, new contactJS.ContextInformationList().withItems([
				discoverer.buildContextInformation('latitude', 'double'),
				discoverer.buildContextInformation('longitude', 'double')
			]));

			//put data into aggregator
			var latitudeValue = discoverer.buildContextInformation('latitude', 'double').withValue(52.3992404);
			var longitudeValue = discoverer.buildContextInformation('longitude', 'double').withValue(13.066132);

			testAggregator.putData(new contactJS.ContextInformationList().withItems([latitudeValue, longitudeValue]));

			var data = testAggregator.getCurrentData();
			assert.equal(data.size(), 2, "Passed!: two available attributes");

			testAggregator.queryContextInformation('[latitude:double]', function () {
				var retrievalResult = testAggregator.retrieveStorage();
				assert.ok(retrievalResult ,"Passed!: retrievalResult exists");
				assert.equal(retrievalResult.getName(), '[latitude:double]', "Passed!: name of retrievalResult is latitude");
				var data = retrievalResult.getValues();
				assert.ok(data,"Passed!: entries exists" );
				assert.equal(data[0].getName(), '[latitude:double]', "Passed!: attributes name is latitude");

				QUnit.start();
			});
		});
	});
});