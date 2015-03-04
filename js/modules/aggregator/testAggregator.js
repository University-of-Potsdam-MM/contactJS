define(['easejs',
        'aggregator', 'attributeValue'],
 	function( easejs, Aggregator, AttributeValue){

 	var Class = easejs.Class;
	var TestAggregator =  Class('TestAggregator').
				extend(Aggregator, 
			
	{
		'public name' : 'TestAggregator', 
		
		'public interpreterId' : '',
		
		'public setInterpreterId' : function(_id){
			this.interpreterId = _id;
		},
		
		'public getInterpreterId' : function(){
			return this.interpreterId;
		},
		
		'protected initWidgetHandles' : function(){},
		
		'protected setAggregatorAttributeValues' : function(){
			var latitude = new AttributeValue().withName('latitude')
						.withType('double')
						.withValue('undefined');
			this.addAttribute(latitude);
			var longitude = new AttributeValue().withName('longitude')
						.withType('double')
						.withValue('undefined');
			this.addAttribute(longitude);
			var address = new AttributeValue().withName('formattedAddress')
						.withType('string')
						.withValue('undefined');
			this.addAttribute(address);
		},
		'protected setAggregatorConstantAttributeValues' : function(){},
		'protected setAggregatorCallbacks' : function(){},

		'public queryReferencedWidget' :function(_widgetHandle, _function){
			var widget = this.discoverer.getWidget(_widgetHandle.getId());
			widget.updateWidgetInformation(_function);			
		},
		
	});

	return TestAggregator;
});