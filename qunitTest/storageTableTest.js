require(['configTest'], function() {
	require(['contactJS'],
	         	function(contactJS){
		
			QUnit.asyncTest( "Storage Tables", function( assert ) {
				var discoverer = new contactJS.Discoverer();

				//initializes the test environment
				var testAggregator = new contactJS.Aggregator(discoverer, new contactJS.ContextInformationList().withItems([
					discoverer.buildContextInformation('latitude', 'double'),
					discoverer.buildContextInformation('longitude', 'double')
				]));
				
				//put data into aggregator
				var latitudeValue = discoverer.buildContextInformation('latitude', 'double').withValue(52.3992404);
				var longitudeValue = discoverer.buildContextInformation('longitude', 'double').withValue(13.066132);

				var list = new contactJS.ContextInformationList().withItems([latitudeValue, longitudeValue]);
				testAggregator.putData(list);
				
				var data = testAggregator.getCurrentData();
				assert.equal( data.size(), 2, "Passed!: two available attributes" );

				testAggregator.queryTables(function() {
					var tables = testAggregator.getStorageOverview();

					assert.notEqual(jQuery.inArray('(latitude:double)', tables), -1, "Passed!: table latitude exists" );
					assert.notEqual(jQuery.inArray('(longitude:double)', tables), -1, "Passed!: table longitude exists" );

					QUnit.start();
				});
			});
	});
});