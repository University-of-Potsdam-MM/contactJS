require(['configTest'], function() {
	require(['../examples/AddressInterpreter', 'contactJS'],
	         	function(AddressInterpreter, contactJS){
		
			QUnit.asyncTest( "interpreterTest.js", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				var testInterpreter = new AddressInterpreter(discoverer);
		    				        
		        var id = testInterpreter.getId();
				assert.ok( id && id !== "null" && id !== "undefined","Passed!: id is not null" );
				assert.ok( testInterpreter instanceof contactJS.Interpreter, "Passed!: type -> Interpreter" );
				
				//getInAttributeTypes
				var latitudeAttribute = discoverer.buildContextInformation('latitude', 'double');
				var longitudeAttribute = discoverer.buildContextInformation('longitude', 'double');
				var inTypes = testInterpreter.getInContextInformation();

				assert.ok( inTypes.size() == 2,"Passed!: 2 defined type in addressInterpreter" );
				assert.ok( inTypes.getContextInformationOfKind(latitudeAttribute),"Passed!:type latitude exists" );
				assert.ok( inTypes.getContextInformationOfKind(latitudeAttribute).isKindOf(latitudeAttribute),"Passed!:type latitude equals expected type" );
				assert.ok( inTypes.getContextInformationOfKind(longitudeAttribute),"Passed!:type longitude exists" );
				assert.ok( inTypes.getContextInformationOfKind(longitudeAttribute).isKindOf(longitudeAttribute),"Passed!: longitude equals expected type" );
			
				//getOutAttributeTypes
				var formattedAddress = discoverer.buildContextInformation('formattedAddress', 'string');
				var outTypes = testInterpreter.getOutContextInformation();
				assert.ok( outTypes.size() == 1,"Passed!: 1 defined outType in addressInterpreter" );
				assert.ok( outTypes.getContextInformationOfKind(formattedAddress),"Passed!: formattedAddress exists" );
				assert.ok( outTypes.getContextInformationOfKind(formattedAddress).isKindOf(formattedAddress),"Passed!: formattedAddress equals expected type" );
				
				//callInterpreter && getInterpretedData with callback
				var latitudeValue = discoverer.buildContextInformation('latitude', 'double').withValue(52.3992404);
				var longitudeValue = discoverer.buildContextInformation('longitude', 'double').withValue(13.066132);

				var attributeList = new contactJS.ContextInformationList().withItems([latitudeValue, longitudeValue]);
					    		    		
		    	var assertData2 = function(result){
		    		assert.ok(testInterpreter.getLastInterpretationTime, "Callback passed!: getLastInterpretationTime exists" );
		    		assert.equal(result.size(), 1, "Callback passed!: one outAttribute");
		    		var list = result.getItems();
		    		for(var i in list){
		    			var att = list[i];
		    			assert.ok(att,"Callback passed!: interpreted data exists" );
		    			assert.ok(att.isKindOf(formattedAddress),"Callback passed!: interpreted data equals expected type" );
		    			var add = "Charlottenstraße 70, 14467 Potsdam, Deutschland";
		    			assert.equal(att.getValue(), add ,"Passed!: interpreted data equals expected value" );
		    		}
	    		};	  
	    		
	    		testInterpreter.callInterpreter(attributeList, outTypes, function (result) {assertData2(result); QUnit.start();});
			});
			


	});
});