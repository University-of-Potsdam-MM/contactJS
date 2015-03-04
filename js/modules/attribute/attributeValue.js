/**
 * This module represents an AttributeValue. AttributeValue extends
 * AttributeTypes and adds the associated value.
 * 
 * @module AttributeValue
 * @fileOverview
 */
define([ 'easejs', 'attributeType' ], function(easejs, AttributeType) {
	var Class = easejs.Class;

	/**
	 * @class AttributeValue
	 * @classdesc AttributeValue extends AttributeTypes and adds the associated
	 *            value.
	 * @requires easejs
	 * @requires AttributeType
	 */
	var AttributeValue = Class('AttributeValue').extend(
			AttributeType,
			{
				/**
				 * @alias value
				 * @protected
				 * @type {string}
				 * @memberof AttributeValue#
				 */
				'protected value' : '',
				/**
				 * @alias timestamp
				 * @protected
				 * @type {Date}
				 * @memberof AttributeValue#
				 * @desc Time when the value was set.
				 */
				'protected timestamp' : '',

				/**
				 * Builder for value.
				 * 
				 * @public
				 * @alias withValue
				 * @memberof AttributeValue#
				 * @param {String} _value value
				 * @returns {AttributeValue}
				 */
				'public withValue' : function(_value) {
					this.setValue(_value);
					this.setTimestamp(new Date());
					return this;
				},

				/**
				 * Builder for timestamp.
				 * 
				 * @public
				 * @alias withTimestamp
				 * @memberof AttributeValue#
				 * @param {Date} _timestamp timestamp
				 * @returns {AttributeValue}
				 */
				'public withTimestamp' : function(_timestamp) {
					this.setTimestamp(_timestamp);
					return this;
				},

				/**
				 * Sets the value.
				 * 
				 * @public
				 * @alias setValue
				 * @memberof AttributeValue#
				 * @param {string} _value value
				 */
				'public setValue' : function(_value) {
					this.value = _value;
				},

				/**
				 * Returns the value.
				 * 
				 * @public
				 * @alias getValue
				 * @memberof AttributeValue#
				 * @returns {string}
				 */
				'public getValue' : function() {
					return this.value;
				},

				/**
				 * Sets the timestamp.
				 * 
				 * @public
				 * @alias setTimestamp
				 * @memberof AttributeValue#
				 * @param {Date} _timestamp timestamp
				 */
				'public setTimestamp' : function(_time) {
					this.timestamp = _time;
				},

				/**
				 * Returns the timestamp.
				 * 
				 * @public
				 * @alias getTimestamp
				 * @memberof AttributeValue#
				 * @returns {string}
				 */
				'public getTimestamp' : function() {
					return this.timestamp;
				},

				/**
				 * Compares this instance with the given one.
				 * 
				 * @public
				 * @alias equals
				 * @memberof AttributeValue#
				 * @param {AttributeValue} _attributeValue AttributeValue that should be compared
				 * @returns {boolean}
				 */
				'override public equals' : function(_attributeValue) {
					if (Class.isA(AttributeValue, _attributeValue)) {
						if (this.__super(_attributeValue.getAttributeType())
								&& _attributeValue.getValue() == this
										.getValue()) {
							return true;
						};
					};
					return false;
				},

				/**
				 * Returns the AttributeType of an AttributeValue.
				 * 
				 * @public
				 * @alias getAttributeType
				 * @memberof AttributeValue#
				 * @returns {AttributeType}
				 */
				'public getAttributeType' : function() {
					var type = new AttributeType().withName(this.name)
							.withType(this.type).withParameters(
									this.parameterList);
					return type;
				},
				
				/**
				 * Builds a new AttributeValue from the given type.
				 * 
				 * @public
				 * @alias buildFromAttributeType
				 * @memberof AttributeValue#
				 * @param {AttributeType} _attributeType AttributeType for build process.
				 * @returns {AttributeValue}			 
				 */
				'public buildFromAttributeType' : function(_attributeType) {
					if (Class.isA(AttributeType, _attributeType)) {
						var attValue = new AttributeValue().withName(_attributeType.getName())
									.withType(_attributeType.getType()).withParameter(_attributeType.getParameters()).withValue('undefined');
					
						return attValue;
					};
					return null;
				},

			});

	return AttributeValue;
});