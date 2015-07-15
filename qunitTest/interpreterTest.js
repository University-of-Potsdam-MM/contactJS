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
				var latitudeType = new contactJS.Attribute().withName('latitude').withType('double');
				var longitudeType = new contactJS.Attribute().withName('longitude').withType('double');
				var inTypes = testInterpreter.getInAttributes();

				assert.ok( inTypes.size() == 2,"Passed!: 2 defined type in addressInterpreter" );
				assert.ok( inTypes.getAttributeWithTypeOf(latitudeType),"Passed!:type latitude exists" );
				assert.ok( inTypes.getAttributeWithTypeOf(latitudeType).equalsTypeOf(latitudeType),"Passed!:type latitude equals expected type" );
				assert.ok( inTypes.getAttributeWithTypeOf(longitudeType),"Passed!:type longitude exists" );
				assert.ok( inTypes.getAttributeWithTypeOf(longitudeType).equalsTypeOf(longitudeType),"Passed!: longitude equals expected type" );
			
				//getOutAttributeTypes
				var formattedAddress = new contactJS.Attribute().withName('formattedAddress').withType('string');
				var outTypes = testInterpreter.getOutAttributes();
				assert.ok( outTypes.size() == 1,"Passed!: 1 defined outType in addressInterpreter" );
				assert.ok( outTypes.getAttributeWithTypeOf(formattedAddress),"Passed!: formattedAddress exists" );
				assert.ok( outTypes.getAttributeWithTypeOf(formattedAddress).equalsTypeOf(formattedAddress),"Passed!: formattedAddress equals expected type" );
				
				//callInterpreter && getInterpretedData with callback
				var latitudeValue = new contactJS.Attribute().withName('latitude').withType('double').withValue(52.3992404);
				var longitudeValue = new contactJS.Attribute().withName('longitude').withType('double').withValue(13.066132);

				var attributeList = new contactJS.AttributeList().withItems([latitudeValue, longitudeValue]);
					    		    		
		    	var assertData2 = function(result){
		    		assert.ok(testInterpreter.getLastInterpretionTime,"Callback passed!: getLastInterpretionTime exists" );
		    		assert.equal(result.size(), 1, "Callback passed!: one outAttribute");
		    		var list = result.getItems();
		    		for(var i in list){
		    			var att = list[i];
		    			assert.ok(att,"Callback passed!: interpreted data exists" );
		    			assert.ok(att.equalsTypeOf(formattedAddress),"Callback passed!: interpreted data equals expected type" );
		    			var add = "Charlottenstraße 70, 14467 Potsdam, Deutschland";
		    			assert.equal(att.getValue(), add ,"Passed!: interpreted data equals expected value" );
		    		}
	    		};	  
	    		
	    		testInterpreter.callInterpreter(attributeList, outTypes, function (result) {assertData2(result); QUnit.start();});
			});
			


	});
});