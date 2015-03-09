require(['configTest'], function() {
	require(['../examples/TestAggregator', 'contactJS'],
	         	function(TestAggregator, contactJS){
		
			QUnit.asyncTest( "Storage Table Content", function( assert ) {
				
				//initializes the test environment
				var testAggregator = new TestAggregator();

				
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
				assert.equal( data.size(), 3,"Passed!: two available attributes" );
			    
				var assertion = function(){
					var retrievalResult = testAggregator.retrieveStorage();
					assert.ok( retrievalResult,"Passed!: retrievalResult exists" );
					assert.equal( retrievalResult.getName(), 'latitude', "Passed!: name of retrievalResult is latitude" );
					var data = retrievalResult.getValues();
					assert.ok( data,"Passed!: entries exists" );
					assert.equal( data[0].getName(), 'latitude',"Passed!: attributes name is latitude" );
				};
				testAggregator.queryAttribute('latitude', function () {assertion(); QUnit.start();});				
			});
			


	});
});