require(['configTest'], function() {
	require(['contactJS'],
	         	function(contactJS){
		
			QUnit.asyncTest( "Storage Table Content", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				//initializes the test environment
				var testAggregator = new contactJS.Aggregator(discoverer, [
					new contactJS.Attribute().withName('latitude').withType('double'),
					new contactJS.Attribute().withName('longitude').withType('double')
				]);

				//put data into aggregator
				var latitudeValue = new contactJS.Attribute().withName('latitude').withType('double').withValue(52.3992404);
				var longitudeValue = new contactJS.Attribute().withName('longitude').withType('double').withValue(13.066132);

				testAggregator.putData(new contactJS.AttributeList().withItems([latitudeValue, longitudeValue]));
				
				var data = testAggregator.getCurrentData();
				assert.equal(data.size(), 2, "Passed!: two available attributes");
			    
				var assertion = function(){
					var retrievalResult = testAggregator.retrieveStorage();
					assert.ok(retrievalResult ,"Passed!: retrievalResult exists");
					assert.equal(retrievalResult.getName(), '(latitude:double)', "Passed!: name of retrievalResult is latitude");
					var data = retrievalResult.getValues();
					assert.ok(data,"Passed!: entries exists" );
					assert.equal(data[0].getName(), '(latitude:double)', "Passed!: attributes name is latitude");
				};

				testAggregator.queryAttribute('(latitude:double)', function () {assertion(); QUnit.start();});
			});
	});
});