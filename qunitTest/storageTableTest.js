require(['configTest'], function() {
	require(['contactJS'],
	         	function(contactJS){
		
			QUnit.asyncTest( "Storage Tables", function( assert ) {

				var discoverer = new contactJS.Discoverer();
				//initializes the test environment
				var testAggregator = new contactJS.Aggregator(discoverer, [
					new contactJS.AttributeType().withName('latitude').withType('double'),
					new contactJS.AttributeType().withName('longitude').withType('double')
				]);
				
				//put data into aggregator
				var latitudeValue = new contactJS.AttributeValue().withName('latitude')
								.withType('double').withValue(52.3992404);
				var longitudeValue = new contactJS.AttributeValue().withName('longitude')
								.withType('double').withValue(13.066132);				
				var list = new contactJS.AttributeValueList();
				list.put(latitudeValue);
				list.put(longitudeValue);
				testAggregator.putData(list);		
				
				var data = testAggregator.getCurrentData();
				assert.equal( data.size(), 2, "Passed!: two available attributes" );
			    
				var assertion = function(){
					var tables = testAggregator.getStorageOverview();

					assert.notEqual(jQuery.inArray('latitude', tables), '-1', "Passed!: table latitude exists" );
					assert.notEqual(jQuery.inArray('longitude', tables), '-1', "Passed!: table longitude exists" );
				};
				testAggregator.queryTables(function () {assertion(); QUnit.start();});				
			});
			


	});
});