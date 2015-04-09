require(['configTest'], function() {
	require(['contactJS', '../examples/AddressInterpreter', '../examples/GeoLocationWidget'],
	         	function(contactJS, AddressInterpreter, GeoLocationWidget){
		
			QUnit.test( "Discoverer", function( assert ) {
				var discoverer = new contactJS.Discoverer();
				//type
				assert.equal( discoverer.getType(), 'Discoverer',"Passed!: type -> Discoverer" );
				
				//register Widget
				var geo = new GeoLocationWidget(discoverer);
				
				//initWidgets ->geoLocationWidget expected
				//tested with getWidgetDescriptions
				var wDescs = discoverer.getDescriptions([contactJS.Widget]);
				assert.equal( wDescs.length, 1,"getWidgetDescriptions passed!: One Widget is registered" );
				assert.equal( wDescs[0].getName(), 'GeoLocationWidget',"getWidgetDescriptions passed!: Name of the registered Widget is the expected one" );
				//same procedure with getDescriptions
				var wDescs2 = discoverer.getDescriptions();		        
				assert.equal( wDescs2.length, 1,"getDescriptions passed!: One Widget is registered" );
				assert.equal( wDescs2[0].getName(), 'GeoLocationWidget',"getDescriptions passed!: Name of the registered Widget is the expected one" );
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
				var testInterpreter = new AddressInterpreter(discoverer);
				//tested with getWidgetDescriptions
				var iDescs = discoverer.getDescriptions([contactJS.Interpreter]);
				assert.equal( iDescs.length, 1,"getInterpreterDescriptions passed!: One Interpreter is registered" );
				assert.equal( iDescs[0].getName(), 'AddressInterpreter',"getInterpreterDescriptions passed!: Name of the registered Interpreter is the expected one" );
				//same procedure with getDescriptions
				var iDescs2 = discoverer.getDescriptions();		        
				assert.equal( iDescs2.length, 2,"getDescriptions passed!: three instances are registered" );
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
				new contactJS.Aggregator(discoverer, [
					new contactJS.AttributeType().withName('formattedAddress').withType('string')
				]);
				//tested with getWidgetDescriptions
				var aDescs = discoverer.getDescriptions([contactJS.Aggregator]);
				assert.equal( aDescs.length, 1,"getAggregatorDescriptions passed!: One Aggregator is registered" );
				assert.equal( aDescs[0].getName(), 'Aggregator',"getAggregatorDescriptions passed!: Name of the registered Interpreter is the expected one" );
				//same procedure with getDescriptions
				var aDescs2 = discoverer.getDescriptions();		        
				assert.equal( aDescs2.length,3,"getDescriptions passed!: four instances are registered" );
				//getWidgets
				var aggregator = discoverer.getAggregator(aDescs[0].getId());
				assert.ok( aggregator,"getAggregator passed!: an instance was returned" );	
				assert.equal( aggregator.getType(), "Aggregator","getAggregator passed!: type of the instance is Aggregator" );
				assert.equal( aggregator.getName(), 'Aggregator',"getAggregator passed!: name of the instance is the expected one" );
				//same procedure with getComponent
				var aggregator2 = discoverer.getComponent(aDescs[0].getId());
				assert.ok( aggregator2,"getComponent passed!: an instance was returned" );	
				assert.equal( aggregator2.getType(), "Aggregator","getComponent passed!: type ot the instance is Aggregator" );
				assert.equal( aggregator2.getName(), 'Aggregator',"getComponent passed!: name of the instance is the expected one" );
				
				
				//getComponentByAttribute
				var testParameter = new contactJS.Parameter().withKey('foo').withValue('bar');
				var latitudeType = new contactJS.AttributeType().withName('latitude')
											.withType('double').withParameter(testParameter);			
				var longitudeType = new contactJS.AttributeType().withName('longitude')
								.withType('double');
				var array = [];
				array.push(longitudeType);

				//one searched attribute
				var list = discoverer.getComponentsByAttributes(array, false);
				assert.equal( list.length, 2," getComponentsByAttributes passed!: returned 2 components which provided at least one attribute (one attribute was specified)" );
				assert.equal( list[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (one attribute was specified)" );
				assert.equal( list[1].getName(), 'Aggregator'," getComponentsByAttributes passed!: returned second expected instance (one attribute was specified)" );
				var list2 = discoverer.getComponentsByAttributes(array, true);
				assert.equal( list2.length, 2," getComponentsByAttributes passed!: returned 2 components which provided at least one attribute (one attribute was specified)" );
				assert.equal( list2[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (one attribute was specified)" );
				assert.equal( list2[1].getName(), 'Aggregator'," getComponentsByAttributes passed!: returned second expected instance (one attribute was specified)" );

                //one searched attribute with restricted component type
                var list3 = discoverer.getComponentsByAttributes(array, false, [contactJS.Widget]);
                assert.equal( list3.length, 1," getComponentsByAttributes passed!: returned 1 component which provided at least one attribute (one attribute was specified) and is a widget" );
                assert.equal( list3[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (one attribute was specified)" );
                var list4 = discoverer.getComponentsByAttributes(array, true, [contactJS.Widget]);
                assert.equal( list4.length, 1," getComponentsByAttributes passed!: returned 1 component which provided at least one attribute (one attribute was specified) and is a widget" );
                assert.equal( list4[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (one attribute was specified)" );

				//two searched attributes
				array.push(latitudeType);
				var list5 = discoverer.getComponentsByAttributes(array, false);
				assert.equal( list5.length, 2," getComponentsByAttributes passed!: returned 2 components which provided at least one attribute (two attributes were specified)" );
				assert.equal( list5[0].getName(), 'GeoLocationWidget'," getComponentsByAttributes passed!: returned expected instance (two attributes were specified)" );
				assert.equal( list5[1].getName(), 'Aggregator'," getComponentsByAttributes passed!: returned second expected instance (two attributes were specified)" );
				var list6 = discoverer.getComponentsByAttributes(array, true);
				assert.equal( list6.length, 0," getComponentsByAttributes passed!: returned 0 components which provided all attribute (two attributes were specified)" );
			});
			


	});
});