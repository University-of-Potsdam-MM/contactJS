/**
 * This module representing a Context Aggregator. 
 * It aggregates data from multiple widgets.
 * 
 * @module Aggregator
 * @fileOverview
 */
define(['easejs', 'MathUuid','widget',
        'attribute', 'attributeList', 'subscriber',
        'subscriberList', 'callbackList', 'storage', 'widgetDescription', 'interpreter', 'interpretation'],
 	function(easejs, MathUuid, Widget, Attribute,
 			AttributeList, Subscriber, SubscriberList,
 			CallbackList, Storage, WidgetDescription, Interpreter, Interpretation){

 	var Class = easejs.Class;
	var Aggregator =  Class('Aggregator').
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
		 * @type {Array}
		 * @memberof Aggregator#
		 * @desc List of subscribed widgets referenced by ID.
		 */
		'protected widgets' : [],

		/**
		 * @type {Array.<Interpretation>}
		 */
		'protected interpretations' : [],

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
		 * @requires Attribute
		 * @requires AttributeList
		 * @requires Subscriber
		 * @requires SubscriberList
		 * @requires Storage
		 * @requires Widget
		 * @constructs Aggregator
		 */
		'override virtual public __construct': function(_discoverer, _attributes)
        {
			this.id = Math.uuid();
			this.widgets = [];
            this.interpretations = [];
			this.__super(_discoverer, _attributes);
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
		 * Sets Widget IDs.
		 * 
		 * @protected
	   	 * @alias setWidgets
		 * @memberof Aggregator#
		 * @param {Array} _widgetIds List of Widget IDs
	     */
		'protected setWidgets' : function(_widgetIds){
			this.widgets = _widgetIds;
		},
		
		/**
		 * Adds Widget ID.
		 * 
		 * @public
	   	 * @alias addWidget
		 * @memberof Aggregator#
		 * @param {String|Widget} _widgetIdOrWidget Widget ID
	     */
		'public addWidget' : function(_widgetIdOrWidget){
            if (Class.isA(Widget, _widgetIdOrWidget)) {
                this.widgets.push(_widgetIdOrWidget.getId());
            } else if(typeof _widgetIdOrWidget == "string") {
                this.widgets.push(_widgetIdOrWidget);
            }
		},
		
		/**
		 * Returns the available Widget IDs.
		 * 
		 * @public
		 * @alias getWidgets
		 * @memberof Aggregator#
		 * @returns {Array}
		 */
		'public getWidgets' : function() {
			return this.widgets;
		},
		
		/**
		 * Removes Widget ID from list.
		 * 
		 * @protected
	   	 * @alias removeWidget
		 * @memberof Aggregator#
		 * @param {String} _widgetId Id of the Widget
	     */
		'protected removeWidget' : function(_widgetId){
            var index = this.widgets.indexOf(_widgetId);
            if (index > -1) {
                this.widgets = this.widgets.splice(index, 1);
            }
		},
		
		/**
		 * Retrieves all Attributes of the specified widgets.
		 * 
		 * @protected
	   	 * @alias initAttributes
		 * @memberof Aggregator#
	     */
		'protected initAttributes' : function(){
			if(this.widgets.length > 0){
				var widgetIdList = this.widgets;
				for(var i in widgetIdList){
					var widgetId = widgetIdList[i];
					var widgetInstance = this.discoverer.getComponent(widgetId);
					if (widgetInstance) {
						this.setAttributes(widgetInstance.queryAttributes());
					}
                }
            }
        },
		
		/**
		 * Retrieves all ConstantAttributes of the specified widgets.
		 * 
		 * @protected
	   	 * @alias initConstantAttributes
		 * @memberof Aggregator#
	     */
		'protected initConstantAttributes' : function(){
			if(this.widgets.length > 0){
                var widgetIdList = this.widgets;
				for(var i in widgetIdList){
					var widgetId = widgetIdList[i];
					var widgetInstance = this.discoverer.getComponent(widgetId);
					if (widgetInstance) {
						this.setConstantAttributes(widgetInstance.queryConstantAttributes());
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
			if(this.widgets.length > 0){
				var widgetIdList = this.widgets;
				for(var i in widgetIdList){
					var widgetId = widgetIdList[i];
					this.initWidgetSubscription(widgetId);
                }
            }
        },

		/**
		 * Start the setup of the aggregator after the initialisation has finished.
		 *
		 * @public
		 * @alias didFinishInitialization
		 * @memberof Aggregator#
		 * @param _attributes
		 */
        'override public didFinishInitialization': function(_attributes) {
            this.aggregatorSetup(_attributes);
        },
		
		/**
		 * InitMethod for Aggregators. Called by constructor.
		 * Initializes the associated Storage.
		 * 
		 * @protected
	   	 * @alias aggregatorSetup
		 * @memberof Aggregator#
	     */
		'protected aggregatorSetup' : function(_attributes){
			this.initStorage('DB_'+this.name);
			this.setAggregatorAttributeValues(_attributes);
			this.setAggregatorConstantAttributeValues();
			this.setAggregatorCallbacks();

            this.didFinishSetup();
		},
		
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
		'virtual protected setAggregatorAttributeValues' : function(_attributes) {
            for (var index in _attributes) {
                var theAttribute = _attributes[index];
                this.addAttribute(theAttribute);
            }
        },

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
		'virtual protected setAggregatorConstantAttributeValues' : function() {

        },

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
		'virtual protected setAggregatorCallbacks' : function() {

        },

		/**
		 * Returns the current Attributes that are saved in the cache.
		 * 
		 * @public
	   	 * @alias getCurrentData
		 * @memberof Aggregator#
		 * @returns {AttributeList}
	     */
		'public getCurrentData' : function(){
			return this.attributes;
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
				_widget.addSubscriber(subscriber);
            }
        },
		
		/**
		 * Subscribes to the widgets that are defined in the Widget ID List
         * used in the initCallback method.
		 * 
		 * @protected
	   	 * @alias initWidgetSubscription
		 * @memberof Aggregator#
		 * @param {String} _widgetId Widget that should be subscribed.
		 * @returns {?CallbackList}
	     */
		'protected initWidgetSubscription' : function(_widgetId){
			var calls = null;
			if(Class.isA(String, _widgetId)){
				var widget = this.discoverer.getComponent(_widgetId);
				if (widget){
					//subscribe to all callbacks
					calls = widget.queryCallbacks();
					this.subscribeTo(widget, calls);
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
		 * @param {String|Widget|WidgetDescription} _widgetIdOrWidget Widget that should be subscribed.
		 * @param {CallbackList} _callbackList required Callbacks
	     */
		'public addWidgetSubscription' : function(_widgetIdOrWidget, _callbackList){
            if (Class.isA(Widget, _widgetIdOrWidget) || Class.isA(WidgetDescription, _widgetIdOrWidget)) {
                if (Class.isA(Widget, _widgetIdOrWidget) && (!_callbackList || !Class.isA(CallbackList, _callbackList))) {
                    _callbackList = _widgetIdOrWidget.getCallbackList();
                }
                _widgetIdOrWidget = _widgetIdOrWidget.getId();
            }
			if(typeof _widgetIdOrWidget == "string" && Class.isA(CallbackList, _callbackList)){
				var widget = this.discoverer.getComponent(_widgetIdOrWidget);
				if (widget) {
					this.subscribeTo(widget, _callbackList);			
					this.callbacks.putAll(_callbackList);			
					var callsList = _callbackList.getItems();		
					for(var x in callsList){
						var singleCallback = callsList[x];			
						var typeList = singleCallback.getAttributeTypes().getItems();
						for(var y in typeList){
							var singleType = typeList[y];
							this.addAttribute(singleType);
                        }
                    }
                    this.addWidget(_widgetIdOrWidget);
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
		 * @param {String} _widgetId Widget that should be removed.
	     */
		'public unsubscribeFrom' : function(_widgetId){
			if(typeof _widgetId == "string") {
				var widget = this.discoverer.getComponent(_widgetId);
				if (widget) {
					console.log('aggregator unsubscribeFrom: ' + widget.getName());
					widget.removeSubscriber(this.id);
					this.removeWidget(_widgetId);
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
		 * @param {(AttributeList|Array)}  _data data that shall be input
	     */
		'override public putData' : function(_data){
			var list = [];
			if(_data instanceof Array){
				list = _data;
			} else if (Class.isA(AttributeList, _data)) {
				list = _data.getItems();
			}
			for(var i in list){
				var x = list[i];
				if(Class.isA(Attribute, x ) && this.isAttribute(x)){
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
		 * @param {?function} _function for additional actions, if an asynchronous function is used
	     */
		'public interpretData' : function(_interpreterId, _inAttributeValues, _outAttributeValues, _function){
			var interpreter = this.discoverer.getComponent(_interpreterId);
			if (Class.isA(Interpreter, interpreter)) {
				interpreter.callInterpreter(_inAttributeValues, _outAttributeValues, _function);
			}
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
		 * Only updates the attribute cache in the database.
		 * For an alternative action a callback can be used.
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
         * Updates the information for the widget with the provided ID and calls the callback afterwards.
         *
         * @public
         * @virtual
         * @alias queryReferencedWidget
         * @memberof Aggregator#
         * @param {String} _widgetId The ID of the widget to query.
         * @param {Callback} _callback The callback to query after the widget was updated.
         */
        'virtual public queryReferencedWidget' :function(_widgetId, _callback){
            this.discoverer.getWidget(_widgetId).updateWidgetInformation(_callback);
        },

		/**
		 * Returns the UUIDs of all connected widgets and interpreters.
		 *
		 * @private
		 * @alias getComponentUUIDs
		 * @memberof Aggregator#
		 * @returns {Array.<T>} The UUIDs.
		 */
        'private getComponentUUIDs': function() {
            var uuids = [];
			uuids = uuids.concat(this.widgets);
			for (var index in this.interpretations) {
				var theInterpretation = this.interpretations[index];
				uuids.push(theInterpretation.interpreterId);

			}
			return uuids;
        },

		/**
		 * Return true if a component with the provided UUID was connected to the aggregator.
		 *
		 * @private
		 * @alias hasComponent
		 * @memberof Aggregator#
		 * @param {String} uuid The UUID of the component to check.
		 * @returns {boolean}
		 */
        'private hasComponent': function(uuid) {
            return jQuery.inArray(uuid, this.getComponentUUIDs()) != -1;
        },

		/**
		 *
		 * @private
		 * @alias doesSatisfyAttributeType
		 * @param _attribute
		 * @returns {boolean}
		 */
        'private doesSatisfyAttributeType': function(_attribute) {
            var componentUUIDs = this.getComponentUUIDs();
            var doesSatisfy = false;

            for (var index in componentUUIDs) {
                var theComponent = this.discoverer.getComponent(componentUUIDs[index]);
                if (theComponent.getDescription().doesSatisfyAttributeType(_attribute)) {
                    doesSatisfy = true;
                }
            }

            return doesSatisfy;
        },

		/**
		 * Searches for components that can satisfy the requested attributes. Through recursion it is possible to search
		 * for components that satisfy attributes of components that have been found in the process.
		 *
		 * @private
		 * @alias getComponentsForUnsatisfiedAttributeTypes
		 * @memberof Aggregator#
		 * @param {AttributeList} _unsatisfiedAttributes A list of attributes that components should be searched for.
		 * @param {boolean} _all If true all attributes must be satisfied by a single component.
		 * @param {Array} _componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
		 */
        'private getComponentsForUnsatisfiedAttributeTypes': function(_unsatisfiedAttributes, _all, _componentTypes) {
			// ask the discoverer for components that satisfy the requested components
            var relevantComponents = this.discoverer.getComponentsByAttributes(_unsatisfiedAttributes, _all, _componentTypes);
            console.log("I found "+relevantComponents.length+" component(s) of type "+_componentTypes+" that might satisfy the requested attributes.");

			// iterate over all found components
            for(var index in relevantComponents) {
				// get the component
                var theComponent = relevantComponents[index];
                console.log("Let's look at component "+theComponent.getName()+".");

				// if the component was added before, ignore it
                if (!this.hasComponent(theComponent.getId())) {
                    var outAttributes = theComponent.getDescription().getOutAttributeTypes().getItems();

                    // if component is a widget and it wasn't added before, subscribe to its callbacks
                    if (Class.isA(Widget, theComponent)) {
                        console.log("It's a widget.");

                        this.addWidgetSubscription(theComponent);
                        // remove satisfied attributes
                        for (var widgetOutAttributeIndex in outAttributes) {
                            var widgetOutAttribute = outAttributes[widgetOutAttributeIndex];
							// add the attribute type to the aggregators list of handled attribute types
                            if (!this.getAttributes().containsTypeOf(widgetOutAttribute)) this.addAttribute(widgetOutAttribute);
                            console.log("I can now satisfy attribute "+widgetOutAttribute+" with the help of "+theComponent.getName()+"! That was easy :)");
                            _unsatisfiedAttributes.removeAttributeWithTypeOf(widgetOutAttribute);
                        }
                    } else if (Class.isA(Interpreter, theComponent)) { // if the component is an interpreter and all its in attributes can be satisfied, add the interpreter
                        console.log("It's an interpreter.");

                        var inAttributes = theComponent.getInAttributes().getItems();
                        var canSatisfyInAttributes = true;

						// iterate over the attributes needed to satisfy the interpreter
                        for (var inAttributeIdentifier in inAttributes) {
							// get the attribute
                            var theInAttribute = inAttributes[inAttributeIdentifier];
                            console.log("The interpreter needs the attribute "+theInAttribute+".");

							// if required attribute is not already satisfied by the aggregator search for components that do
                            if (!this.doesSatisfyAttributeType(theInAttribute)) {
                                console.log("It seems that I can't satisfy "+theInAttribute+", but I will search for components that can.");
                                var newAttributeList = new AttributeList();
                                newAttributeList.put(theInAttribute);
                                this.getComponentsForUnsatisfiedAttributeTypes(newAttributeList, false, [Widget, Interpreter]);
								// if the attribute still can't be satisfied drop the interpreter
                                if (!this.doesSatisfyAttributeType(theInAttribute)) {
                                    console.log("I couldn't find a component to satisfy "+theInAttribute+". Dropping interpreter "+theComponent.getName()+". Bye bye.");
                                    canSatisfyInAttributes = false;
                                    break;
                                }
                            } else {
                                console.log("It seems that I already satisfy the attribute "+theInAttribute+". Let's move on.");
                            }
                        }

                        if (canSatisfyInAttributes) {
                            // remove satisfied attribute
                            for (var interpreterOutAttributeIndex in outAttributes) {
                                var interpreterOutAttribute = outAttributes[interpreterOutAttributeIndex];
								// add the attribute type to the aggregators list of handled attribute types
								for (var unsatisfiedAttributeIndex in _unsatisfiedAttributes.getItems()) {
									var theUnsatisfiedAttribute = _unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
									if (theUnsatisfiedAttribute.equalsTypeOf(interpreterOutAttribute)) {
										this.addAttribute(theUnsatisfiedAttribute);
										console.log("I can now satisfy attribute "+theUnsatisfiedAttribute+" with the help of "+theComponent.getName()+"! Great!");
										this.interpretations.push(new Interpretation(theComponent.getId(), theComponent.getInAttributes(), new AttributeList().withItems([theUnsatisfiedAttribute])));
									}
								}
								_unsatisfiedAttributes.removeAttributeWithTypeOf(interpreterOutAttribute, true);
                            }
						} else {
                            console.log("Found interpreter but can't satisfy required attributes.");
                            for (var j in theComponent.getDescription().getInAttributeTypes().getItems()) {
                                console.log("Missing "+theComponent.getDescription().getInAttributeTypes().getItems()[j]+".");
                            }
                        }
                    }
                } else {
                    console.log("Aggregator already has component "+theComponent.getName()+". Nothing to do here ;)");
                }
            }
        },

		/**
		 * After the aggregator finished its setup start searching for component that satisfy the attributes that where requrested.
		 *
		 * @public
		 * @virtual
		 * @alias didFinishSetup
		 * @memberof Aggregator#
		 */
        'virtual public didFinishSetup': function() {
            unsatisfiedAttributes = this.getAttributes().clone();

            // get all widgets that satisfy attribute types
            this.getComponentsForUnsatisfiedAttributeTypes(unsatisfiedAttributes, false, [Widget]);
            // get all interpreters that satisfy attribute types
            this.getComponentsForUnsatisfiedAttributeTypes(unsatisfiedAttributes, false, [Interpreter]);

			console.log("Unsatisfied attributes: "+unsatisfiedAttributes.size());
			console.log("Satisfied attributes: "+this.getAttributes().size());
			console.log("Interpretations "+this.interpretations.length);
        },

        /**
         * Updates all the widgets referenced by the aggregator and calls the provided callback afterwards.
         *
		 * @public
		 * @virtual
		 * @alias queryReferencedWidgets
		 * @memberof Aggregator#
         * @param {Function} _callback The callback to query after all the widget where updated.
         */
        'virtual public queryReferencedWidgets': function(_callback) {
            var self = this;
            var completedQueriesCounter = 0;

            if (this.widgets.length > 0) {
                for (var index in this.widgets) {
                    var theWidgetId = this.widgets[index];
                    this.queryReferencedWidget(theWidgetId, function () {
                        completedQueriesCounter++;
                        if (completedQueriesCounter == self.widgets.length) {
                            if (_callback && typeof(_callback) == 'function') {
                                _callback(self.getAttributes());
                            }
                        }
                    });
                }
            } else {
				if (_callback && typeof(_callback) == 'function') {
                    _callback(self.getAttributes());
                }
            }
        },

		/**
		 * Let's all connected interpreters interpret data.
		 *
		 * @public
		 * @alias queryReferencedInterpreters
		 * @memberof Aggregator#
		 * @param {Function} _callback The callback to query after all the interpreters did interpret data.
		 */
        'public queryReferencedInterpreters': function(_callback) {
            var self = this;
            var completedQueriesCounter = 0;

			if (this.interpretations.length > 0) {
				for (var index in this.interpretations) {
					var theInterpretation = this.interpretations[index];
					var theInterpreterId = theInterpretation.interpreterId;
					var interpretationInAttributeValues = this.getAttributes(theInterpretation.inAttributeTypes);
					var interpretationOutAttributeValues = this.getAttributes(theInterpretation.outAttributeTypes);

					self.interpretData(theInterpreterId, interpretationInAttributeValues, interpretationOutAttributeValues, function(_interpretedData) {
						for (var j in _interpretedData.getItems()) {
							var theInterpretedData = _interpretedData.getItems()[j];

							self.addAttribute(theInterpretedData);
							if (self.db){
								self.store(theInterpretedData);
							}
						}

						completedQueriesCounter++;
						if (completedQueriesCounter == self.interpretations.length) {
							if (_callback && typeof(_callback) == 'function') {
								_callback(self.getAttributes());
							}
						}
					});
				}
			} else {
				if (_callback && typeof(_callback) == 'function') {
					_callback(self.getAttributes());
				}
			}
        },

		/**
		 * Query all referenced widgets and afterwards all connected interpreters.
		 *
		 * @public
		 * @alias queryReferencedComponents
		 * @memberof Aggregator#
		 * @param {Function} _callback the callback to query after all components did finish their work.
		 */
        'public queryReferencedComponents': function(_callback) {
            var self = this;

            this.queryReferencedWidgets(function(_attributeValues) {
                self.queryReferencedInterpreters(function(_attributeValues) {
                    if (_callback && typeof(_callback) == 'function') {
                        _callback(_attributeValues);
                    }
                });
            });
        }
    });

	return Aggregator;
});