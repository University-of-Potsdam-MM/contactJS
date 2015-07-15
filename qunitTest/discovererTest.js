require(['configTest'], function() {
	require(['contactJS', '../examples/AddressInterpreter', '../examples/GeoLocationWidget'],
	         	function(contactJS, AddressInterpreter, GeoLocationWidget){
		
			QUnit.test("discovererTest.js", function(assert) {
				var discoverer = new contactJS.Discoverer();
				//type
				assert.ok(discoverer instanceof contactJS.Discoverer, "Passed!: type -> Discoverer" );
				
				//register Widget
				new GeoLocationWidget(discoverer);
				
				//initWidgets ->geoLocationWidget expected
				//tested with getWidgetDescriptions
				var widgets = discoverer.getComponents([contactJS.Widget]);
				assert.equal( widgets.length, 1,"getWidgetDescriptions passed!: One Widget is registered" );
				assert.equal( widgets[0].getName(), 'GeoLocationWidget',"getWidgetDescriptions passed!: Name of the registered Widget is the expected one" );
				//same procedure with getDescriptions
				var components = discoverer.getComponents();
				assert.equal( components.length, 1,"getDescriptions passed!: One Widget is registered" );
				assert.equal( components[0].getName(), 'GeoLocationWidget',"getDescriptions passed!: Name of the registered Widget is the expected one" );
				//getWidgets
				var widget = widgets[0];
				assert.ok( widget,"getWidget passed!: an instance was returned" );	
				assert.ok( widget instanceof contactJS.Widget, "getWidget passed!: type ot the instance is Widget" );
				assert.equal( widget.getName(), 'GeoLocationWidget',"getWidget passed!: name of the instance is te expected one" );
				//same procedure with getComponent
				var widget2 = components[0];
				assert.ok( widget2,"getComponent passed!: an instance was returned" );	
				assert.ok( widget2 instanceof contactJS.Widget, "getComponent passed!: type ot the instance is Widget" );
				assert.equal( widget2.getName(), 'GeoLocationWidget',"getComponent passed!: name of the instance is te expected one" );
						
				//register Interpreter
				new AddressInterpreter(discoverer);

				//tested with getWidgetDescriptions
				var interpreters = discoverer.getComponents([contactJS.Interpreter]);
				assert.equal( interpreters.length, 1,"getInterpreterDescriptions passed!: One Interpreter is registered" );
				assert.equal( interpreters[0].getName(), 'AddressInterpreter',"getInterpreterDescriptions passed!: Name of the registered Interpreter is the expected one" );
				//same procedure with getDescriptions
				components = discoverer.getComponents();
				assert.equal( components.length, 2,"getDescriptions passed!: three instances are registered" );
				//getWidgets
				var interpreter = interpreters[0];
				assert.ok( interpreter,"getInterpreter passed!: an instance was returned" );	
				assert.ok( interpreter instanceof contactJS.Interpreter, "getInterpreter passed!: type of the instance is Interpreter" );
				assert.equal( interpreter.getName(), 'AddressInterpreter',"getInterpreter passed!: name of the instance is te expected one" );
				//same procedure with getComponent
				var interpreter2 = components[1];
				assert.ok( interpreter2,"getComponent passed!: an instance was returned" );	
				assert.ok( interpreter2 instanceof contactJS.Interpreter, "getComponent passed!: type ot the instance is Interpreter" );
				assert.equal( interpreter2.getName(), 'AddressInterpreter',"getComponent passed!: name of the instance is te expected one" );
				
				//register Aggregator
				new contactJS.Aggregator(discoverer, [
					new contactJS.Attribute().withName('formattedAddress').withType('string')
				]);

				//tested with getWidgetDescriptions
				var aggregators = discoverer.getComponents([contactJS.Aggregator]);
				assert.equal( aggregators.length, 1,"getAggregatorDescriptions passed!: One Aggregator is registered" );
				assert.equal( aggregators[0].getName(), 'Aggregator',"getAggregatorDescriptions passed!: Name of the registered Aggregator is the expected one" );
				//same procedure with getDescriptions
				components = discoverer.getComponents();
				assert.equal( components.length, 3, "getDescriptions passed!: three instances are registered" );
				//getWidgets
				var aggregator = aggregators[0];
				assert.ok( aggregator,"getAggregator passed!: an instance was returned" );	
				assert.ok( aggregator instanceof contactJS.Aggregator, "getAggregator passed!: type of the instance is Aggregator" );
				assert.equal( aggregator.getName(), 'Aggregator',"getAggregator passed!: name of the instance is the expected one" );
				//same procedure with getComponent
				var aggregator2 = components[1];
				assert.ok( aggregator2,"getComponent passed!: an instance was returned" );	
				assert.ok( aggregator2 instanceof contactJS.Aggregator, "getComponent passed!: type ot the instance is Aggregator" );
				assert.equal( aggregator2.getName(), 'Aggregator',"getComponent passed!: name of the instance is the expected one" );

				//getComponentByAttribute
				var testParameter = new contactJS.Parameter().withKey('foo').withValue('bar');
				var latitudeType = new contactJS.Attribute().withName('latitude').withType('double').withParameter(testParameter);
				var longitudeType = new contactJS.Attribute().withName('longitude').withType('double');

				var array = [longitudeType];

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