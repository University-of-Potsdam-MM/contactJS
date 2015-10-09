	define(['retrievalResult',
			'storage',
			'aggregator',
			'data',
			'dataList',
		    'contextInformation',
		    'contextInformationList',
		    'parameter',
		    'parameterList',		
		    'condition',
		    'conditionList',
		    'conditionMethod',
		    'equals',
            'unequals',
		    'discoverer',
		    'translation',
			'queryable',
			'callable',
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
			Data,
			DataList,
			ContextInformation,
			ContextInformationList,
			Parameter,
			ParameterList,
			Condition,
			ConditionList,
			ConditionMethod,
			Equals,
			UnEquals,
			Discoverer,
			Translation,
			Queryable,
			Callable,
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
	contactJS.VERSION = '3.0.0';
	// Methods
	contactJS.RetrievalResult = RetrievalResult;
	contactJS.Storage = Storage;
	contactJS.Aggregator = Aggregator;
	contactJS.Data = Data;
	contactJS.ContextInformation = ContextInformation;
	contactJS.ContextInformationList = ContextInformationList;
	contactJS.Parameter = Parameter;
	contactJS.ParameterList = ParameterList;
	contactJS.Condition = Condition;
	contactJS.ConditionList = ConditionList;
	contactJS.ConditionMethod = ConditionMethod;
	contactJS.Equals = Equals;
    contactJS.UnEquals = UnEquals;
	contactJS.Discoverer = Discoverer;
	contactJS.Translation = Translation;
	contactJS.Queryable = Queryable;
	contactJS.Callable = Callable;
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