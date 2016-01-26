/**
 * This module representing a Context Widget.
 * 
 * @module Widget
 */
define(['queryable', 'callback', 'callbackList', 'contextInformation', 'contextInformationList', 'conditionList', 'subscriber', 'subscriberList'],
	function(Queryable, Callback, CallbackList, ContextInformation, ContextInformationList, ConditionList, Subscriber, SubscriberList) {
		return (function() {

			/**
			 * Defines all output contextual information and constant output contextual information as an object.
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
			 * Widget with contextual information, callbacks and subscriber
			 * that are specified in the provided functions.
			 *
			 * @abstract
			 * @class Widget
			 * @extends Queryable
			 * @param {Discoverer} discoverer
			 */
			function Widget(discoverer) {
				Queryable.call(this, discoverer);

				/**
				 * Name of the widget.
				 *
				 * @type {string}
				 * @private
				 */
				this._name  = 'Widget';

				this._register();
				this._init();

				return this;
			}

			Widget.prototype = Object.create(Queryable.prototype);
			Widget.prototype.constructor = Widget;

			/**
			 * Function for initializing. Calls all initFunctions
			 * and will be called by the constructor.
			 *
			 * @protected
			 */
			Widget.prototype._init = function() {
				this._initOutputContextInformation();
				this._initConstantOutputContextInformation();
				this._initCallbacks();
			};

			/**
			 * Initializes the provided constant contextual information.
			 *
			 * @private
			 */
			Widget.prototype._initConstantOutputContextInformation = function() {
				this._constantOutputContextInformation = ContextInformationList.fromContextInformationDescriptions(this._discoverer, this.constructor.description.const);
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
			 * Returns the available constant contextual information.
			 * (contextual information that do not change).
			 *
			 * @param {?ContextInformationList} [contextInformationList]
			 * @returns {ContextInformationList}
			 */
			Widget.prototype.getConstantOutputContextInformation = function(contextInformationList) {
				if (typeof contextInformationList != "undefined" && contextInformationList instanceof ContextInformationList) {
					return this._constantOutputContextInformation.getSubset(contextInformationList);
				} else {
					return this._constantOutputContextInformation;
				}
			};

			/**
			 * Returns the last acquired contextual information value with the given contextual information's kind.
			 *
			 * @param {ContextInformation} contextInformation The contextual information to return the last value for.
			 * @returns {*}
			 */
			Widget.prototype.getLastValueForContextInformationOfKind = function(contextInformation) {
				return this.getOutContextInformation().getContextInformationOfKind(contextInformation).getValue();
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
			 * Sets the constant contextual information list.
			 *
			 * @protected
			 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray List or Array of contextual information.
			 */
			Widget.prototype._setConstantOutContextInformation = function(contextInformationListOrArray) {
				this._constantOutContextInformation = new ContextInformationList().withItems(contextInformationListOrArray);
			};

			/**
			 * Adds a new constant contextual information. If the given value is
			 * not included in the list, the associated type will
			 * be also added. Otherwise, only the value will be
			 * updated.
			 *
			 * @protected
			 * @param {ContextInformation} contextInformation
			 */
			Widget.prototype._addConstantOutputContextInformation = function(contextInformation) {
				if (contextInformation instanceof ContextInformation) {
					if (!this._constantOutputContextInformation.containsKindOf(contextInformation)) {
						contextInformation.setTimestamp(this.getCurrentTime());
						this._constantOutputContextInformation.put(contextInformation);
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
			 * @param {Callback} callback List or Array of contextual information.
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
			 * @param {(SubscriberList|Array.<Subscriber>)}  subscribers List or Array of Subscriber.
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
			 * Notifies other components and sends the contextual information.
			 *
			 * @public
			 */
			Widget.prototype.notify = function() {
				this.log("will notify its subscribers.");
				var callbacks = this.getCallbacks();
				for (var i in callbacks) {
					this._sendToSubscriber(callbacks[i]);
				}
			};

			/**
			 * Queries the associated sensor and updates the contextual information with new values.
			 * Must be overridden by the subclasses.
			 *
			 * @protected
			 * @param {Callback} callback
			 */
			Widget.prototype._sendToSubscriber = function(callback) {
				if (callback && callback instanceof Callback) {
					var subscriberList = this._subscribers.getItems();
					for (var i in subscriberList) {
						var subscriber = subscriberList[i];
						if (subscriber.getSubscriptionCallbacks().contains(callback)) {
							if(this._dataValid(subscriber.getConditions())){
								var subscriberInstance = this._discoverer.getComponent(subscriber.getSubscriberId());
								var callSubset =  callback.getContextInformation();
								var subscriberSubset = subscriber.getContextInformationSubset();
								var data = this.getOutputContextInformation().getSubset(callSubset);
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
			 * Updates the contextual information by calling queryGenerator.
			 *
			 * @param {?function} callback For alternative  actions, because an asynchronous function can be used.
			 *
			 */
			Widget.prototype.updateWidgetInformation = function(callback) {
				this.log("will update my contextual information.");

				this.queryGenerator(callback);
			};

			/**
			 * Returns all available contextual information value and constant contextual information.
			 *
			 * @public
			 * @returns {ContextInformationList}
			 */
			Widget.prototype.queryWidget = function() {
				var response = new ContextInformationList();
				response.putAll(this.getOutputContextInformation());
				response.putAll(this.getConstantOutputContextInformation());
				return response;
			};

			/**
			 * Updates and returns all available contextual information value and constant contextual information.
			 *
			 * @param {?function} callback For alternative  actions, because an asynchronous function can be used.
			 * @returns {?ContextInformationList}
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
			 * Verifies if the contextual information match to the specified conditions in case any exists.
			 *
			 * @param {ConditionList} conditionList List of Conditions that will be verified.
			 * @returns {boolean}
			 */
			Widget.prototype._dataValid = function(conditionList) {
				if (conditionList instanceof ConditionList) {
					return true;
				}
				if (!conditionList.isEmpty()) {
					var items = conditionList.getItems();
					for (var i in items) {
						var condition = items[i];
						var conditionContextInformation = condition.getContextInformation();
						var conditionContextInformationList = new ContextInformationList().withItems(new Array(conditionContextInformation));
						var newValue = this.getOutputContextInformation().getSubset(conditionContextInformationList);
						var oldValue = this.getOldOutputContextInformation.getSubset(conditionContextInformationList);
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
					self.queryGenerator();
				}
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