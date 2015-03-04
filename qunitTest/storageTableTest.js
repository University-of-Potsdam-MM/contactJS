require(['configTest'], function() {
	require(['testAggregator', 'attributeValue', 'attributeValueList'],
	         	function(TestAggregator, AttributeValue, AttributeValueList){
		
			QUnit.asyncTest( "Storage Tables", function( assert ) {
				
				//initializes the test environment
				var testAggregator = new TestAggregator();

				
				//put data into aggregator
				var latitudeValue = new AttributeValue().withName('latitude')
								.withType('double').withValue(52.3992404);
				var longitudeValue = new AttributeValue().withName('longitude')
								.withType('double').withValue(13.066132);				
				var list = new AttributeValueList();
				list.put(latitudeValue);
				list.put(longitudeValue);
				testAggregator.putData(list);		
				
				var data = testAggregator.getCurrentData();
				assert.equal( data.size(), 3,"Passed!: two available attributes" );
			    
				var assertion = function(){
					var tables = testAggregator.getStorageOverview();
					assert.equal( tables[0], 'latitude',"Passed!: table latitude exists" );
					assert.equal( tables[1], 'longitude',"Passed!: table longitude exists" );
				};
				testAggregator.queryTables(function () {assertion(); QUnit.start();});				
			});
			


	});
});