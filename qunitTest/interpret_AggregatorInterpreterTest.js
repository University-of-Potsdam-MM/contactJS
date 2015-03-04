require(['configTest'], function() {
	require(['addressInterpreter', 'testAggregator', 'discoverer', 'attributeValue', 'attributeValueList', 'attributeTypeList'],
	         	function(AddressInterpreter, TestAggregator, Discoverer, AttributeValue, AttributeValueList, AttributeTypeList){
		
			QUnit.asyncTest( "interpret", function( assert ) {
				
				//initializes the test environment
				var testInterpreter =new AddressInterpreter();
				var testAggregator = new TestAggregator();
				var discoverer = new Discoverer();
				testAggregator.setDiscoverer(discoverer);			        
				testInterpreter.setDiscoverer(discoverer);
				
				var interpreter = discoverer.getInterpreterDescriptions();
				
				//put data into aggregator
				var latitudeValue = new AttributeValue().withName('latitude')
								.withType('double').withValue(52.3992404);
				var longitudeValue = new AttributeValue().withName('longitude')
								.withType('double').withValue(13.066132);				
				var list = new AttributeValueList();
				list.put(latitudeValue);
				list.put(longitudeValue);
				testAggregator.putData(list);	
				
				//if aggregator provides more attributes
				var typeList = new AttributeTypeList();
				typeList.put(latitudeValue.getAttributeType());
				typeList.put(longitudeValue.getAttributeType());
				
				var aggData = testAggregator.getCurrentData();
				var data = aggData.getSubset(typeList);
				assert.equal( data.size(), 2,"Passed!: two available attributes" );
			    
				//call Interpreter
				var callFunktion = function(){
					var interpret = testAggregator.getInterpretedData(interpreter[0].getId());
					var formattedAddress = interpret.getOutAttributes();
					testAggregator.addAttribute(formattedAddress.getItem('formattedAddress'));
					var data2 = testAggregator.getCurrentData();
					assert.equal( data2.size(), 3,"Passed!: three available attributes" );
					var item = data2.getItem('formattedAddress');
					assert.ok(item,"Callback passed!: interpreted data exists" );
	    			var add = "Charlottenstraﬂe 70, 14467 Potsdam, Germany";
	    			assert.equal(item.getValue(), add ,"Passed!: interpreted data equals expected value" );
	    		
				};
				
				testAggregator.interpretData(interpreter[0].getId(), data, function () {callFunktion(); QUnit.start();});
					
			});
			


	});
});