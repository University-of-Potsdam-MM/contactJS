requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with another path,
    //load them from their respective directory.
    paths:
    {
        jquery: '../libs/jquery/jquery',
        MathUuid: '../libs/uuid/Math.uuid',
		component: 'modules/component/component',
        retrievalResult: 'modules/component/queryable/aggregator/storage/retrievalResult',
		storage: 'modules/component/queryable/aggregator/storage/storage',
		aggregator: 'modules/component/queryable/aggregator/aggregator',
		interpretation: 'modules/component/queryable/aggregator/interpretation',
	    contextInformation: 'modules/data/contextInformation/contextInformation',
		contextInformationList: 'modules/data/contextInformation/contextInformationList',
	    parameter: 'modules/data/contextInformation/parameter',
	    parameterList: 'modules/data/contextInformation/parameterList',
	    condition: 'modules/subscriber/condition/condition',
	    conditionList: 'modules/subscriber/condition/conditionList',
	    conditionMethod: 'modules/subscriber/condition/conditionMethod',
	    equals: 'modules/subscriber/condition/equals',	
	    unequals: 'modules/subscriber/condition/unequals',
	    discoverer: 'modules/discoverer/discoverer',
	    translation: 'modules/discoverer/translation',
	    interpreter: 'modules/component/callable/interpreter/interpreter',
	    interpreterResult: 'modules/component/callable/interpreter/interpreterResult',
	    callback: 'modules/subscriber/callback',   
	    callbackList: 'modules/subscriber/callbackList',
	    subscriber: 'modules/subscriber/subscriber',
	    subscriberList: 'modules/subscriber/subscriberList',
	    widget: 'modules/component/queryable/widget/widget',
	    abstractList: 'modules/abstractList'
    },
    
    shim:{
      'jquery' : {
          exports : '$'
        },
      'MathUuid' : {
          exports : 'MathUuid'
        }
    }
});