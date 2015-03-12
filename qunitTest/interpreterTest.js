require(['configTest'], function() {
	require(['../examples/AddressInterpreter', 'contactJS'],
	         	function(AddressInterpreter, contactJS){
		
			QUnit.asyncTest( "AddressInterpreter", function( assert ) {
				
				
				var testInterpreter = new AddressInterpreter();
		    				        
		        var id = testInterpreter.getId();
				assert.ok( id && id !== "null" && id !== "undefined","Passed!: id is not null" );
				assert.equal( testInterpreter.getType(), 'Interpreter',"Passed!: type -> Interpreter" );
				
				//getInAttributeTypes
				var latitudeType = new contactJS.AttributeType().withName('latitude')
									.withType('double');			
				var longitudeType = new contactJS.AttributeType().withName('longitude')
									.withType('double');
				var inTypes = testInterpreter.getInAttributeTypes();
				assert.ok( inTypes.size() == 2,"Passed!: 2 defined type in addressInterpreter" );
				assert.ok( inTypes.getItem('latitude'),"Passed!:type latitude exists" );
				assert.ok( inTypes.getItem('latitude').equals(latitudeType),"Passed!:type latitude equals expected type" );
				assert.ok( inTypes.getItem('longitude'),"Passed!:type longitude exists" );
				assert.ok( inTypes.getItem('longitude').equals(longitudeType),"Passed!: longitude equals expected type" );
			
				//getOutAttributeTypes
				var formattedAddress = new contactJS.AttributeType().withName('formattedAddress').withType('string');
				var outTypes = testInterpreter.getOutAttributeTypes();
				assert.ok( outTypes.size() == 1,"Passed!: 1 defined outType in addressInterpreter" );
				assert.ok( outTypes.getItem('formattedAddress'),"Passed!: formattedAddress exists" );
				assert.ok( outTypes.getItem('formattedAddress').equals(formattedAddress),"Passed!: formattedAddress equals expected type" );
			
				
				//interpreterDescription				
				var desc = testInterpreter.getDescription();
				assert.ok( desc,"Passed!: InterpreterDescription exists" );
				assert.equal ( desc.getId(), id, "Passed!: InterpreterDescription contains expected id" );
				assert.equal ( desc.getName(), 'AddressInterpreter', "Passed!: InterpreterDescription contains expected id" );
				assert.equal ( desc.getInAttributeTypes().size(), 2, "Passed!: InterpreterDescription contains 2 inAttributes" );
				assert.equal ( desc.getOutAttributeTypes().size(), 1, "Passed!: InterpreterDescription contains 1 outAttributes" );
				
				
				//callInterpreter && getInterpretedData with callback
				var latitudeValue = new contactJS.AttributeValue().withName('latitude')
								.withType('double').withValue(52.3992404);
				var longitudeValue = new contactJS.AttributeValue().withName('longitude')
								.withType('double').withValue(13.066132);
						
				var array = new Array();
				array.push(latitudeValue);
				array.push(longitudeValue);
				var attributeList = new contactJS.AttributeValueList().withItems(array);
					    		    		
		    	var assertData2 = function(){
		    		var result = testInterpreter.getInterpretedData();
		    		var data = result.getOutAttributes();
		    		var data2 = result.getInAttributes();
		    		assert.ok( testInterpreter.getLastInterpretionTime(),"Callback passed!: getLastInterpretionTime exists" );
		    		assert.equal(data.size(), 1, "Callback passed!: one outAttribute");
		    		assert.equal(data2.size(), 2, "Callback passed!: two inAttributes");
		    		var list = data.getItems();
		    		for(var i in list){	
		    			var att = list[i];
		    			assert.ok(att,"Callback passed!: interpreted data exists" );
		    			assert.ok(att.getAttributeType().equals(formattedAddress),"Callback passed!: interpreted data equals expected type" );
		    			var add = "Charlottenstraße 70, 14467 Potsdam, Deutschland";
		    			assert.equal(att.getValue(), add ,"Passed!: interpreted data equals expected value" );
		    		};
	    		};	  
	    		
	    		testInterpreter.callInterpreter(attributeList, function () {assertData2(); QUnit.start();});
			
					
			});
			


	});
});