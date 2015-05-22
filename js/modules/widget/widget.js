/**
 * This module representing a Context Widget.
 * 
 * @module Widget
 */
define(['MathUuid', 'callback', 'callbackList', 'attribute', 'attributeList', 'conditionList', 'subscriber', 'subscriberList'],
	function(MathUuid, Callback, CallbackList, Attribute, AttributeList, ConditionList, Subscriber, SubscriberList) {
		return (function() {
			/**
			 * Constructor: Generates the ID and initializes the
			 * Widget with attributes, callbacks and subscriber
			 * that are specified in the provided functions.
			 *
			 * @abstract
			 * @classdesc The Widget handles the access to sensors.
			 * @constructs Widget
			 */
			function Widget(discoverer, attributes) {
				var self = this;

				/**
				 * Name of the Widget.
				 *
				 * @public
				 * @type {string}
				 */
				this.name = 'Widget';

				/**
				 * ID of the Widget. Will be generated.
				 *
				 * @type {string}
				 */
				this.id = Math.uuid();

				/**
				 *
				 * @protected
				 * @type {AttributeList}
				 * @memberof Widget#
				 * @desc All available Attributes and their values.
				 */
				this._outAttributes = new AttributeList();

				/**
				 * @alias oldAttributes
				 * @protected
				 * @type {AttributeList}
				 * @memberof Widget#
				 * @desc This temporary variable is used for storing the old attribute values.
				 * 			So these can be used to check conditions.
				 */
				this._oldOutAttributes = new AttributeList();

				/**
				 * @alias constantAttributes
				 * @protected
				 * @type {AttributeList}
				 * @memberof Widget#
				 * @desc All available constant Attributes and their values.
				 */
				this._constantOutAttributes = new AttributeList();

				/**
				 * @alias callbacks
				 * @protected
				 * @type {CallbackList}
				 * @memberof Widget#
				 * @desc List of Callbacks.
				 */
				this._callbacks = new CallbackList();

				/**
				 * @alias subscribers
				 * @protected
				 * @type {SubscriberList}
				 * @memberof Widget#
				 * @desc List of Subscriber.
				 */
				this._subscribers = new SubscriberList();

				/**
				 * Associated discoverer.
				 *
				 * @type {Discoverer}
				 * @private
				 */
				this._discoverer = discoverer;

				this._register();
				this._init(attributes);

				return this;
			}

			/**
			 * Returns the name of the widget.
			 *
			 * @public
			 * @alias getName
			 * @memberof Widget#
			 * @returns {string}
			 */
			Widget.prototype.getName = function() {
				return this.name;
			};

			/**
			 * Returns the id of the widget.
			 *
			 * @public
			 * @alias getId
			 * @memberof Widget#
			 * @returns {string}
			 */
			Widget.prototype.getId = function() {
				return this.id;
			};

			/**
			 * Returns the available AttributeTypes.
			 *
			 * @public
			 * @param {?AttributeList} [attributes]
			 * @returns {AttributeList}
			 */
			Widget.prototype.getOutAttributes = function(attributes) {
				// test if attributeList is a list
				if (attributes && attributes instanceof AttributeList) {
					return this._outAttributes.getSubset(attributes);
				} else {
					return this._outAttributes;
				}
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
			 * @param {AttributeType} attributeType The attribute type to return the last value for.
			 * @returns {*}
			 */
			Widget.prototype.getValueForAttributeWithTypeOf = function(attributeType) {
				return this.getOutAttributes().getAttributeWithTypeOf(attributeType).getValue();
			};

			/**
			 * Returns the old Attributes.
			 *
			 * @private
			 * @alias getOldAttributes
			 * @memberof Widget#
			 * @returns {AttributeList}
			 */
			Widget.prototype.getOldAttributes = function() {
				return this._oldOutAttributes;
			};

			/**
			 * Returns a list of callbacks that can be
			 * subscribed to.
			 *
			 * @public
			 * @alias getCallbacks
			 * @memberof Widget#
			 * @returns {CallbackList}
			 */
			Widget.prototype.getCallbackList = function() {
				return this._callbacks;
			};

			/**
			 * Returns the specified callbacks that can be
			 * subscribed to.
			 *
			 * @public
			 * @alias getCallbacks
			 * @memberof Widget#
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
			 * @public
			 * @alias getSubscriber
			 * @memberof Widget#
			 * @returns {SubscriberList}
			 */
			Widget.prototype.getSubscriber = function() {
				return this._subscribers;
			};

			/**
			 * Sets the name of the Widget.
			 *
			 * @protected
			 * @alias setName
			 * @memberof Widget#
			 * @param {string} name Name of the Widget.
			 */
			Widget.prototype.setName = function(name) {
				if (typeof name === 'string') {
					this.name = name;
				}
			};

			/**
			 * Sets the id of the Widget.
			 *
			 * @protected
			 * @alias setId
			 * @memberof Widget#
			 * @param {string} id Id of the Widget.
			 */
			Widget._setId = function(id) {
				if (typeof id === 'string') {
					this.id = id;
				}
			};

			/**
			 * Sets the AttributeValueList and also the associated
			 * AttributeTypes.
			 *
			 * @protected
			 * @param {(AttributeList|Array)} attributesOrArray List or Array of AttributeValues
			 */
			Widget.prototype._setOutAttributes = function(attributesOrArray) {
				this._outAttributes = new AttributeList().withItems(attributesOrArray);
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
				multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
				if (attribute instanceof Attribute) {
					if (!this._outAttributes.containsTypeOf(attribute)) {
						this._oldOutAttributes = this._outAttributes;
						attribute.setTimestamp(this.getCurrentTime());
						this._outAttributes.put(attribute, multipleInstances);
					}
				}
			};

			/**
			 * Sets the ConstantAttributeValueList and also the
			 * associated AttributeTypes.
			 *
			 * @protected
			 * @alias setConstantOutAttributes
			 * @memberof Widget#
			 * @param {(AttributeList|Array)} constantAttributes List or Array of AttributeValues
			 */
			Widget.prototype._setConstantOutAttributes = function(constantAttributes) {
				var list = [];
				if (constantAttributes instanceof Array) {
					list = constantAttributes;
				} else if (Class.isA(AttributeValueList, constantAttributes)) {
					list = constantAttributes.getItems();
				}
				for ( var i in list) {
					var constantAttribute = list[i];
					if (Class.isA(AttributeValue, constantAttribute)) {
						constantAttribute.setTimestamp(this.getCurrentTime());
						this.constantAttributes.put(constantAttribute);
						var type = new AttributeType().withName(constantAttribute.getName())
							.withType(constantAttribute.getType())
							.withParameters(constantAttribute.getParameters());
						this.constantAttributeTypes.put(type);
					}
				}
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
				if (Class.isA(AttributeValue, constantAttribute)) {
					if (!this.constantAttributes
							.contains(constantAttribute)) {

						var type = new AttributeType().withName(constantAttribute.getName())
							.withType(constantAttribute.getType())
							.withParameters(constantAttribute.getParameters());
						this.constantAttributeTypes.put(type);
					}
					_attribute.setTimestamp(this.getCurrentTime());
					this.constantAttributes.put(constantAttribute);
				}
			};

			/**
			 * Sets Callbacks.
			 *
			 * @protected
			 * @alias setCallbacks
			 * @memberof Widget#
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
			 * @alias addCallback
			 * @memberof Widget#
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
			 * @alias setSubscriber
			 * @memberof Widget#
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
			 * Verifies whether the specified attributes is a
			 * provided Attribute.
			 *
			 * @protected
			 * @alias isOutAttribute
			 * @memberof Widget#
			 * @param {Attribute} attribute
			 * @returns {boolean}
			 */
			Widget.prototype._isOutAttribute = function(attribute) {
				return !!this._outAttributes.containsTypeOf(attribute);
			};

			/**
			 * Initializes the provided Attributes.
			 *
			 * @abstract
			 * @protected
			 */
			Widget.prototype._initOutAttributes = function() {
				throw new Error("Call to abstract function '_initOutAttributes'!");
			};

			/**
			 * Initializes the provided ConstantAttributes.
			 *
			 * @abstract
			 * @protected
			 */
			Widget.prototype._initConstantOutAttributes = function() {
				throw new Error("Abstract function!");
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
			 * Function for initializing. Calls all initFunctions
			 * and will be called by the constructor.
			 *
			 * @protected
			 */
			Widget.prototype._init = function(attributes) {
				this._initOutAttributes();
				this._initConstantOutAttributes();
				this._initCallbacks();

				this.didFinishInitialization(attributes);
			};

			/**
			 * Method will be invoked after the initialization of the widget finished.
			 * Can be overridden by inheriting classes to take action after initialization.
			 *
			 * @public
			 * @virtual
			 * @param attributes
			 */
			Widget.prototype.didFinishInitialization = function(attributes) {

			};

			/**
			 * Notifies other components and sends the attributes.
			 *
			 * @virtual
			 * @public
			 */
			Widget.prototype.notify = function() {
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
			 * @param {?function} callback For alternative actions, because an asynchronous function can be used.
			 */
			Widget.prototype.sendToSubscriber = function(callback) {
				if (callback && typeof(callback) == 'function') {
					callback();
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
			 * @public
			 * @alias updateWidgetInformation
			 * @memberof Widget#
			 * @param {?function} callback For alternative  actions, because an asynchronous function can be used.
			 *
			 */
			Widget.prototype.updateWidgetInformation = function(callback) {
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
					if (theAttribute.type === Attribute && this.isOutAttribute(theAttribute)) {
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
			 * Attributes and ConstantAtrributes.
			 *
			 * @public
			 * @alias updateAndQueryWidget
			 * @memberof Widget#
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
			 * @private
			 * @alias dataValid
			 * @memberof Widget#
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
			 * @virtual
			 * @protected
			 * @param {Number} interval Interval in ms
			 */
			Widget.prototype._intervalRunning = function(interval) {
				var self = this;
				if (interval === parseInt(interval)) {
					setInterval(function() {self.queryGenerator();}, interval);
				}
			};

			/**
			 * Sets the associated Discoverer and registers to that.
			 *
			 * @public
			 * @param {Discoverer} _discoverer Discoverer
			 */
			Widget.prototype.setDiscoverer = function(_discoverer) {
				if (!this._discoverer) {
					this._discoverer = _discoverer;
					this._register();
				}
			};

			/**
			 * Registers the component to the associated Discoverer.
			 *
			 * @protected
			 */
			Widget.prototype._register = function() {
				if (this._discoverer) {
					this._discoverer.registerNewComponent(this);
				}
			};

			/**
			 * Returns true if the widget can satisfy the requested attribute type.
			 *
			 * @public
			 * @param {AttributeType} attribute
			 * @returns {boolean}
			 */
			Widget.prototype.doesSatisfyTypeOf = function(attribute) {
				return this._outAttributes.containsTypeOf(attribute);
			};

			return Widget;
		})();
	}
);