	define(['retrievalResult',
			'storage',
			'aggregator',
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
            'unequals',
		    'interpreterDescription',
		    'widgetDescription',	    
		    'discoverer',
		    'translation',
		    'interpreter',
		    'interpreterResult',
		    'callback',   
		    'callbackList',
		    'subscriber',
		    'subscriberList',
		    'widget',
		    'abstractList'], 
		function(RetrievalResult,
				Storage,
				Aggregator,
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
                UnEquals,
			    InterpreterDescription,
			    WidgetDescription,	    
			    Discoverer,
			    Translation,
			    Interpreter, 
			    InterpreterResult,
			    Callback,   
			    CallbackList,
			    Subscriber,
			    SubscriberList,
			    Widget,
			    AbstractList) {
		
	// Object Contructor
	var contactJS = function(obj) {
		return obj;
	};
	contactJS.VERSION = '1.1.0';
	// Methods
	contactJS.RetrievalResult = RetrievalResult;
	contactJS.Storage = Storage;
	contactJS.Aggregator = Aggregator;
	contactJS.AttributeType = AttributeType;
	contactJS.AttributeValue = AttributeValue;
	contactJS.AttributeTypeList = AttributeTypeList;
	contactJS.AttributeValueList = AttributeValueList;
	contactJS.Parameter = Parameter;
	contactJS.ParameterList = ParameterList;
	contactJS.Condition = Condition;
	contactJS.ConditionList = ConditionList;
	contactJS.ConditionMethod = ConditionMethod;
	contactJS.Equals = Equals;
    contactJS.UnEquals = UnEquals;
	contactJS.InterpreterDescription = InterpreterDescription;
	contactJS.WidgetDescription = WidgetDescription;
	contactJS.Discoverer = Discoverer;
	contactJS.Translation = Translation;
	contactJS.Interpreter = Interpreter;
	contactJS.InterpreterResult = InterpreterResult;
	contactJS.Callback = Callback;
	contactJS.CallbackList = CallbackList;
	contactJS.Subscriber = Subscriber;
	contactJS.SubscriberList = SubscriberList;
	contactJS.Widget = Widget;
	contactJS.AbstractList = AbstractList;
	return contactJS;
});