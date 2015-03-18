require(['configTest'], function() {
	require(['../examples/GeoLocationWidget', 'contactJS'],function(GeoLocationWidget, contactJS){
		
			QUnit.test( "WidgetHandleList", function( assert ) {
				var widgetHandle = new contactJS.WidgetHandle().withName('testWidget').withId('testId');
				var widgetHandle2 = new contactJS.WidgetHandle().withName('testWidget2').withId('testId2');
				var widgetHandle3 = new contactJS.WidgetHandle().withName('testWidget3').withId('testId3');

                var geoWidget = new GeoLocationWidget(new contactJS.Discoverer());
				
				var array = [];
				array.push(widgetHandle2);
				array.push(widgetHandle3);
				var list = new contactJS.WidgetHandleList().withItems(array);
				assert.ok( list.size() == 2, "Passed!: Builder (withItems)" );
				
				var list2 = new contactJS.WidgetHandleList();
				list2.put(widgetHandle);
				assert.ok( list2.size() == 1, "Passed!: Put widget handle to list (put)" );
				
				list2.putAll(array);
				assert.ok( list2.size() == 3, "Passed!: Put another two widget handles to list (putAll)" );

                list2.put(geoWidget);
                assert.ok( list2.size() == 4, "Passed!: Put widget to list (put)" );

				//contains
				assert.ok( list2.contains(widgetHandle), "Passed!: contains -> true" );
				assert.ok( !list.contains(widgetHandle), "Passed!: contains -> false" );
				
				//equals
				assert.ok( list2.equals(list2), "Passed!: equals -> true" );
				assert.ok( !list.equals(list2), "Passed!: equals -> false" );
				
			});

	});
});