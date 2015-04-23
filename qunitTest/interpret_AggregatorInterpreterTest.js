require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', '../examples/AddressInterpreter', 'contactJS'],
	         	function(GeoLocationWidget, AddressInterpreter, contactJS){
		
			QUnit.asyncTest( "interpret", function( assert ) {
				
				//initializes the test environment
				var discoverer = new contactJS.Discoverer();
				new GeoLocationWidget(discoverer);
				new AddressInterpreter(discoverer);

				var formattedAddressType = new contactJS.Attribute().withName('formattedAddress').withType('string');

				var testAggregator = new contactJS.Aggregator(discoverer, [
					formattedAddressType
				]);
				
				var interpreter = discoverer.getDescriptions([contactJS.Interpreter]);
				
				//put data into aggregator
				var latitudeValue = new contactJS.Attribute().withName('latitude').withType('double').withValue(52.3992404);
				var longitudeValue = new contactJS.Attribute().withName('longitude').withType('double').withValue(13.066132);

				var list = new contactJS.AttributeList().withItems([latitudeValue, longitudeValue]);
				testAggregator.putData(list);	
				
				//if aggregator provides more attributes
				var typeList = new contactJS.AttributeList().withItems([latitudeValue, longitudeValue]);
				
				var aggData = testAggregator.getCurrentData();
				var data = aggData.getSubset(typeList);
				assert.equal( data.size(), 2, "Passed!: two available attributes" );
			    
				//call Interpreter
				var callFunktion = function(interpret){
					testAggregator.addAttribute(interpret.getAttributeWithTypeOf(formattedAddressType));
					var data2 = testAggregator.getCurrentData();
					assert.equal( data2.size(), 3,"Passed!: three available attributes" );
					var item = data2.getAttributeWithTypeOf(formattedAddressType);
					assert.ok(item,"Callback passed!: interpreted data exists" );
	    			var add = "Charlottenstraße 70, 14467 Potsdam, Deutschland";
	    			assert.equal(item.getValue(), add ,"Passed!: interpreted data equals expected value" );
				};
				
				testAggregator.interpretData(interpreter[0].getId(), typeList, new contactJS.AttributeList().withItems([formattedAddressType]), function (result) {callFunktion(result); QUnit.start();});
			});
			


	});
});