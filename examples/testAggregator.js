define(['easejs', 'contactJS'],
 	function( easejs, contactJS){

 	var Class = easejs.Class;
	var TestAggregator =  Class('TestAggregator').
				extend(contactJS.Aggregator,
			
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
			var latitude = new contactJS.AttributeValue().withName('latitude')
						.withType('double')
						.withValue('undefined');
			this.addAttribute(latitude);
			var longitude = new contactJS.AttributeValue().withName('longitude')
						.withType('double')
						.withValue('undefined');
			this.addAttribute(longitude);
			var address = new contactJS.AttributeValue().withName('formattedAddress')
						.withType('string')
						.withValue('undefined');
			this.addAttribute(address);
		},
		'protected setAggregatorConstantAttributeValues' : function(){},
		'protected setAggregatorCallbacks' : function(){},

		'public queryReferencedWidget' :function(_widgetHandle, _function){
			var widget = this.discoverer.getWidget(_widgetHandle.getId());
			widget.updateWidgetInformation(_function);			
		}
		
	});

	return TestAggregator;
});