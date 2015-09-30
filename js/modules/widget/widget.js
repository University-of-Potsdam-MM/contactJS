/**
 * This module representing a Context Widget.
 * 
 * @module Widget
 */
define(['component', 'MathUuid', 'callback', 'callbackList', 'attribute', 'attributeList', 'conditionList', 'subscriber', 'subscriberList'],
	function(Component, MathUuid, Callback, CallbackList, Attribute, AttributeList, ConditionList, Subscriber, SubscriberList) {
		return (function() {

			/**
			 * Defines all outAttributes and constOutAttributes as an object.
			 * @type {object}
			 * @public
			 */
			Widget.description = {
				out: [
					{
						"name":"",
						"type":""
					}
				],
				const: [
					{
						"name":"",
						"type":""
					}
				],
				updateInterval: 30000,
				requiredObjects: []
			};

			/**
			 * Constructor: Generates the ID and initializes the
			 * Widget with attributes, callbacks and subscriber
			 * that are specified in the provided functions.
			 *
			 * @param {Discoverer} discoverer
 			 * @param {AttributeList} attributes
			 * @abstract
			 * @classdesc The Widget handles the access to sensors.
			 * @constructs Widget
			 */
			function Widget(discoverer, attributes) {
				Component.call(this, discoverer);

				/**
				 * Name of the widget.
				 *
				 * @type {string}
				 * @private
				 */
				this._name  = 'Widget';

				/**
				 * This temporary variable is used for storing the old attribute values.
				 * So these can be used to check conditions.
				 *
				 * @type {AttributeList}
				 * @protected
				 */
				this._oldOutAttributes = new AttributeList();

				/**
				 *
				 * @protected
				 * @type {AttributeList}
				 * @desc All available constant Attributes and their values.
				 */
				this._constantOutAttributes = new AttributeList();

				/**
				 *
				 * @protected
				 * @type {CallbackList}
				 * @desc List of Callbacks.
				 */
				this._callbacks = new CallbackList();

				/**
				 *
				 * @protected
				 * @type {SubscriberList}
				 * @desc List of Subscriber.
				 */
				this._subscribers = new SubscriberList();

				/**
				 *
				 * @type {null}
				 * @private
				 */
				this._updateInterval = null;

				this._register();
				this._init(attributes);

				return this;
			}

			Widget.prototype = Object.create(Component.prototype);
			Widget.prototype.constructor = Widget;

			/**
			 * Function for initializing. Calls all initFunctions
			 * and will be called by the constructor.
			 *
			 * @protected
			 */
			Widget.prototype._init = function(attributes) {
				this._initOutAttributes();
				this._initConstantOutAttributes();
				this._initCallbacks();
			};

			/**
			 * Initializes the provided Attributes.
			 *
			 * @private
			 */
			Widget.prototype._initOutAttributes = function() {
				this._outAttributes = AttributeList.fromAttributeDescriptions(this._discoverer, this.constructor.description.out);
			};

			/**
			 * Initializes the provided ConstantAttributes.
			 *
			 * @private
			 */
			Widget.prototype._initConstantOutAttributes = function() {
				this._constantOutAttributes = AttributeList.fromAttributeDescriptions(this._discoverer, this.constructor.description.const);
			};

			/**
			 * Initializes the provided Callbacks.
			 *
			 * @abstract
			 * @protected
			 */
			Widget.prototype._initCallbacks = function() {
				throw new Error("Abstract function!");
			};

			/**
			 * Returns the available ConstantAttributeTypes
			 * (attributes that do not change).
			 *
			 * @public
			 * @param {?AttributeList} attributes
			 * @returns {AttributeList}
			 */
			Widget.prototype.getConstantOutAttributes = function(attributes) {
				if (attributes && attributes instanceof AttributeList) {
					return this._constantOutAttributes.getSubset(attributes);
				} else {
					return this._constantOutAttributes;
				}
			};

			/**
			 * Returns the last acquired attribute value with the given attribute type.
			 *
			 * @param {Attribute} attribute The attribute to return the last value for.
			 * @returns {*}
			 */
			Widget.prototype.getLastValueForAttributeWithTypeOf = function(attribute) {
				return this.getOutAttributes().getAttributeWithTypeOf(attribute).getValue();
			};

			/**
			 * Returns the old Attributes.
			 *
			 * @returns {AttributeList}
			 */
			Widget.prototype.getOldAttributes = function() {
				return this._oldOutAttributes;
			};

			/**
			 * Returns a list of callbacks that can be
			 * subscribed to.
			 *
			 * @returns {CallbackList}
			 */
			Widget.prototype.getCallbackList = function() {
				return this._callbacks;
			};

			/**
			 * Returns the specified callbacks that can be
			 * subscribed to.
			 *
			 * @returns {Array}
			 */
			Widget.prototype.getCallbacks = function() {
				return this._callbacks.getItems();
			};

			Widget.prototype.queryServices = function() {
				return this.services;
			};

			/**
			 * Returns the Subscriber.
			 *
			 * @returns {SubscriberList}
			 */
			Widget.prototype.getSubscriber = function() {
				return this._subscribers;
			};

			/**
			 * Adds a new AttributeValue. If the given value is
			 * not included in the list, the associated type will
			 * be also added. Otherwise, only the value will be
			 * updated.
			 *
			 * @public
			 * @param {Attribute} attribute
			 * @param {Boolean} multipleInstances
			 */
			Widget.prototype.addOutAttribute = function(attribute, multipleInstances) {
				this.log("will add or update attribute "+attribute+".");
				multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
				this._oldOutAttributes = this._outAttributes;
				attribute.setTimestamp(this.getCurrentTime());
				if (attribute instanceof Attribute) {
					this._outAttributes.put(attribute, multipleInstances);
				}
			};

			/**
			 * Sets the ConstantAttributeValueList and also the
			 * associated AttributeTypes.
			 *
			 * @protected
			 * @param {(AttributeList|Array)} constantAttributes List or Array of AttributeValues
			 */
			Widget.prototype._setConstantOutAttributes = function(constantAttributes) {
				this._constantOutAttributes = new AttributeList().withItems(constantAttributes);
			};

			/**
			 * Adds a new constantAttributeValue. If the given value is
			 * not included in the list, the associated type will
			 * be also added. Otherwise, only the value will be
			 * updated.
			 *
			 * @protected
			 * @param {Attribute} constantAttribute AttributeValue
			 */
			Widget.prototype._addConstantOutAttribute = function(constantAttribute) {
				if (constantAttribute instanceof Attribute) {
					if (!this._constantOutAttributes.containsTypeOf(constantAttribute)) {
						constantAttribute.setTimestamp(this.getCurrentTime());
						this._constantOutAttributes.put(constantAttribute);
					}
				}
			};

			/**
			 * Sets Callbacks.
			 *
			 * @protected
			 * @param {(CallbackList|Array)} callbacks List or Array of Callbacks.
			 */
			Widget.prototype._setCallbacks = function(callbacks) {
				var list = [];
				if (callbacks instanceof Array) {
					list = callbacks;
				} else if (callbacks instanceof CallbackList) {
					list = callbacks.getItems();
				}
				for ( var i in list) {
					var callback = list[i];
					if (callback instanceof Callback) {
						this.callbacks.put(callback);
					}
				}
			};

			/**
			 * Adds a new Callback.
			 *
			 * @protected
			 * @param {Callback} callback List or Array of AttributeValues.
			 */
			Widget.prototype._addCallback = function(callback) {
				if (callback instanceof Callback) {
					this._callbacks.put(callback);
				}
			};

			Widget.prototype._setServices = function(services) {
				this.services = services;
			};

			/**
			 * Sets SubscriberList.
			 *
			 * @protected
			 * @param {(SubscriberList|Array)}  subscribers List or Array of Subscriber.
			 */
			Widget.prototype._setSubscriber = function(subscribers) {
				var list = [];
				if (subscribers instanceof Array) {
					list = subscribers;
				} else if (subscribers instanceof SubscriberList) {
					list = subscribers.getItems();
				}
				for ( var i in list) {
					var singleSubscriber = list[i];
					if (singleSubscriber instanceof Subscriber) {
						this._subscribers.put(singleSubscriber);
					}
				}
			};

			/**
			 * Adds a new Subscriber.
			 *
			 * @public
			 * @param {?Subscriber} subscriber Subscriber
			 */
			Widget.prototype.addSubscriber = function(subscriber) {
				if (subscriber && subscriber instanceof Subscriber) {
					this._subscribers.put(subscriber);
					this._intervalRunning();
				}
			};

			/**
			 * Removes the specified Subscriber.
			 *
			 * @public
			 * @param {Subscriber} subscriberId Subscriber
			 */
			Widget.prototype.removeSubscriber = function(subscriberId) {
				this._subscribers.removeSubscriberWithId(subscriberId);
			};

			/**
			 * Returns the current time.
			 *
			 * @private
			 * @returns {Date}
			 */
			Widget.prototype.getCurrentTime = function() {
				return new Date();
			};

			/**
			 * Notifies other components and sends the attributes.
			 *
			 * @virtual
			 * @public
			 */
			Widget.prototype.notify = function() {
				this.log("will notify its subscribers.");
				var callbacks = this.getCallbacks();
				for (var i in callbacks) {
					this.sendToSubscriber(callbacks[i]);
				}
			};

			/**
			 * Queries the associated sensor and updates the attributes with new values.
			 * Must be overridden by the subclasses. Overriding subclasses can call
			 * this.__super(_function) to invoke the provided callback function.
			 *
			 * @virtual
			 * @public
			 * @param {Callback} callback
			 */
			Widget.prototype.sendToSubscriber = function(callback) {
				if (callback && callback instanceof Callback) {
					var subscriberList = this._subscribers.getItems();
					for ( var i in subscriberList) {
						var subscriber = subscriberList[i];
						if (subscriber.getSubscriptionCallbacks().contains(callback)) {
							if(this._dataValid(subscriber.getConditions())){
								var subscriberInstance = this._discoverer.getComponent(subscriber.getSubscriberId());
								var callSubset =  callback.getAttributeTypes();
								var subscriberSubset = subscriber.getAttributesSubset();
								var data = this._outAttributes.getSubset(callSubset);
								if (subscriberSubset && subscriberSubset.size() > 0) {
									data = data.getSubset(subscriberSubset);
								}
							}
							if (data) {
								this.log("will send to "+subscriberInstance.getName()+" ("+subscriberInstance.getId()+").");
								subscriberInstance.putData(data);
							}
						}
					}
				}
			};

			/**
			 *
			 * @abstract
			 * @param callback
			 */
			Widget.prototype.queryGenerator = function (callback) {
				throw "Call to abstract method 'queryGenerator'.";
			};

			/**
			 *
			 * @param response
			 * @param callback
			 * @protected
			 */
			Widget.prototype._sendResponse = function(response, callback) {
				this.putData(response);
				this.notify();

				if (callback && typeof(callback) == 'function') {
					callback();
				}
			};

			/**
			 * Updates the attributes by calling queryGenerator.
			 *
			 * @param {?function} callback For alternative  actions, because an asynchronous function can be used.
			 *
			 */
			Widget.prototype.updateWidgetInformation = function(callback) {
				this.log("will update my attributes.");

				this.queryGenerator(callback);
			};

			/**
			 * Updates the Attributes by external components.
			 *
			 * @param {(AttributeList|Array)} attributes Data that should be entered.
			 */
			Widget.prototype.putData = function(attributes) {
				var list = [];
				if (attributes instanceof Array) {
					list = attributes;
				} else if (attributes instanceof AttributeList) {
					list = attributes.getItems();
				}
				for ( var i in list) {
					var theAttribute = list[i];
					if (theAttribute instanceof Attribute && this._isOutAttribute(theAttribute)) {
						this.addOutAttribute(theAttribute);
					}
				}
			};

			/**
			 * Returns all available AttributeValues, Attributes and ConstantAttributes.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Widget.prototype.queryWidget = function() {
				var response = new AttributeList();
				response.putAll(this.getOutAttributes());
				response.putAll(this.getConstantOutAttributes());
				return response;
			};

			/**
			 * Updates and returns all available AttributeValues,
			 * Attributes and Constant Attributes.
			 *
			 * @param {?function} callback For alternative  actions, because an asynchronous function can be used.
			 * @returns {?AttributeList}
			 */
			Widget.prototype.updateAndQueryWidget = function(callback) {
				if(callback && typeof(callback) === 'function'){
					this.queryGenerator(callback);
				} else {
					this.queryGenerator();
					return this.queryWidget();
				}
			};

			/**
			 * Sends all Attributes, specified in the given callback,
			 * to components which are subscribed to this Callback.
			 *
			 * @protected
			 * @param {string} callback Name of the searched Callback.
			 */
			Widget.prototype._sendToSubscriber = function(callback) {
				if (callback && callback instanceof Callback) {
					var subscriberList = this._subscribers.getItems();
					for (var i in subscriberList) {
						var subscriber = subscriberList[i];
						if (subscriber.getSubscriptionCallbacks().contains(callback)) {
							if(this.dataValid(subscriber.getConditions())){
								var subscriberInstance = this._discoverer.getComponent(subscriber.getSubscriberId());
								var callSubset =  callback.getAttributeTypes();
								var subscriberSubset = subscriber.getAttributesSubset();
								var data = this.outAttributes.getSubset(callSubset);
								if (subscriberSubset && subscriberSubset.size() > 0) {
									data = data.getSubset(subscriberSubset);
								}
							}
							if (data) {
								subscriberInstance.putData(data);
							}
						}
					}
				}
			};

			/**
			 * Verifies if the attributes match to the specified conditions in case any exists.
			 *
			 * @param {string} conditions List of Conditions that will be verified.
			 * @returns {boolean}
			 */
			Widget.prototype._dataValid = function(conditions) {
				if (conditions instanceof ConditionList) {
					return true;
				}
				if (!conditions.isEmpty()) {
					var items = _condition.getItems();
					for (var i in items) {
						var condition = items[i];
						var conditionAttributeType = condition.getAttributeType();
						var conditionAttributeTypeList = new AttributeTypeList()
							.withItems(new Array(conditionAttributeType));
						var newValue = this.getAttributes().getSubset(conditionAttributeTypeList);
						var oldValue = this.getOldAttributes.getSubset(conditionAttributeTypeList);
						return condition.compare(newValue, oldValue);
					}
				}
				return false;
			};

			/**
			 * Runs the context acquisition constantly in an interval.
			 * Can be called by init.
			 *
			 * @private
			 */
			Widget.prototype._intervalRunning = function() {
				var self = this;
				if (typeof this.constructor.description.updateInterval !== "undefined" && !isNaN(this.constructor.description.updateInterval) && this._updateInterval === null) {
					this.log("will query its context generator every "+this.constructor.description.updateInterval+" milliseconds ("+(this.constructor.description.updateInterval/1000)+" seconds).");
					this._updateInterval = setInterval(function() {
						self.log("Interval Trigger -> queryGenerator");
						self.queryGenerator();
					}, this.constructor.description.updateInterval);
				}
			};

			/**
			 * Returns true if the widget can satisfy the requested attribute type.
			 *
			 * @public
			 * @param {Attribute} attribute
			 * @returns {boolean}
			 */
			Widget.prototype.doesSatisfyTypeOf = function(attribute) {
				return this._outAttributes.containsTypeOf(attribute);
			};

			/**
			 *
			 * @returns {boolean}
			 */
			Widget.prototype.available = function() {
				return this._checkRequiredObjects();
			};

			/**
			 *
			 * @returns {boolean}
			 * @private
			 */
			Widget.prototype._checkRequiredObjects = function() {
				if (this.constructor.description.requiredObjects && this.constructor.description.requiredObjects instanceof Array) {
					for (var index in this.constructor.description.requiredObjects) {
						var theRequiredObject = this.constructor.description.requiredObjects[index];
						if (typeof window[theRequiredObject] == "undefined") return false;
					}
				}
				return true;
			};

			return Widget;
		})();
	}
);