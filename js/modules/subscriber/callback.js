/**
 * This module represents a Callback.
 * Callbacks define events for sending data to subscribers
 * 
 * @module Subscriber
 */
define(['contextInformation', 'contextInformationList'], function(ContextInformation, ContextInformationList){
	return (function() {
		/**
		 * Constructor: Initializes the AttributeTypeList.
		 *
		 * @classdesc Callbacks defines events for sending data to subscribers. The data to be sent, are specified in the attributeTypeList.
		 * @returns {Callback}
		 * @constructs Callback
		 */
		function Callback() {
			/**
			 * Name of the Callback (i.e. Update).
			 * @type {string}
			 * @private
			 */
			this._name = '';

			/**
			 * Associated contextual information that will be send to the subscriber.
			 *
			 * @type {ContextInformationList}
			 * @private
			 */
			this._contextInformation = new ContextInformationList();

			return this;
		}

		/**
		 * Builder for name.
		 *
		 * @param {String} _name Name
		 * @returns {Callback}
		 */
		Callback.prototype.withName = function(_name) {
			this.setName(_name);
			return this;
		};

		/**
		 * Builder for AttributeTypes.
		 *
		 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray
		 * @returns {Callback}
		 */
		Callback.prototype.withContextInformation = function(contextInformationListOrArray) {
			this.setContextInformation(contextInformationListOrArray);
			return this;
		};

		/**
		 * Returns the name.
		 *
		 * @returns {string}
		 */
		Callback.prototype.getName = function() {
			return this._name;
		};

		/**
		 * Sets the name.
		 *
		 * @param {string} name Name
		 */
		Callback.prototype.setName = function(name) {
			if (typeof name === 'string') {
				this._name = name;
			}
		};

		/**
		 * Returns the associated contextual information.
		 *
		 * @returns {ContextInformationList}
		 */
		Callback.prototype.getContextInformation = function() {
			return this._contextInformation;
		};

		/**
		 * Adds a list of contextual information.
		 *
		 * @param {ContextInformationList|Array.<ContextInformation>} contextInformationListOrArray
		 */
		Callback.prototype.setContextInformation = function(contextInformationListOrArray){
			var list = [];
			if(contextInformationListOrArray instanceof Array){
				list = contextInformationListOrArray;
			} else if (contextInformationListOrArray instanceof ContextInformationList) {
				list = contextInformationListOrArray.getItems();
			}
			for(var i in list){
				this.addContextInformation(list[i]);
			}
		};

		/**
		 * Adds a contextual information to ContextInformationList.
		 *
		 * @param {ContextInformation} contextInformation
		 */
		Callback.prototype.addContextInformation = function(contextInformation){
			if(contextInformation instanceof ContextInformation && !this._contextInformation.containsKindOf(contextInformation)){
				this._contextInformation.put(contextInformation);
			}
		};

		/**
		 * Removes a contextual information from the ContextInformationList.
		 *
		 * @param {ContextInformation} contextInformation
		 */
		Callback.prototype.removeAttributeType = function(contextInformation){
			if(contextInformation instanceof ContextInformation){
				this._contextInformation.removeItem(contextInformation);
			}
		};

		/**
		 * Compares this instance with the given one.
		 *
		 * @param {Callback} _callback Callback that should be compared
		 * @returns {boolean}
		 */
		Callback.prototype.equals = function(_callback) {
			if (_callback.constructor === Callback){
				if(_callback.getName() == this.getName()
					&& _callback.getContextInformation().equals(this.getContextInformation())) {
					return true;
				}
			}
			return false;
		};

		return Callback;
	})();
});