require(['configTest'], function() {
	require(['contactJS'],function(contactJS){
		
			QUnit.test( "WidgetHandle", function( assert ) {
				
				var widgetHandle = new contactJS.WidgetHandle().withName('testWidget').withId('testId');
				var widgetHandle2 = new contactJS.WidgetHandle().withName('testWidget').withId('testId');
				var widgetHandle3 = new contactJS.WidgetHandle().withName('testWidget2').withId('testId2');
				var widgetHandle4 = new contactJS.WidgetHandle().withName('testWidget').withId('testId2');
				var widgetHandle5 = new contactJS.WidgetHandle().withName('testWidget2').withId('testId');
				
				assert.ok( widgetHandle.equals(widgetHandle2),"Passed!: equals -> true" );
				assert.ok( !widgetHandle.equals(widgetHandle3),"Passed!: equals -> false" );
				assert.ok( !widgetHandle.equals(widgetHandle4),"Passed!: equals -> false" );
				assert.ok( !widgetHandle.equals(widgetHandle5),"Passed!: equals -> false" );
			});

	});
});