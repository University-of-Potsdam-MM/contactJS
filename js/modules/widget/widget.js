/**
 * This module representing a Context Widget.
 * 
 * @module Widget
 * @fileOverview
 */
define([ 'easejs', 'MathUuid', 'callback', 'callbackList', 'attributeType',
		 'attributeValue', 'attributeTypeList', 'attributeValueList', 'conditionList',
		 'subscriber', 'subscriberList', 'widgetDescription'],
	function(easejs, MathUuid, Callback, CallbackList, AttributeType,
			AttributeValue, AttributeTypeList, AttributeValueList, ConditionList,
			Subscriber, SubscriberList, WidgetDescription) {
		
		var AbstractClass = easejs.AbstractClass;
		var Class = easejs.Class;
		var Widget = AbstractClass('Widget',{
			/**
			 * @alias name
			 * @public
			 * @type {string}
			 * @memberof Widget#
			 * @desc Name of the Widget.
			*/
			'public name' : 'Widget',
			/**
			* @alias id
			* @public
			* @type {string}
			* @memberof Widget#
			* @desc ID of the Widget. Will be generated.
			*/
			'public id' : '',
			/**
			* @alias attributeTypes
			* @protected
			* @type {AttributeTypeList}
			* @memberof Widget#
			* @desc Types of all available attributes.
			*/
			'protected attributeTypes' : [],
			/**
			* @alias constantAttributeTypes
			* @protected
			* @type {AttributeTypeList}
			* @memberof Widget#
			* @desc Types of all available ConstantAttributes.
			*/
			'protected constantAttributeTypes' : [],

			/**
			 * @alias attributes
			 * @protected
			 * @type {AttributeValueList}
			 * @memberof Widget#
			 * @desc All available Attributes and their values.
			 */
			'protected attributes' : [],
			/**
			 * @alias oldAttributes
			 * @protected
			 * @type {AttributeValueList}
			 * @memberof Widget#
			 * @desc This temporary variable is used for storing the old attribute values. 
			 * 			So these can be used to check conditions.
			 */
			'protected oldAttributes' : [],
			/**
			 * @alias constantAttributes
			 * @protected
			 * @type {AttributeValueList}
			 * @memberof Widget#
			 * @desc All available constant Attributes and their values.
			 */
			'protected constantAttributes' : [],
			/**
			 * @alias callbacks
			 * @protected
			 * @type {CallbackList}
			 * @memberof Widget#
			 * @desc List of Callbacks.
			 */
			'protected callbacks' : [],
			/**
			 * @alias subscribers
			 * @protected
			 * @type {SubscriberList}
			 * @memberof Widget#
			 * @desc List of Subscriber.
			 */
			'protected subscribers' : [],

			/**
			 * @alias discoverer
			 * @protected
			 * @type {Discoverer}
			 * @memberof Widget#
			 * @desc Associated discoverer.
			 */
			'protected discoverer' : '',

			/**
			 * Constructor: Generates the ID and initializes the
			 * Widget with attributes, callbacks and subscriber
			 * that are specified in the provided functions.
			 * 
			 * @abstract
			 * @class Widget
			 * @classdesc The Widget handles the access to sensors.
			 * @requires easejs
			 * @requires MathUuid
			 * @requires Callback
			 * @requires CallbackList
			 * @requires AttributeType
			 * @requires AttributeValue
			 * @requires AttributeTypeList
			 * @requires AttributeValueList
			 * @requires ConditionList
			 * @requires Subscriber
			 * @requires SubscriberList
			 * @requires WidgetDescription
			 * @requires Discoverer
			 * @constructs Widget
			 */
			'virtual public __construct' : function(_discoverer) {
				this.id = Math.uuid();
                this.discoverer = _discoverer;
                this.register();
				this.attributeTypes = new AttributeTypeList();
				this.constantAttributeTypes = new AttributeTypeList();
				this.attributes = new AttributeValueList();
				this.constantAttributes = new AttributeValueList();
				this.subscribers = new SubscriberList();
				this.callbacks = new CallbackList();
				this.init();
			},

			/**
			 * Returns the name of the widget.
			 * 
			 * @public
			 * @alias getName
			 * @memberof Widget#
			 * @returns {string} 
			 */
			'public getName' : function() {
				return this.name;
			},

			/**
			 * Returns the id of the widget.
			 * 
			 * @public
			 * @alias getId
			 * @memberof Widget#
			 * @returns {string}
			 */
			'public getId' : function() {
				return this.id;
			},

			/**
			 * Returns the type of this class, in this case
			 * "Widget".
			 * 
			 * @virtual
			 * @public
			 * @alias getType
			 * @memberof Widget#
			 * @returns {string}
			 */
			'virtual public getType' : function() {
				return 'Widget';
			},

			/**
			 * Returns the available AttributeTypes.
			 * 
			 * @public
			 * @alias getAttributeTypes
			 * @memberof Widget#
			 * @returns {AttributeTypeList}
			 */
			'public getAttributeTypes' : function() {
				return this.attributeTypes;
			},

			/**
			 * Returns the available ConstantAttributeTypes
			 * (attributes that do not change).
			 * 
			 * @public
			 * @alias getWidgetConstantAttributeTypes
			 * @memberof Widget#
			 * @returns {AttributeTypeList}
			 */
			'public getWidgetConstantAttributeTypes' : function() {
				return this.constantAttributeTypes;
			},

			/**
			 * Returns the last acquired Attributes.
			 * 
			 * @public
			 * @alias getAttributes
			 * @memberof Widget#
			 * @returns {AttributeValueList}
			 */
			'public getAttributes' : function() {
				return this.attributes;
			},
			
			/**
			 * Returns the old Attributes.
			 * 
			 * @private
			 * @alias getOldAttributes
			 * @memberof Widget#
			 * @returns {AttributeValueList}
			 */
			'public getOldAttributes' : function() {
				return this.oldAttributes;
			},

			/**
			 * Returns the ConstantAttributes.
			 * 
			 * @public
			 * @alias getConstantAttributes
			 * @memberof Widget#
			 * @returns {AttributeValueList}
			 */
			'public getConstantAttributes' : function() {
				return this.constantAttributes;
			},

			/**
			 * Returns a list of callbacks that can be
			 * subscribed to.
			 * 
			 * @public
			 * @alias getCallbacks
			 * @memberof Widget#
			 * @returns {CallbackList}
			 */
			'public getCallbackList' : function() {
				return this.callbacks;
			},

            /**
             * Returns the specified callbacks that can be
             * subscribed to.
             *
             * @public
             * @alias getCallbacks
             * @memberof Widget#
             * @returns {Array}
             */
            'public getCallbacks' : function() {
                return this.callbacks.getItems();
            },

			'public queryServices' : function() {
				return this.services;
			},

			/**
			 * Returns the Subscriber.
			 * 
			 * @public
			 * @alias getSubscriber
			 * @memberof Widget#
			 * @returns {SubscriberList}
			 */
			'public getSubscriber' : function() {
				return this.subscribers;
			},

			/**
			 * Sets the name of the Widget.
			 * 
			 * @protected
			 * @alias setName
			 * @memberof Widget#
			 * @param {string}
			 *            _name Name of the Widget.
			 */
			'protected setName' : function(_name) {
				if (typeof _name === 'string') {
					this.name = _name;
				}
			},

			/**
			 * Sets the id of the Widget.
			 * 
			 * @protected
			 * @alias setId
			 * @memberof Widget#
			 * @param {string}
			 *            _id Id of the Widget.
			 */
			'protected setId' : function(_id) {
				if (typeof _id === 'string') {
					this.id = _id;
				}
			},

			/**
			 * Sets the AttributeValueList and also the associated
			 * AttributeTypes.
			 * 
			 * @protected
			 * @alias setAttributes
			 * @memberof Widget#
			 * @param {(AttributeValueList|Array)}
			 *            _attributes List or Array of
			 *            AttributeValues
			 */
			'protected setAttributes' : function(_attributes) {
				var list = new Array();
				if (_attributes instanceof Array) {
					list = _attributes;
				} else if (Class.isA(AttributeValueList,_attributes)) {
					list = _attributes.getItems();
				}
				this.oldAttributes = this.attributes;
				for ( var i in list) {
					var attribute = list[i];
					if (Class.isA(AttributeValue, attribute)) {
						attribute.setTimestamp(this.getCurrentTime());
						this.attributes.put(attribute);

						var type = new AttributeType().withName(attribute.getName())
													.withType(attribute.getType())
													.withParameters(attribute.getParameters());
						this.attributeTypes.put(type);
					}
				}
			},

			/**
			 * Adds a new AttributeValue. If the given value is
			 * not included in the list, the associated type will
			 * be also added. Otherwise, only the value will be
			 * updated.
			 * 
			 * @public
			 * @alias addAttribute
			 * @memberof Widget#
			 * @param {AttributeValue}
			 *            _attribute AttributeValue
			 */
			'public addAttribute' : function(_attribute) {
				if (Class.isA(AttributeValue, _attribute)) {
					if (!this.attributes.contains(_attribute)) {

						var type = new AttributeType().withName(_attribute.getName())
													.withType(_attribute.getType())
													.withParameters(_attribute.getParameters());
						this.attributeTypes.put(type);

					}
					this.oldAttributes = this.attributes;

					_attribute.setTimestamp(this.getCurrentTime());
					this.attributes.put(_attribute);
				}
			},

			/**
			 * Sets the ConstantAttributeValueList and also the
			 * associated AttributeTypes.
			 * 
			 * @protected
			 * @alias setConstantAttributes
			 * @memberof Widget#
			 * @param {(AttributeValueList|Array)}
			 *            _constantAttributes List or Array of
			 *            AttributeValues
			 */
			'protected setConstantAttributes' : function(_constantAttributes) {
				var list = new Array();
				if (_constantAttributes instanceof Array) {
					list = _constantAttributes;
				} else if (Class.isA(AttributeValueList,_constantAttributes)) {
					list = _constantAttributes.getItems();
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
			},

			/**
			 * Adds a new constantAttributeValue. If the given value is
			 * not included in the list, the associated type will
			 * be also added. Otherwise, only the value will be
			 * updated.
			 * 
			 * @protected
			 * @alias addConstantAttribute
			 * @memberof Widget#
			 * @param {AttributeValue}
			 *            _constantAttribute AttributeValue
			 */
			'protected addConstantAttribute' : function(_constantAttribute) {
				if (Class.isA(AttributeValue, _constantAttribute)) {
					if (!this.constantAttributes
							.contains(_constantAttribute)) {

						var type = new AttributeType().withName(_constantAttribute.getName())
													  .withType(_constantAttribute.getType())
													  .withParameters(_constantAttribute.getParameters());
						this.constantAttributeTypes.put(type);
					}
					_attribute.setTimestamp(this.getCurrentTime());
					this.constantAttributes.put(_constantAttribute);
				}

			},

			/**
			 * Sets Callbacks.
			 * 
			 * @protected
			 * @alias setCallbacks
			 * @memberof Widget#
			 * @param {(CallbackList|Array)} _callbacks List or Array of Callbacks.
			 */
			'protected setCallbacks' : function(_callbacks) {
				var list = new Array();
				if (_callbacks instanceof Array) {
					list = _subscriber;
				} else if (Class.isA(CallbackList, _callbacks)) {
					list = _callbacks.getItems();
				}
				for ( var i in list) {
					var callback = list[i];
					if (Class.isA(Callback, callback)) {
						this.callbacks.put(callback);
					}
				}
			},

			/**
			 * Adds a new Callback.
			 * 
			 * @protected
			 * @alias addCallback
			 * @memberof Widget#
			 * @param {Callback} _callback List or Array of AttributeValues.
			 */
			'protected addCallback' : function(_callback) {
				if (Class.isA(Callback, _callback)) {
					this.callbacks.put(_callback);
				};
			},

			'protected setServices' : function(_services) {
				this.services = _services;
			},

			/**
			 * Sets SubscriberList.
			 * 
			 * @protected
			 * @alias setSubscriber
			 * @memberof Widget#
			 * @param {(SubscriberList|Array)}  _subscriber List or Array of Subscriber.
			 */
			'protected setSubscriber' : function(_subscriber) {
				var list = new Array();
				if (_subscriber instanceof Array) {
					list = _subscriber;
				} else if (Class.isA(SubscriberList, _subscriber)) {
					list = _subscriber.getItems();
				}
				for ( var i in list) {				
					var singleSubscriber = list[i];
					if (Class.isA(Subscriber, singleSubscriber)) {
						this.subscribers.put(singleSubscriber);
					}
				}
			},

			/**
			 * Adds a new Subscriber.
			 * 
			 * @public
			 * @alias addSubscriber
			 * @memberof Widget#
			 * @param {Subscriber}  _subscriber Subscriber
			 */
			'public addSubscriber' : function(_subscriber) {
				if (Class.isA(Subscriber, _subscriber)) {
					this.subscribers.put(_subscriber);
				}
			},

			/**
			 * Removes the specified Subscriber.
			 * 
			 * @public
			 * @alias removeSubscriber
			 * @memberof Widget#
			 * @param {Subscriber} _subscriber Subscriber
			 */
			'public removeSubscriber' : function(_subscriberId) {
					this.subscribers.removeItem(_subscriberId);
			},

			/**
			 * Returns the current time.
			 * 
			 * @private
			 * @alias getCurrentTime
			 * @memberof Widget#
			 * @returns {Date}
			 */
			'private getCurrentTime' : function() {
				return new Date();
			},

			/**
			 * Verifies whether the specified attributes is a
			 * provided Attribute.
			 * 
			 * @protected
			 * @alias isAttribute
			 * @memberof Widget#
			 * @param {AttributeValue}
			 *            _attribute
			 * @returns {boolean}
			 */
			'protected isAttribute' : function(_attribute) {
				var type = new AttributeType().withName(_attribute.getName())
											  .withType(_attribute.getType())
											  .withParameters(_attribute.getParameters());
				if (this.attributeTypes.contains(type)) {
					return true;
				} else {
					return false;
				}
			},

			/**
			 * Initializes the provided Attributes.
			 * 
			 * @function
			 * @abstract
			 * @protected
			 * @alias initAttributes
			 * @memberof Widget#
			 */
			'abstract protected initAttributes' : [],
			
			/**
			 * Initializes the provided ConstantAttributes.
			 * 
			 * @function
			 * @abstract
			 * @protected
			 * @alias initConstantAttributes
			 * @memberof Widget#
			 */
			'abstract protected initConstantAttributes' : [],

			/**
			 * Initializes the provided Callbacks.
			 * 
			 * @function
			 * @abstract
			 * @protected
			 * @alias initCallbacks
			 * @memberof Widget#
			 */
			'abstract protected initCallbacks' : [],

			/**
			 * Function for initializing. Calls all initFunctions
			 * and will be called by the constructor.
			 * 
			 * @protected
			 * @alias init
			 * @memberof Widget#
			 */
			'protected init' : function() {
				this.initAttributes();
				this.initConstantAttributes();
				this.initCallbacks();

                this.didFinishInitialization();
			},

            'public virtual didFinishInitialization' : function() {

            },

			/**
			 * Notifies other components and sends the attributes.
			 * 
			 * @virtual
			 * @public
			 * @alias initCallbacks
			 * @memberof Widget#
			 */
			'virtual public notify' : function() {
                var callbacks = this.queryCallbacks().getItems();
                for (var i in callbacks) {
                    this.sendToSubscriber(callbacks[i]);
                }
			},

			/**
			 * Queries the associated sensor and updates the attributes with new values. 
			 * Must be overridden by the subclasses.
			 * 
			 * @virtual
			 * @public
			 * @alias queryGenerator
			 * @memberof Widget#
			 * @param {?function} _function For alternative actions, because an asynchronous function can be used.
			 */
			'virtual protected queryGenerator' : function(_function) {
			},

			/**
			 * Updates the attributes by calling queryGenerator.
			 * 
			 * @public
			 * @alias updateWidgetInformation
			 * @memberof Widget#
			 * @param {?function} _function For alternative  actions, because an asynchronous function can be used.
			 *
			 */
			'public updateWidgetInformation' : function(_function) {
				this.queryGenerator(_function);
			},

			/**
			 * Updates the Attributes by external components.
			 * 
			 * @virtual
			 * @public
			 * @alias putData
			 * @memberof Widget#
			 * @param {(AttributeValueList|Array)} _data Data that should be entered.
			 * 
			 */
			'virtual public putData' : function(_data) {
				var list = new Array();
				if (_data instanceof Array) {
					list = _data;
				} else if (Class.isA(AttributeValueList, _data)) {
					list = _data.getItems();
				}
				for ( var i in list) {
					var x = list[i];
					if (Class.isA(AttributeValue, x) && this.isAttribute(x)) {
						this.addAttribute(x);
					}
				}

			},

			/**
			 * Returns all available AttributeValues, Attributes and
			 * ConstantAtrributes.
			 * 
			 * @public
			 * @alias queryWidget
			 * @memberof Widget#
			 * @returns {AttributeValueList}
			 */
			'public queryWidget' : function() {
				var response = new AttributeValueList();
				response.putAll(this.getAttributes());
				response.putAll(this.getConstantAttributes());
				return response;
			},

			/**
			 * Updates and returns all available AttributeValues,
			 * Attributes and ConstantAtrributes.
			 * 
			 * @public
			 * @alias updateAndQueryWidget
			 * @memberof Widget#
			 * @param {?function} _function For alternative  actions, because an asynchronous function can be used.
			 * @returns {?AttributeValueList}
			 */
			'virtual public updateAndQueryWidget' : function(_function) {
				if(_function && typeof(_function) === 'function'){
					this.queryGenerator(_function);
				} else {
					this.queryGenerator();
					var response = new AttributeValueList();
					response.putAll(this.getAttributes());
					response.putAll(this.getConstantAttributes());
					return response;
				}
			},

			/**
			 * Sends all Attributes, specified in the given callback, 
			 * to components which are subscribed to this Callback.
			 * @protected
			 * @alias sendToSubscriber
			 * @memberof Widget#
			 * @param {string} _callbackName Name of the searched Callback.
			 */
			'protected sendToSubscriber' : function(_callback) {
				if (_callback && Class.isA(Callback, _callback)) {
					var subscriberList = this.subscribers.getItems();
					for ( var i in subscriberList) {
						var subscriber = subscriberList[i];
						if (subscriber.getSubscriptionCallbacks().containsKey( _callback.getName())) {
							if(this.dataValid(subscriber.getConditions())){
								var subscriberInstance = this.discoverer.getComponent(subscriber.getSubscriberId());
								var callSubset =  _callback.getAttributeTypes();
								var subscriberSubset = subscriber.getAttributesSubset();
								var data = this.attributes.getSubset(callSubset);
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
			},

			/**
			 * Verifies if the attributes match to the specified conditions in case any exists.
			 * 
			 * @private
			 * @alias dataValid
			 * @memberof Widget#
			 * @param {string} _conditions List of Conditions that will be verified.
			 * @returns {boolean}
			 */
			'private dataValid' : function(_conditions) {
				if (Class.isA(ConditionList, _conditions)) {
					return true;
				}
				if (!_conditions.isEmpty()) {
					var items = _condition.getItems();
					for ( var i in items) {
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
			},

			/**
			 * Returns the description of this component.
			 * @virtual
			 * @public
			 * @alias getDescription
			 * @memberof Widget#
			 * @returns {WidgetDescription} 
			 */
			'virtual public getDescription' : function() {
				var description = new WidgetDescription().withId(this.id).withName(this.name);
				description.addOutAttributeTypes(this.attributeTypes);
				description.addOutAttributeTypes(this.constantAttributeTypes);
                // TODO: getCallbackNames for CallbackList
                var widgetCallbacks = this.callbacks.getItems();
                for(var i in widgetCallbacks) {
                    description.addCallbackName(widgetCallbacks[i].getName());
                }
				return description;
			},

			/**
			 * Runs the context acquisition constantly in an interval.
			 * Can be called by init.
			 * 
			 * @virtual
			 * @protected
			 * @alias intervalRunning
			 * @memberof Widget#
			 * @param {integer} _interval Interval in ms
			 */
			'virtual protected intervalRunning' : function(_interval) {
				var self = this;
				if (_interval === parseInt(_interval)) {
					setInterval(function() {self.queryGenerator();}, _interval);
				}
			},

			/**
			 * Sets the associated Discoverer and registers to that.
			 * @public
			 * @alias setDiscoverer
			 * @memberof Widget#
			 * @param {Discoverer} _discoverer Discoverer
			 */
			'public setDiscoverer' : function(_discoverer) {
				if (!this.discoverer) {
					this.discoverer = _discoverer;
					this.register();
				}
			},

			/**
			 * Registers the component to the associated Discoverer.
			 * 
			 * @public
			 * @alias register
			 * @memberof Widget#
			 */
			'protected register' : function() {
				if (this.discoverer) {
					this.discoverer.registerNewComponent(this);
				}
			},
			
//			/**
//			 * Unregisters the component to the associated discoverer
//			 * and deletes the reference.
//			 * 
//			 * @public
//			 * @alias register
//			 * @memberof Widget#
//			 */
//			'protected unregister' : function() {
//				if (this.discoverer) {
//					this.discoverer.unregisterComponent(this.getId());
//					this.discoverer = null;
//				}
//			},

            'public getHandle' : function() {
                return this.getDescription().getHandle();
            }

		});

		return Widget;
});