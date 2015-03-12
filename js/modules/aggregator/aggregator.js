/**
 * This module representing a Context Aggregator. 
 * It aggregates data from multiple widgets.
 * 
 * @module Aggregator
 * @fileOverview
 */
define(['easejs', 'MathUuid','widget', 'widgetHandle', 'widgetHandleList', 
        'attributeType', 'attributeValue', 'attributeValueList', 'subscriber', 
        'subscriberList', 'callbackList', 'storage'],
 	function( easejs, MathUuid, Widget, WidgetHandle,WidgetHandleList, AttributeType,
 			AttributeValue, AttributeValueList, Subscriber, SubscriberList,
 			CallbackList, Storage){

 	var Class = easejs.Class;
 	var AbstractClass = easejs.AbstractClass;
	var Aggregator =  AbstractClass('Aggregator').
				extend(Widget, 
			
	{
	   /**
	    * @alias name
	    * @public
	    * @type {string}
	    * @memberof Aggregator#
	    * @desc Name of the Widget.
        */
		'public name' : 'Aggregator',
		
		/**
		 * @alias id
		 * @public
		 * @type {string}
		 * @memberof Aggregator#
		 * @desc ID of the Aggregator. Will be generated.
		 */
		'public id' : '', 
		
		/**
		 * @alias widgets
		 * @protected
		 * @type {WidgetHandleList}
		 * @memberof Aggregator#
		 * @desc List of subscribed Widgets.
		 */
		'protected widgets' : [],		
			
		/**
		 * @alias db
		 * @protected
		 * @type {Storage}
		 * @memberof Aggregator#
		 * @desc Database of the Aggregator.
		 */
		'protected db' : '',
		
		/**
		 * Constructor: Generates the id and initializes the Aggregator.
		 * 
		 * @abstract
		 * @class Aggregator
		 * @extends Widget
		 * @classdesc The Widget handles the access to sensors.
		 * @requires easejs
		 * @requires MathUuid
		 * @requires CallbackList
		 * @requires AttributeType
		 * @requires AttributeValue
		 * @requires AttributeValueList
		 * @requires Subscriber
		 * @requires SubscriberList
		 * @requires Storage
		 * @requires Widget
		 * @requires WidgetHandle
		 * @requires WidgetHandleList
		 * @constructs Aggregator
		 */
		'override virtual public __construct': function(_discoverer)
        {
			this.id = Math.uuid();
			this.widgets = new WidgetHandleList();
			this.initWidgetHandles();
			this.__super(_discoverer);
			this.aggregatorSetup();
        },
        
        /**
		 * Returns the type of this class, in this case
		 * "Aggregator".
		 * 
		 * @override
		 * @public
		 * @alias getType
		 * @memberof Aggregator#
		 * @returns {string}
		 */
		'override public getType' : function(){
		    return 'Aggregator';
		 },
		 
		/**
		 * Adds new AttributeTypes, useful when a new Widget is subscribed.
		 * 
		 * @protected
	   	 * @alias addAttributeType
		 * @memberof Aggregator#
		 * @param {AttributeType} _attributeType attributeType
	     */
		'protected addAttributeType' : function(_attributeType){
			if(Class.isA( AttributeType, _attributeType )){			
				this.attributeTypes.put(_attributeType);
				var attVal = new AttributeValue().buildFromAttributeType(_attributeType);
				this.attributes.put(attVal);
            }
        },
		
		/**
		 * Sets WidgetHandles.
		 * 
		 * @protected
	   	 * @alias setWidgets
		 * @memberof Aggregator#
		 * @param {(WidgetHandleList|Array)} _widgetList List of WidgetHandles
	     */
		'protected setWidgets' : function(_widgetList){
			this.widgets = new WidgetHandleList().withItems(_widgetList);		
		},
		
		/**
		 * Adds WidgetHandle.
		 * 
		 * @public
	   	 * @alias addWidget
		 * @memberof Aggregator#
		 * @param {WidgetHandle} _widget WidgetHandle
	     */
		'public addWidget' : function(_widget){
			this.widgets.put(_widget);
		},
		
		/**
		 * Returns the available WidgetHandles.
		 * 
		 * @public
		 * @alias getWidgets
		 * @memberof Aggregator#
		 * @returns {WidgetHandleList}
		 */
		'public getWidgets' : function() {
			return this.widgets;
		},
		
		/**
		 * Removes WidgetHandle from list.
		 * 
		 * @protected
	   	 * @alias removeWidget
		 * @memberof Aggregator#
		 * @param {String} _key Id of the WidgetHandle
	     */
		'protected removeWidget' : function(_key){
			this.widgets.removeItem(_key);
		},
		
		/**
		 * Retrieves all Attributes of the specified widgets.
         * If the defined name in WidgetHandle does not match the name of the 
         * returned instance, the WidgetHandle will be removed from the list.
		 * 
		 * @protected
	   	 * @alias initAttributes
		 * @memberof Aggregator#
	     */
		'protected initAttributes' : function(){
			if(this.widgets.size() > 0){
				var widgetList = this.widgets.getItems();
				for(var i in widgetList){
					var widgetHandle = widgetList[i];
					var widgetInstance = this.discoverer.getComponent(widgetHandle.getId());
					if(widgetInstance && widgetInstance.getName() === widgetHandle.getName()){
						this.setAttributes(widgetInstance.queryAttributes());
					} else {
						this.removeWidget(widgetHandle.getName());
					}
                }
            }
        },
		
		/**
		 * Retrieves all ConstantAttributes of the specified widgets.
         * If the defined name in WidgetHandle does not match the name of the 
         * returned instance, the WidgetHandle will be removed from the list.
		 * 
		 * @protected
	   	 * @alias initConstantAttributes
		 * @memberof Aggregator#
	     */
		'protected initConstantAttributes' : function(){
			if(this.widgets.size() > 0){
				var widgetList = this.widgets.getItems();
				for(var i in widgetList){
					var widgetHandle = widgetList[i];					
					var widgetInstance = this.discoverer.getComponent(widgetHandle.getid());
					if(widgetInstance && widgetInstance.getName() === widgetHandle.getName()){
						this.setConstantAttributes(widgetInstance.queryConstantAttributes());
					} else {
						this.removeWidget(widgetHandle.getName());
                    }
                }
            }
        },
		
		/**
		 * Retrieves all actual Callbacks of the specified Widgets.
		 * 
		 * @protected
	   	 * @alias initCallbacks
		 * @memberof Aggregator#
	     */
		'protected initCallbacks' : function(){
			if(this.widgets.size() > 0){
				var widgetList = this.widgets.getItems();
				for(var i in widgetList){
					var widgetHandle = widgetList[i];
					this.initWidgetSubscription(widgetHandle);
                }
            }
        },
		
		/**
		 * InitMethod for Aggregators. Called by constructor.
		 * Initializes the associated Storage.
		 * 
		 * @protected
	   	 * @alias aggregatorSetup
		 * @memberof Aggregator#
	     */
		'protected aggregatorSetup' : function(){
			this.initStorage('DB_'+ this.name);
			this.setAggregatorAttributeValues();
			this.setAggregatorConstantAttributeValues();
			this.setAggregatorCallbacks();
		},
		
		/**
		 * Initializes the Widget that should be subscribed.
		 * Called by aggregatorSetup().
		 * 
		 * @function
		 * @abstract
		 * @protected
		 * @alias initWidgetHandles
		 * @memberof Aggregator#
		 */
		'abstract protected initWidgetHandles' : [],
		
		/**
		 * Initializes the provided attributeValues that are only specific to the Aggregator.
		 * Called by aggregatorSetup().
		 * 
		 * @function
		 * @abstract
		 * @protected
		 * @alias setAggregatorAttributeValues
		 * @memberof Aggregator#
		 */
		'abstract protected setAggregatorAttributeValues' : [],
		/**
		 * Initializes the provided ConstantAttributeValues that are only specific to the Aggregator.
		 * Called by aggregatorSetup().
		 * 
		 * @function
		 * @abstract
		 * @protected
		 * @alias setAggregatorConstantAttributeValues
		 * @memberof Aggregator#
		 */
		'abstract protected setAggregatorConstantAttributeValues' : [],
		/**
		 * Initializes the provided Callbacks that are only specific to the Aggregator.
		 * Called by aggregatorSetup().
		 * 
		 * @function
		 * @abstract
		 * @protected
		 * @alias setAggregatorCallbacks
		 * @memberof Aggregator#
		 */
		'abstract protected setAggregatorCallbacks' : [],

		/**
		 * Returns the current Attributes that are saved in the cache.
		 * 
		 * @public
	   	 * @alias getCurrentData
		 * @memberof Aggregator#
		 * @returns {AttributeValueList}
	     */
		'public getCurrentData' : function(){
			var response = new AttributeValueList();
			response.putAll(this.attributes);
			return response;
		},
		
		/**
		 * Subscribes to the given widget for the specified Callbacks.
		 * 
		 * @protected
	   	 * @alias subscribeTo
		 * @memberof Aggregator#
		 * @param {Widget} _widget Widget that should be subscribed to.
		 * @param {CallbackList} _callbacks required Callbacks
	     */
		'protected subscribeTo' : function(_widget, _callbacks, _subSet, _conditions){	
			if(Class.isA(Widget, _widget)){
				var subscriber = new Subscriber().withSubscriberId(this.id).
									withSubscriberName(this.name).
									withSubscriptionCallbacks(_callbacks).
									withAttributesSubset(_subSet).
									withConditions(_conditions);	
				console.log(this.name + ' subscribeTo: ' + _widget.getName());
				_widget.addSubscriber(subscriber);
            }
        },
		
		/**
		 * Subscribes to the widgets that are defined in the WidgetHandleList
         * used in the initCallback method.
         * If the defined name in WidgetHandle does not match the name of the 
         * returned instance, the WidgetHandle will be removed from the list.
		 * 
		 * 
		 * @protected
	   	 * @alias initWidgetSubscription
		 * @memberof Aggregator#
		 * @param {WidgetHandle} _widgetHandle Widget that should be subscribed.
		 * @returns {?CallbackList}
	     */
		'protected initWidgetSubscription' : function(_widgetHandle){
			var calls = null;
			if(Class.isA(WidgetHandle, _widgetHandle)){				
				var widget = this.discoverer.getComponent(_widgetHandle.getId());
				if(widget && widget.getName() === _widgetHandle.getName()){
					//subscribe to all callbacks
					calls = widget.queryCallbacks();
					this.subscribeTo(widget, calls);
				} else {
					this.removeWidget(_widgetHandle.getName());
                }
            }
            return calls;
		},
		
		/**
		 * Adds the specified callbacks of a widget to the aggregator.
         * 
		 * @public
	   	 * @alias addWidgetSubscription
		 * @memberof Aggregator#
		 * @param {WidgetHandle|Widget} _widgetHandleOrWidget Widget that should be subscribed.
		 * @param {CallbackList} _callbackList required Callbacks
	     */
		'public addWidgetSubscription' : function(_widgetHandleOrWidget, _callbackList){
            if (Class.isA(Widget, _widgetHandleOrWidget)) {
                if (!_callbackList || !Class.isA(CallbackList, _callbackList)) {
                    _callbackList = _widgetHandleOrWidget.getCallbackList();
                }
                _widgetHandleOrWidget = _widgetHandleOrWidget.getHandle();
            }
			if(Class.isA(WidgetHandle, _widgetHandleOrWidget) && Class.isA(CallbackList, _callbackList)){
				var widget = this.discoverer.getComponent(_widgetHandleOrWidget.getId());
				if(widget && widget.getName() === _widgetHandleOrWidget.getName()){
					this.subscribeTo(widget, _callbackList);			
					this.callbacks.putAll(_callbackList);			
					var callsList = _callbackList.getItems();		
					for(var x in callsList){
						var singleCallback = callsList[x];			
						var typeList = singleCallback.getAttributeTypes().getItems();
						for(var y in typeList){
							var singleType = typeList[y];
							this.addAttributeType(singleType);
                        }
                    }
                    this.addWidget(_widgetHandleOrWidget);
                }
            }
        },
		
		/**
		 * Removes subscribed Widgets and deletes the entry 
		 * for subscribers in the associated Widget.
		 * 
		 * @public
	   	 * @alias unsubscribeFrom
		 * @memberof Aggregator#
		 * @param {WidgetHandle} _widgetHandle Widget that should be removed.
	     */
		'public unsubscribeFrom' : function(_widgetHandle){
			if(Class.isA(WidgetHandle, _widgetHandle)){
				var widget = this.discoverer.getComponent(_widgetHandle.getId());
				if(widget && widget.getName() === _widgetHandle.getName()){
					console.log('aggregator unsubscribeFrom: ' + widget.getName());
					widget.removeSubscriber(this.id);
					this.widgets.removeItem(_widgetHandle.getName());
                }
            }
        },
		
		/**
		 * Puts context data to Widget and expects an array.
		 * 
		 * @override
		 * @public
	   	 * @alias putData
		 * @memberof Aggregator#
		 * @param {(AttributeValueList|Array)}  _data data that shall be input
	     */
		'override public putData' : function(_data){
			var list = [];
			if(_data instanceof Array){
				list = _data;
			} else if (Class.isA(AttributeValueList, _data)) {
				list = _data.getItems();
			}
			for(var i in list){
				var x = list[i];
				if(Class.isA( AttributeValue, x ) && this.isAttribute(x)){
					this.addAttribute(x);
					if(this.db){
						this.store(x);
					}
                }
            }
        },
		
		/**
		 * Calls the given Interpreter for interpretation the data.
		 * 
		 * @public
	   	 * @alias interpretData
		 * @memberof Aggregator#
		 * @param {String} _interpreterId ID of the searched Interpreter
		 * @param {(AttributeValueList|Array)} _data data that should be interpreted
		 * @param {?function} _function for additional actions, if an asynchronous function is used
	     */
		'public interpretData' : function(_interpreterId, _data, _function){
			var interpreter = this.discoverer.getComponent(_interpreterId);
			if(interpreter){
				interpreter.callInterpreter(_data, _function);
			}
		},
		
		/**
		 * Calls the given Interpreter for getting the data.
		 * 
		 * @public
	   	 * @alias getInterpretedData
		 * @memberof Aggregator#
		 * @param {String} _interpreterId ID of the searched Interpreter
		 * @returns {?AttributeValueList}
	     */
		'public getInterpretedData' : function(_interpreterId){
			var response = 'undefined';
			var interpreter = this.discoverer.getComponent(_interpreterId);
			if(interpreter){
				response = interpreter.getInterpretedData();
				var list = response.getOutAttributes().getItems();
				for(var i in list){
					var x = list[i];
					if(Class.isA( AttributeValue, x ) && this.isAttribute(x)){
						this.addAttribute(x);
						if(this.db){
							this.store(x);
						}
                    }
                }
            }
			return response;
		},
		
		/**
		 * Initializes the database with the specified name.
		 * 
		 * @protected
	   	 * @alias initStorage
		 * @memberof Aggregator#
		 * @param {String} _name Name of the Storage
	     */
		'protected initStorage' : function(_name){
			this.db = new Storage(_name, 7200000, 5);
		},
		
		/**
		 * Stores the data.
		 * 
		 * @protected
	   	 * @alias store
		 * @memberof Aggregator#
		 * @param {AttributeValue} _attributeValue data that should be stored
	     */
		'protected store' : function(_attributeValue){
			this.db.store(_attributeValue);
		},
		
		/**
		 * Queries the database and returns the last retrieval result. 
		 * It may be that the retrieval result is not up to date, 
		 * because an asynchronous function is used for the retrieval.
		 * For retrieving the current data, this function can be used as callback function
		 * in retrieveStorage().
		 * 
		 * @public
	   	 * @alias queryAttribute
		 * @memberof Aggregator#
		 * @param {String} _name Name of the searched AtTributes.
		 * @param {?function} _function for alternative  actions, because an asynchronous function is used
	     */
		'public queryAttribute' : function(_name, _function){
			this.db.retrieveAttributes(_name, _function);	
		},
		
		/**
		 * Queries a specific table and only actualizes the storage cache.
		 * For an alternativ action can be used a callback.
		 * 
		 * @public
	   	 * @alias retrieveStorage
		 * @memberof Aggregator#
		 * @returns {RetrievalResult}
	     */
		'public retrieveStorage' : function(){
			return this.db.getCurrentData();
		},
		
		/**
		 * Returns an overview about the stored attributes.
		 * It may be that the overview about the stored attributes is not up to date, 
		 * because an asynchronous function is used for the retrieval.
		 * For retrieving the current data, this function can be used as callback function
		 * in queryTables().
		 * 
		 * @public
	   	 * @alias getStorageOverview
		 * @memberof Aggregator#
		 * @returns {?Array}
	     */
		'public getStorageOverview' : function(){
			return this.db.getAttributesOverview();
		},

		/**
		 * Only actualizes the attributeType cache in th database.
		 * For an alternativ action can be used a callback.
		 *
		 * @public
	   	 * @alias queryTables
		 * @memberof Aggregator#
		 * @param {?function} _function for alternative actions, because an asynchronous function is used
	     */
		'public queryTables' : function(_function){
			this.db.getAttributeNames(_function);
        },

        /**
         * Updates the information for the widget with the provided handle and calls the callback afterwards.
         *
         * @public
         * @virtual
         * @alias queryReferencedWidget
         * @memberof Aggregator#
         * @param {WidgetHandle} _widgetHandle The handle of the widget to query.
         * @param {Callback} _callback The callback to query after the widget was updated.
         */
        'virtual public queryReferencedWidget' :function(_widgetHandle, _callback){
            var widget = this.discoverer.getWidget(_widgetHandle.getId());
            widget.updateWidgetInformation(_callback);
        },

        /**
         * Updates all the widgets referenced by the aggregator and calls the callback afterwards.
         *
         * @param {Callback} _callback The callback to query after all the widget where updated.
         */
        'virtual public queryReferencedWidgets': function(_callback) {
            var self = this;
            var completedQueriesCounter = 0;
            var referencedWidgetHandles = this.getWidgets().getItems();

            for (var index in referencedWidgetHandles) {
                var theWidgetHandle = referencedWidgetHandles[index];
                this.queryReferencedWidget(theWidgetHandle, function () {
                    completedQueriesCounter++;
                    if (completedQueriesCounter == self.widgets.size()) {
                        if (_callback && typeof(_callback) == 'function') {
                            _callback();
                        }
                    }
                });
            }
        }
    });

	return Aggregator;
});