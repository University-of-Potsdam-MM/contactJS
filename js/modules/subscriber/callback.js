/**
 * This module represents a Callback.
 * Callbacks define events for sending data to subscribers
 * 
 * @module Subscriber
 */
define(['attribute', 'attributeList'], function(Attribute, AttributeList){
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
			 * Associated Attributes that will be send to Subscriber.
			 *
			 * @type {AttributeList}
			 * @private
			 */
			this._attributes = new AttributeList();

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
		 * @param {(AttributeList|Array)} attributeListOrArray attributeTypes
		 * @returns {Callback}
		 */
		Callback.prototype.withAttributeTypes = function(attributeListOrArray) {
			this.setAttributeTypes(attributeListOrArray);
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
		 * Returns the associated attributes (only the types).
		 *
		 * @returns {AttributeList}
		 */
		Callback.prototype.getAttributeTypes = function() {
			return this._attributes;
		};

		/**
		 * Adds a list of AttributeTypes.
		 *
		 * @param {AttributeList|Array} _attributes AttributeTypeList
		 */
		Callback.prototype.setAttributeTypes = function(_attributes){
			var list = [];
			if(_attributes instanceof Array){
				list = _attributes;
			} else if (_attributes.constructor === AttributeList) {
				list = _attributes.getItems();
			}
			for(var i in list){
				this.addAttributeType(list[i]);
			}
		};

		/**
		 * Adds an attribute to AttributeTypeList.
		 *
		 * @param {Attribute} attribute Attribute
		 */
		Callback.prototype.addAttributeType = function(attribute){
			if(attribute.constructor === Attribute && !this._attributes.containsTypeOf(attribute)){
				this._attributes.put(attribute);
			}
		};

		/**
		 * Removes an attribute from AttributeTypeList.
		 *
		 * @param {Attribute} attribute AttributeType
		 */
		Callback.prototype.removeAttributeType = function(attribute){
			if(attribute.constructor === Attribute){
				this._attributes.removeItem(attribute);
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
					&& _callback.getAttributeTypes().equals(this.getAttributeTypes())) {
					return true;
				}
			}
			return false;
		};

		return Callback;
	})();
});