require(['configTest'], function() {
	require(['discoverer', 'addressInterpreter', 'testAggregator', 'geoLocationWidget', 'attributeType', 'parameter'],
	         	function(Discoverer, AddressInterpreter, TestAggregator, GeoLocationWidget, AttributeType, Parameter){
		
			QUnit.test( "Discoverer", function( assert ) {
				
				var geolocationW
				
				var discoverer = new Discoverer();
				//type
				assert.equal( discoverer.getType(), 'Discoverer',"Passed!: type -> Discoverer" );
				
				//register Widget
				var geo =new GeoLocationWidget();
				geo.setDiscoverer(discoverer);
				
				//initWidgets ->geoLocationWidget expected
				//tested with getWidgetDescriptions
				var wDescs = discoverer.getWidgetDescriptions();		        
				assert.equal( wDescs.length, 1,"getWidgetDescriptions passed!: One Widget is registerd" );	
				assert.equal( wDescs[0].getName(), 'GeoLocationWidget',"getWidgetDescriptions passed!: Name of the registerd Widget is the expected one" );
				//same procedure with getDescriptions
				var wDescs2 = discoverer.getDescriptions();		        
				assert.equal( wDescs2.length, 1,"getDescriptions passed!: One Widget is registerd" );	
				assert.equal( wDescs2[0].getName(), 'GeoLocationWidget',"getDescriptions passed!: Name of the registerd Widget is the expected one" );
				//getWidgets
				var widget = discoverer.getWidget(wDescs[0].getId());
				assert.ok( widget,"getWidget passed!: an instance was returned" );	
				assert.equal( widget.getType(), "Widget","getWidget passed!: type ot the instance is Widget" );
				assert.equal( widget.getName(), 'GeoLocationWidget',"getWidget passed!: name of the instance is te expected one" );
				//same procedure with getComponent
				var widget2 = discoverer.getComponent(wDescs[0].getId());
				assert.ok( widget2,"getComponent passed!: an instance was returned" );	
				assert.equal( widget2.getType(), "Widget","getComponent passed!: type ot the instance is Widget" );
				assert.equal( widget2.getName(), 'GeoLocationWidget',"getComponent passed!: name of the instance is te expected one" );
						
				//register Interpreter
				var testInterpreter =new AddressInterpreter();
				testInterpreter.setDiscoverer();
				testInterpreter.setDiscoverer(discoverer);
				//tested with getWidgetDescriptions
				var iDescs = discoverer.getInterpreterDescriptions();		        
				assert.equal( iDescs.length, 1,"getInterpreterDescriptions passed!: One Interpreter is registerd" );	
				assert.equal( iDescs[0].getName(), 'AddressInterpreter',"getInterpreterDescriptions passed!: Name of the registerd Interpreter is the expected one" );
				//same procedure with getDescriptions
				var iDescs2 = discoverer.getDescriptions();		        
				assert.equal( iDescs2.length, 2,"getDescriptions passed!: three instances are registerd" );	
				//getWidgets
				var interpreter = discoverer.getInterpreter(iDescs[0].getId());
				assert.ok( interpreter,"getInterpreter passed!: an instance was returned" );	
				assert.equal( interpreter.getType(), "Interpreter","getInterpreter passed!: type of the instance is Interpreter" );
				assert.equal( interpreter.getName(), 'AddressInterpreter',"getInterpreter passed!: name of the instance is te expected one" );
				//same procedure with getComponent
				var interpreter2 = discoverer.getComponent(iDescs[0].getId());
				assert.ok( interpreter2,"getComponent passed!: an instance was returned" );	
				assert.equal( interpreter2.getType(), "Interpreter","getComponent passed!: type ot the instance is Interpreter" );
				assert.equal( interpreter2.getName(), 'AddressInterpreter',"getComponent passed!: name of the instance is te expected one" );
				
				//register Aggregator
				var testAggregator =new TestAggregator();
				testAggregator.setDiscoverer();
				testAggregator.setDiscoverer(discoverer);
				//tested with getWidgetDescriptions
				var aDescs = discoverer.getAggregatorDescriptions();		        
				assert.equal( aDescs.length, 1,"getAggregatorDescriptions passed!: One Aggregator is registerd" );	
				assert.equal( aDescs[0].getName(), 'TestAggregator',"getAggregatorDescriptions passed!: Name of the registerd Interpreter is the expected one" );
				//same procedure with getDescriptions
				var aDescs2 = discoverer.getDescriptions();		        
				assert.equal( aDescs2.length,3,"getDescriptions passed!: four instances are registerd" );	
				//getWidgets
				var aggregator = discoverer.getAggregator(aDescs[0].getId());
				assert.ok( aggregator,"getAggregator passed!: an instance was returned" );	
				assert.equal( aggregator.getType(), "Aggregator","getAggregator passed!: type of the instance is Aggregator" );
				assert.equal( aggregator.getName(), 'TestAggregator',"getAggregator passed!: name of the instance is te expected one" );
				//same procedure with getComponent
				var aggregator2 = discoverer.getComponent(aDescs[0].getId());
				assert.ok( aggregator2,"getComponent passed!: an instance was returned" );	
				assert.equal( aggregator2.getType(), "Aggregator","getComponent passed!: type ot the instance is Aggregator" );
				assert.equal( aggregator2.getName(), 'TestAggregator',"getComponent passed!: name of the instance is te expected one" );
				
				
				//getComponentByAttribute
				var testParameter = new Parameter().withKey('test').withValue('blubb');
				var latitudeType = new AttributeType().withName('latitude')
											.withType('double').withParameter(testParameter);			
				var longitudeType = new AttributeType().withName('longitude')
								.withType('double');
				var array = new Array();
				array.push(longitudeType);
				
				//one searched attribute
				var list = discoverer.getComponentsByAttributes(array, false);
				assert.equal( list.length, 2," getComponentsByAttributes passed!: returned 2 components which provided at least one attribute (one attribute was specified)" );
				assert.equal( list[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (one attribute was specified)" );
				assert.equal( list[1].getName(), 'TestAggregator'," getComponentsByAttributes passed!: returned second expected instance (one attribute was specified)" );
				var list2= discoverer.getComponentsByAttributes(array, true);
				assert.equal( list2.length, 2," getComponentsByAttributes passed!: returned 2 components which provided at least one attribute (one attribute was specified)" );
				assert.equal( list2[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (one attribute was specified)" );
				assert.equal( list2[1].getName(), 'TestAggregator'," getComponentsByAttributes passed!: returned second expected instance (one attribute was specified)" );
				
				//two searched attributes
				array.push(latitudeType);
				var list3 = discoverer.getComponentsByAttributes(array, false);
				assert.equal( list3.length, 2," getComponentsByAttributes passed!: returned 2 components which provided at least one attribute (two attributes were specified)" );
				assert.equal( list3[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (two attributes were specified)" );
				assert.equal( list3[1].getName(), 'TestAggregator'," getComponentsByAttributes passed!: returned second expected instance (two attributes were specified)" );
				var list4 = discoverer.getComponentsByAttributes(array, true);
				assert.equal( list4.length, 0," getComponentsByAttributes passed!: returned 0 components which provided all attribute (two attributes were specified)" );				
			});
			


	});
});