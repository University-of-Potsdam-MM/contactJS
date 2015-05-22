	define(['retrievalResult',
			'storage',
			'aggregator',
		    'attribute',
		    'attributeList',
		    'parameter',
		    'parameterList',		
		    'condition',
		    'conditionList',
		    'conditionMethod',
		    'equals',
            'unequals',
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
			    Attribute,
			    AttributeList,
			    Parameter,
			    ParameterList,		
			    Condition,
			    ConditionList,
			    ConditionMethod,
			    Equals,
                UnEquals,
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
	contactJS.VERSION = '2.0.0';
	// Methods
	contactJS.RetrievalResult = RetrievalResult;
	contactJS.Storage = Storage;
	contactJS.Aggregator = Aggregator;
	contactJS.Attribute = Attribute;
	contactJS.AttributeList = AttributeList;
	contactJS.Parameter = Parameter;
	contactJS.ParameterList = ParameterList;
	contactJS.Condition = Condition;
	contactJS.ConditionList = ConditionList;
	contactJS.ConditionMethod = ConditionMethod;
	contactJS.Equals = Equals;
    contactJS.UnEquals = UnEquals;
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