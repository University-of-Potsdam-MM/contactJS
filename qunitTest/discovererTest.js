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
				new contactJS.Aggregator(discoverer, new contactJS.ContextInformationList().withItems([
					discoverer.buildContextInformation('formattedAddress', 'string')
				]));

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
			});
	});
});