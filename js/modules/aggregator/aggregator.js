/**
 * This module representing a Context Aggregator. 
 * It aggregates data from multiple widgets.
 * 
 * @module Aggregator
 * @fileOverview
 */
define(['MathUuid', 'widget', 'attribute', 'attributeList', 'subscriber', 'subscriberList', 'callbackList', 'storage', 'interpreter', 'interpretation'],
 	function(MathUuid, Widget, Attribute, AttributeList, Subscriber, SubscriberList, CallbackList, Storage, Interpreter, Interpretation){
		return (function() {
			/**
			 * Constructor: Generates the id and initializes the Aggregator.
			 *
			 * @class Aggregator
			 * @extends Widget
			 * @classdesc The Widget handles the access to sensors.
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
			function Aggregator(discoverer, attributes) {
				/**
				 * List of subscribed widgets referenced by ID.
				 *
				 * @protected
				 * @type {Array.<Widget>}
				 */
				this._widgets = [];

				/**
				 *
				 * @protected
				 * @type {Array.<Interpretation>}
				 */
				this._interpretations = [];

				/**
				 * Database of the Aggregator.
				 *
				 * @protected
				 * @type {Storage}
				 */
				this._db = new Storage("DB_Aggregator", 7200000, 5);

				Widget.call(this, discoverer, attributes);

				/**
				 * Name of the Aggregator.
				 *
				 * @public
				 * @type {string}
				 */
				this.name = 'Aggregator';
			}

			Aggregator.prototype = Object.create(Widget.prototype);

			/**
			 * Returns the type of this class, in this case "Aggregator".
			 *
			 * @override
			 * @public
			 * @returns {string}
			 */
			Aggregator.prototype.getType = function() {
				return 'Aggregator';
			};

			/**
			 * Sets Widget IDs.
			 *
			 * @protected
			 * @param {Array.<String>} widgetIds List of Widget IDs
			 */
			Aggregator.prototype._setWidgets = function(widgetIds){
				this._widgets = widgetIds;
			};

			/**
			 * Adds Widget ID.
			 *
			 * @public
			 * @param {String|Widget} widgetIdOrWidget Widget ID
			 */
			Aggregator.prototype.addWidget = function(widgetIdOrWidget){
				if (widgetIdOrWidget.constructor === Widget) {
					this._widgets.push(widgetIdOrWidget.getId());
				} else if(typeof widgetIdOrWidget == "string") {
					this._widgets.push(widgetIdOrWidget);
				}
			};

			/**
			 * Returns the available Widget IDs.
			 *
			 * @public
			 * @returns {Array}
			 */
			Aggregator.prototype.getWidgets = function() {
				return this._widgets;
			};

			/**
			 * Removes Widget ID from list.
			 *
			 * @protected
			 * @param {String} _widgetId Id of the Widget
			 */
			Aggregator.prototype._removeWidget = function(_widgetId) {
				var index = this._widgets.indexOf(_widgetId);
				if (index > -1) {
					this._widgets = this._widgets.splice(index, 1);
				}
			};

			/**
			 * Retrieves all Attributes of the specified widgets.
			 *
			 * @protected
			 */
			Aggregator.prototype._initOutAttributes = function() {
				if(this._widgets.length > 0){
					for(var i in this._widgets){
						var widgetId = this._widgets[i];
						/** @type {Widget} */
						var theWidget = this._discoverer.getComponent(widgetId);
						if (theWidget) {
							this._setOutAttributes(theWidget.getOutAttributes());
						}
					}
				}
			};

			/**
			 * Retrieves all ConstantAttributes of the specified widgets.
			 *
			 * @protected
			 */
			Aggregator.prototype._initConstantOutAttributes = function() {
				if(this._widgets.length > 0){
					for(var i in this._widgets){
						var widgetId = this._widgets[i];
						/** @type {Widget} */
						var theWidget = this._discoverer.getComponent(widgetId);
						if (theWidget) {
							this._setConstantOutAttributes(theWidget.getConstantOutAttributes());
						}
					}
				}
			};

			/**
			 * Retrieves all actual Callbacks of the specified Widgets.
			 *
			 * @protected
			 * @override
			 */
			Aggregator.prototype._initCallbacks = function() {
				if(this._widgets.length > 0){
					for(var i in this._widgets){
						var widgetId = this._widgets[i];
						this.initWidgetSubscription(widgetId);
					}
				}
			};

			/**
			 * Start the setup of the aggregator after the initialisation has finished.
			 *
			 * @public
			 * @override
			 * @param {AttributeList} attributes
			 */
			Aggregator.prototype.didFinishInitialization = function(attributes) {
				this._aggregatorSetup(attributes);
			};

			/**
			 * InitMethod for Aggregators. Called by constructor. Initializes the associated Storage.
			 *
			 * @protected
			 */
			Aggregator.prototype._aggregatorSetup = function(attributes) {
				this._setAggregatorAttributeValues(attributes);
				this._setAggregatorConstantAttributeValues();
				this._setAggregatorCallbacks();

				this.didFinishSetup();
			};

			/**
			 * Initializes the provided attributeValues that are only specific to the Aggregator.
			 * Called by aggregatorSetup().
			 *
			 * @virtual
			 * @protected
			 */
			Aggregator.prototype._setAggregatorAttributeValues = function(attributes) {
				for (var index in attributes) {
					var theAttribute = attributes[index];
					this.addOutAttribute(theAttribute);
				}
			};

			/**
			 * Initializes the provided ConstantAttributeValues that are only specific to the Aggregator.
			 * Called by aggregatorSetup().
			 *
			 * @virtual
			 * @protected
			 */
			Aggregator.prototype._setAggregatorConstantAttributeValues = function() {

			};

			/**
			 * Initializes the provided Callbacks that are only specific to the Aggregator.
			 * Called by aggregatorSetup().
			 *
			 * @virtual
			 * @protected
			 */
			Aggregator.prototype._setAggregatorCallbacks = function() {

			};

			/**
			 * Returns the current Attributes that are saved in the cache.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Aggregator.prototype.getCurrentData = function() {
				return this._outAttributes;
			};

			/**
			 * Subscribes to the given widget for the specified Callbacks.
			 *
			 * @protected
			 * @param {Widget} widget Widget that should be subscribed to.
			 * @param {CallbackList} callbacks required Callbacks
			 * @param subSet
			 * @param conditions
			 */
			Aggregator.prototype._subscribeTo = function(widget, callbacks, subSet, conditions){
				if(widget.constructor === Widget){
					var subscriber = new Subscriber().withSubscriberId(this.id).
						withSubscriberName(this.name).
						withSubscriptionCallbacks(callbacks).
						withAttributesSubset(subSet).
						withConditions(conditions);
					widget.addSubscriber(subscriber);
				}
			};

			/**
			 * Subscribes to the widgets that are defined in the Widget ID List
			 * used in the initCallback method.
			 *
			 * @protected
			 * @param {String} widgetId Widget that should be subscribed.
			 * @returns {?CallbackList}
			 */
			Aggregator.prototype._initWidgetSubscription = function(widgetId) {
				var callbacks = null;
				if(typeof widgetId == "string"){
					/** @type {Widget} */
					var theWidget = this._discoverer.getComponent(widgetId);
					if (theWidget) {
						//subscribe to all callbacks
						callbacks = theWidget.getCallbackList();
						this.subscribeTo(theWidget, callbacks);
					}
				}
				return callbacks;
			};

			/**
			 * Adds the specified callbacks of a widget to the aggregator.
			 *
			 * @public
			 * @param {String|Widget} widgetIdOrWidget Widget that should be subscribed.
			 * @param {CallbackList} callbackList required Callbacks
			 */
			Aggregator.prototype.addWidgetSubscription = function(widgetIdOrWidget, callbackList){
				if (widgetIdOrWidget.constructor === Widget) {
					if (!callbackList || callbackList.constructor !== CallbackList) {
						callbackList = widgetIdOrWidget.getCallbackList();
					}
					widgetIdOrWidget = widgetIdOrWidget.getId();
				}
				if(typeof widgetIdOrWidget == "string" && callbackList.constructor === CallbackList) {
					/** @type {?Widget} */
					var theWidget = this._discoverer.getComponent(widgetIdOrWidget);
					if (theWidget) {
						this._subscribeTo(theWidget, callbackList);
						this._callbacks.putAll(callbackList);
						var callsList = callbackList.getItems();
						for(var x in callsList){
							var singleCallback = callsList[x];
							var typeList = singleCallback.getAttributeTypes().getItems();
							for(var y in typeList){
								var singleType = typeList[y];
								this.addOutAttribute(singleType);
							}
						}
						this.addWidget(widgetIdOrWidget);
					}
				}
			};

			/**
			 * Removes subscribed Widgets and deletes the entry
			 * for subscribers in the associated Widget.
			 *
			 * @public
			 * @param {String} widgetId Widget that should be removed.
			 */
			Aggregator.prototype.unsubscribeFrom = function(widgetId) {
				if(typeof widgetId == "string") {
					var widget = this._discoverer.getComponent(widgetId);
					if (widget) {
						console.log('aggregator unsubscribeFrom: ' + widget.getName());
						widget.removeSubscriber(this.id);
						this._removeWidget(widgetId);
					}
				}
			};

			/**
			 * Puts context data to Widget and expects an array.
			 *
			 * @override
			 * @public
			 * @param {(AttributeList|Array)}  _data data that shall be input
			 */
			Aggregator.prototype.putData = function(attributeListOrArray){
				var list = [];
				if(attributeListOrArray instanceof Array){
					list = attributeListOrArray;
				} else if (attributeListOrArray.constructor === AttributeList) {
					list = attributeListOrArray.getItems();
				}
				for(var i in list){
					var theAttribute = list[i];
					if(theAttribute.constructor === Attribute && this._isOutAttribute(theAttribute)){
						this.addOutAttribute(theAttribute);
						if(this._db){
							this._store(theAttribute);
						}
					}
				}
			};

			/**
			 * Calls the given Interpreter for interpretation the data.
			 *
			 * @public
			 * @param {String} interpreterId ID of the searched Interpreter
			 * @param {AttributeList} inAttributes
			 * @param {AttributeList} outAttributes
			 * @param {?function} callback for additional actions, if an asynchronous function is used
			 */
			Aggregator.prototype.interpretData = function(interpreterId, inAttributes, outAttributes, callback){
				var interpreter = this._discoverer.getComponent(interpreterId);
				if (interpreter.constructor === Interpreter) {
					interpreter.callInterpreter(inAttributes, outAttributes, callback);
				}
			};

			/**
			 * Stores the data.
			 *
			 * @protected
			 * @param {Attribute} attribute data that should be stored
			 */
			Aggregator.prototype._store = function(attribute) {
				this._db.store(attribute);
			};

			/**
			 * Queries the database and returns the last retrieval result.
			 * It may be that the retrieval result is not up to date,
			 * because an asynchronous function is used for the retrieval.
			 * For retrieving the current data, this function can be used as callback function
			 * in retrieveStorage().
			 *
			 * @public
			 * @param {String} name Name of the searched AtTributes.
			 * @param {?function} callback for alternative  actions, because an asynchronous function is used
			 */
			Aggregator.prototype.queryAttribute = function(name, callback){
				this._db.retrieveAttributes(name, callback);
			};

			/**
			 * Queries a specific table and only actualizes the storage cache.
			 * For an alternativ action can be used a callback.
			 *
			 * @public
			 * @returns {RetrievalResult}
			 */
			Aggregator.prototype.retrieveStorage = function() {
				return this._db.getCurrentData();
			};

			/**
			 * Returns an overview about the stored attributes.
			 * It may be that the overview about the stored attributes is not up to date,
			 * because an asynchronous function is used for the retrieval.
			 * For retrieving the current data, this function can be used as callback function
			 * in queryTables().
			 *
			 * @public
			 * @returns {?Array}
			 */
			Aggregator.prototype.getStorageOverview = function() {
				return this._db.getAttributesOverview();
			};

			/**
			 * Only updates the attribute cache in the database.
			 * For an alternative action a callback can be used.
			 *
			 * @public
			 * @param {?function} callback for alternative actions, because an asynchronous function is used
			 */
			Aggregator.prototype.queryTables = function(callback) {
				this._db.getAttributeNames(callback);
			};

			/**
			 * Updates the information for the widget with the provided ID and calls the callback afterwards.
			 *
			 * @public
			 * @virtual
			 * @param {String} widgetId The ID of the widget to query.
			 * @param {Callback} callback The callback to query after the widget was updated.
			 */
			Aggregator.prototype.queryReferencedWidget = function(widgetId, callback) {
				this._discoverer.getWidget(widgetId).updateWidgetInformation(callback);
			};

			/**
			 * Returns the UUIDs of all connected widgets and interpreters.
			 *
			 * @private
			 * @returns {Array.<T>} The UUIDs.
			 */
			Aggregator.prototype.getComponentUUIDs = function() {
				var uuids = [];
				uuids = uuids.concat(this._widgets);
				for (var index in this._interpretations) {
					var theInterpretation = this._interpretations[index];
					uuids.push(theInterpretation.interpreterId);
				}
				return uuids;
			};

			/**
			 * Return true if a component with the provided UUID was connected to the aggregator.
			 *
			 * @private
			 * @alias hasComponent
			 * @memberof Aggregator#
			 * @param {String} uuid The UUID of the component to check.
			 * @returns {boolean}
			 */
			Aggregator.prototype._hasComponent = function(uuid) {
				return jQuery.inArray(uuid, this.getComponentUUIDs()) != -1;
			};

			/**
			 *
			 * @override
			 * @public
			 * @param {Attribute} attribute
			 * @returns {boolean}
			 */
			Aggregator.prototype.doesSatisfyTypeOf = function(attribute) {
				var componentUUIDs = this.getComponentUUIDs();
				var doesSatisfy = false;

				for (var index in componentUUIDs) {
					var theComponent = this._discoverer.getComponent(componentUUIDs[index]);
					if (theComponent.doesSatisfyTypeOf(attribute)) {
						doesSatisfy = true;
					}
				}

				return doesSatisfy;
			};

			/**
			 * Searches for components that can satisfy the requested attributes. Through recursion it is possible to search
			 * for components that satisfy attributes of components that have been found in the process.
			 *
			 * @private
			 * @param {AttributeList} unsatisfiedAttributes A list of attributes that components should be searched for.
			 * @param {boolean} all If true all attributes must be satisfied by a single component.
			 * @param {Array} componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
			 */
			Aggregator.prototype._getComponentsForUnsatisfiedAttributes = function(unsatisfiedAttributes, all, componentTypes) {
				// ask the discoverer for components that satisfy the requested components
				var relevantComponents = this._discoverer.getComponentsByAttributes(unsatisfiedAttributes, all, componentTypes);
				console.log("I found "+relevantComponents.length+" component(s) of type "+componentTypes+" that might satisfy the requested attributes.");

				// iterate over all found components
				for(var index in relevantComponents) {
					// get the component
					var theComponent = relevantComponents[index];
					console.log("Let's look at component "+theComponent.getName()+".");

					// if the component was added before, ignore it
					if (!this._hasComponent(theComponent.getId())) {
						var outAttributes = theComponent.getOutAttributes().getItems();

						// if component is a widget and it wasn't added before, subscribe to its callbacks
						if (theComponent.constructor === Widget) {
							console.log("It's a widget.");

							this.addWidgetSubscription(theComponent);
							// remove satisfied attributes
							for (var widgetOutAttributeIndex in outAttributes) {
								var widgetOutAttribute = outAttributes[widgetOutAttributeIndex];
								// add the attribute type to the aggregators list of handled attribute types
								if (!this.getOutAttributes().containsTypeOf(widgetOutAttribute)) this.addOutAttribute(widgetOutAttribute);
								console.log("I can now satisfy attribute "+widgetOutAttribute+" with the help of "+theComponent.getName()+"! That was easy :)");
								unsatisfiedAttributes.removeAttributeWithTypeOf(widgetOutAttribute);
							}
						} else if (theComponent.constructor === Interpreter) { // if the component is an interpreter and all its in attributes can be satisfied, add the interpreter
							console.log("It's an interpreter.");

							var inAttributes = theComponent.getInAttributes().getItems();
							var canSatisfyInAttributes = true;

							// iterate over the attributes needed to satisfy the interpreter
							for (var inAttributeIdentifier in inAttributes) {
								// get the attribute
								var theInAttribute = inAttributes[inAttributeIdentifier];
								console.log("The interpreter needs the attribute "+theInAttribute+".");

								// if required attribute is not already satisfied by the aggregator search for components that do
								if (!this.doesSatisfyTypeOf(theInAttribute)) {
									console.log("It seems that I can't satisfy "+theInAttribute+", but I will search for components that can.");
									var newAttributeList = new AttributeList();
									newAttributeList.put(theInAttribute);
									this._getComponentsForUnsatisfiedAttributes(newAttributeList, false, [Widget, Interpreter]);
									// if the attribute still can't be satisfied drop the interpreter
									if (!this.doesSatisfyTypeOf(theInAttribute)) {
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
									for (var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()) {
										var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
										if (theUnsatisfiedAttribute.equalsTypeOf(interpreterOutAttribute)) {
											this.addOutAttribute(theUnsatisfiedAttribute);
											console.log("I can now satisfy attribute "+theUnsatisfiedAttribute+" with the help of "+theComponent.getName()+"! Great!");
											this.interpretations.push(new Interpretation(theComponent.getId(), theComponent.getInAttributes(), new AttributeList().withItems([theUnsatisfiedAttribute])));
										}
									}
									unsatisfiedAttributes.removeAttributeWithTypeOf(interpreterOutAttribute, true);
								}
							} else {
								console.log("Found interpreter but can't satisfy required attributes.");
								for (var j in theComponent.getInAttributes().getItems()) {
									console.log("Missing "+theComponent.getInAttributes().getItems()[j]+".");
								}
							}
						}
					} else {
						console.log("Aggregator already has component "+theComponent.getName()+". Nothing to do here ;)");
					}
				}
			};

			/**
			 * After the aggregator finished its setup start searching for component that satisfy the attributes that where requrested.
			 *
			 * @public
			 * @virtual
			 */
			Aggregator.prototype.didFinishSetup = function() {
				var unsatisfiedAttributes = this.getOutAttributes().clone();

				// get all widgets that satisfy attribute types
				this._getComponentsForUnsatisfiedAttributes(unsatisfiedAttributes, false, [Widget]);
				// get all interpreters that satisfy attribute types
				this._getComponentsForUnsatisfiedAttributes(unsatisfiedAttributes, false, [Interpreter]);

				console.log("Unsatisfied attributes: "+unsatisfiedAttributes.size());
				console.log("Satisfied attributes: "+this.getOutAttributes().size());
				console.log("Interpretations "+this._interpretations.length);
			};

			/**
			 * Updates all the widgets referenced by the aggregator and calls the provided callback afterwards.
			 *
			 * @public
			 * @virtual
			 * @param {Function} callback The callback to query after all the widget where updated.
			 */
			Aggregator.prototype.queryReferencedWidgets = function(callback) {
				var self = this;
				var completedQueriesCounter = 0;

				if (this._widgets.length > 0) {
					for (var index in this._widgets) {
						var theWidgetId = this._widgets[index];
						this.queryReferencedWidget(theWidgetId, function () {
							completedQueriesCounter++;
							if (completedQueriesCounter == self._widgets.length) {
								if (callback && typeof(callback) == 'function') {
									callback(self.getOutAttributes());
								}
							}
						});
					}
				} else {
					if (callback && typeof(callback) == 'function') {
						callback(self.getOutAttributes());
					}
				}
			};

			/**
			 * Let's all connected interpreters interpret data.
			 *
			 * @public
			 * @param {function} _callback The callback to query after all the interpreters did interpret data.
			 */
			Aggregator.prototype.queryReferencedInterpreters = function(callback) {
				var self = this;
				var completedQueriesCounter = 0;

				if (this.interpretations.length > 0) {
					for (var index in this.interpretations) {
						var theInterpretation = this.interpretations[index];
						var theInterpreterId = theInterpretation.interpreterId;
						var interpretationInAttributeValues = this.getOutAttributes(theInterpretation.inAttributeTypes);
						var interpretationOutAttributeValues = this.getOutAttributes(theInterpretation.outAttributeTypes);

						self.interpretData(theInterpreterId, interpretationInAttributeValues, interpretationOutAttributeValues, function(_interpretedData) {
							for (var j in _interpretedData.getItems()) {
								var theInterpretedData = _interpretedData.getItems()[j];

								self.addOutAttribute(theInterpretedData);
								if (self.db){
									self.store(theInterpretedData);
								}
							}

							completedQueriesCounter++;
							if (completedQueriesCounter == self.interpretations.length) {
								if (callback && typeof(callback) == 'function') {
									callback(self.getOutAttributes());
								}
							}
						});
					}
				} else {
					if (callback && typeof(callback) == 'function') {
						callback(self.getOutAttributes());
					}
				}
			};

			/**
			 * Query all referenced widgets and afterwards all connected interpreters.
			 *
			 * @public
			 * @alias queryReferencedComponents
			 * @memberof Aggregator#
			 * @param {Function} callback the callback to query after all components did finish their work.
			 */
			Aggregator.prototype.queryReferencedComponents = function(callback) {
				var self = this;

				this.queryReferencedWidgets(function(_attributeValues) {
					self.queryReferencedInterpreters(function(_attributeValues) {
						if (callback && typeof(callback) == 'function') {
							callback(_attributeValues);
						}
					});
				});
			};

			return Aggregator;
		})();
	}
);