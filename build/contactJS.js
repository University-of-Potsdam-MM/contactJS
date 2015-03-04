	define(['retrievalResult',
			'storage',
			'aggregator',
			'testAggregator',   
		    'attributeType',
		    'attributeValue',
		    'attributeTypeList',
		    'attributeValueList',
		    'parameter',
		    'parameterList',		
		    'condition',
		    'conditionList',
		    'conditionMethod',
		    'equals',	
		    'interpreterDescription',
		    'widgetDescription',	    
		    'discoverer',	    
		    'addressInterpreter',
		    'interpreter',
		    'interpreterResult',
		    'callback',   
		    'callbackList',
		    'subscriber',
		    'subscriberList', 
		    'geoLocationWidget',
		    'widget',      
		    'widgetHandle',  		
		    'widgetHandleList',    
		    'abstractList'], 
		function(RetrievalResult,
				Storage,
				Aggregator,
				TestAggregator,   
			    AttributeType,
			    AttributeValue,
			    AttributeTypeList,
			    AttributeValueList,
			    Parameter,
			    ParameterList,		
			    Condition,
			    ConditionList,
			    ConditionMethod,
			    Equals,	
			    InterpreterDescription,
			    WidgetDescription,	    
			    Discoverer,	    
			    AddressInterpreter,
			    Interpreter, 
			    InterpreterResult,
			    Callback,   
			    CallbackList,
			    Subscriber,
			    SubscriberList, 
			    GeoLocationWidget,
			    Widget,      
			    WidgetHandle,  		
			    WidgetHandleList,    
			    AbstractList) {
		
	// Object Contructor
	var contactJS = function(obj) {
		return obj;
	};
	contactJS.VERSION = '1.0.0';
	// Methods
	contactJS.RetrievalResult = RetrievalResult;
	contactJS.Storage = Storage;
	contactJS.Aggregator = Aggregator;
	contactJS.TestAggregator = TestAggregator;   
	contactJS.AttributeType = AttributeType;
	contactJS.AttributeValue = AttributeValue;
	contactJS.AttributeTypeList = AttributeTypeList;
	contactJS.AttributeValueList = AttributeValueList;
	contactJS.Parameter = Parameter;
	contactJS.PArameterList = ParameterList;		
	contactJS.Condition = Condition;
	contactJS.ConditionList = ConditionList;
	contactJS.ConditionMethod = ConditionMethod;
	contactJS.Equals = Equals;
	contactJS.InterpreterDescription = InterpreterDescription;
	contactJS.WidgetDescription = WidgetDescription;
	contactJS.Discoverer = Discoverer;
	contactJS.AddressInterpreter = AddressInterpreter;
	contactJS.Interpreter = Interpreter;
	contactJS.InterpreterResult = InterpreterResult;
	contactJS.Callback =Callback;
	contactJS.CallbackList = CallbackList;
	contactJS.Subscriber =Subscriber;
	contactJS.SubscriberList = SubscriberList; 
	contactJS.GeoLocationWidget = GeoLocationWidget;
	contactJS.Widget = Widget;
	contactJS.WidgetHandle = WidgetHandle;  		
	contactJS.WidgetHandleList = WidgetHandleList;    
	contactJS.AbstractList = AbstractList;
	return contactJS;
});