/**
 * This module represents a Condition. 
 * Condition specifies subscriptions. 
 * The associated attributes are only sent, if the condition applies. 
 * 
 * @module Condition
 * @fileOverview
 */
define(['easejs','attribute', 'conditionMethod'],
 	function(easejs, Attribute, ConditionMethod){
 	var Class = easejs.Class;
 	/**
	 * @class Condition
	 * @classdesc Condition for subscribed Attributes.
	 * @requires easejs
	 * @requires AttributeType
	 * @requires AttributeValue
	 * @rewuires ConditionMethod
	 */
	var Condition = Class('Condition',
	{

		/**
		 * @alias name
		 * @private
		 * @type {string}
		 * @memberof Condition#
		 * @desc Name of the Condition.
		 */
		'private name' :'',
		/**
		 * @alias attributeType
		 * @private
		 * @type {AttributeType}
		 * @memberof Condition#
		 * @desc AttributeType that should be checked.
		 */
		'private attributeType' : '', 
		/**
		 * @alias comparisonMethod
		 * @private
		 * @type {ConditionMethod}
		 * @memberof Condition#
		 * @desc Method for comparison.
		 */
		'private comparisonMethod' : '',
		/**
		 * @alias referenceValue
		 * @private
		 * @type {*}
		 * @memberof Condition#
		 * @desc Comparison value.
		 */
		'private referenceValue' : '',

		/**
		 * Builder for name.
		 * 
		 * @public
		 * @alias withName
		 * @memberof Condition#
		 * @param {String} _name Name
		 * @returns {Condition}
		 */
		'public withName' : function(_name){
			this.setName(_name);
			return this;
		},
		/**
		 * Builder for AttributeType.
		 * 
		 * @public
		 * @alias withAttributeType
		 * @memberof Condition#
		 * @param {AttributeType} _attributeType Attributes that would be verified.
		 * @returns {Condition}
		 */
		'public withAttributeType' : function(_attributeType){
			this.setAttributeType(_attributeType);
			return this;
		},
		/**
		 * Builder for comparison method.
		 * 
		 * @public
		 * @alias withComparisonMethod
		 * @memberof Condition#
		 * @param {ConditionMethod} _comparisonMethod method for comparison
		 * @returns {Condition}
		 */
		'public withComparisonMethod' : function(_comparisonMethod){
			this.setComparisonMethod(_comparisonMethod);
			return this;
		},
		/**
		 * Builder for comparison value.
		 * 
		 * @public
		 * @alias withReferenceValue
		 * @memberof Condition#
		 * @param {String} _referenceValue comparisonValue
		 * @returns {Condition}
		 */
		'public withReferenceValue' : function(_referenceValue){
			this.setReferenceValue(_referenceValue);
			return this;
		},

		/**
		 * Sets the name.
		 * 
		 * @public
		 * @alias setName
		 * @memberof Condition#
		 * @param {string} _name Name
		 */
		'public setName' : function(_name){
			if(typeof _name === 'string'){
				this.name = _name;
			}
		},
		
		/**
		 * Sets the attributeType.
		 * 
		 * @public
		 * @alias setAttributeType
		 * @memberof Condition#
		 * @param {Attribute} _attribute AttributeType
		 */
		'public setAttributeType' : function(_attribute){
			if(Class.isA(Attribute, _attribute)){
				this.attributeType = _attribute;
			}
		},

		/**
		 * Sets the ComparisonMethod.
		 * 
		 * @public
		 * @alias setComparisonMethod
		 * @memberof Condition#
		 * @param {ConditionMethod} _comparisonMethod comparison Method
		 */
		'public setComparisonMethod' : function(_comparisonMethod){
			if(Class.isA(ConditionMethod,_comparisonMethod)){
				this.comparisonMethod = _comparisonMethod;
			}
		},

		/**
		 * Sets the referenceValue.
		 * 
		 * @public
		 * @alias setReferenceValue
		 * @memberof Condition#
		 * @param {*} _referenceValue comparison value
		 */
		'public setReferenceValue' : function(_referenceValue){
			this.referenceValue = _referenceValue;
		},
		
		/**
		 * Returns the name.
		 * 
		 * @public
		 * @alias getName
		 * @memberof Condition#
		 * @returns {string}
		 */
		'public getName' : function(){
			return this.name;
		},
		
		/**
		 * Returns the AttributeType.
		 * 
		 * @public
		 * @alias getAttributeType
		 * @memberof Condition#
		 * @returns {AttributeType}
		 */
		'public getAttributeType' : function(){
			return this.attributeType;
		},
		
		/**
		 * Returns the comparison method.
		 * 
		 * @public
		 * @alias getComparisonMethod
		 * @memberof Condition#
		 * @returns {ConditionMethod}
		 */
		'public getComparisonMethod' : function(){
			return this.comparisonMethod;
		},
		
		/**
		 * Returns the comparison value.
		 * 
		 * @public
		 * @alias getReferenceValue
		 * @memberof Condition#
		 * @returns {*}
		 */
		'public getReferenceValue' : function(){
			return this.referenceValue;
		},
		
		/**
		 * Processes the comparison.
		 * 
		 * @public
		 * @alias compare
		 * @memberof Condition#
		 * @param {Attribute} _newAttributeValue new Attribute that should be compared
		 * @param {Attribute} _oldAttributeValue old Attribute
		 * @returns {boolean}
		 */
		'public compare' : function(_newAttributeValue, _oldAttributeValue){
			if(!this.attributeType.equalsTypeOf(_newAttributeValue)&& !this.attributeType.equalsTypeOf(_oldAttributeValue)){
				return false;
			}
			if(!this.comparisonMethod){
				return false;
			}
			if(Class.isA(Attribute, _newAttributeValue) && Class.isA(Attribute, _oldAttributeValue)){
				return this.comparisonMethod.process(this.referenceValue, _newAttributeValue.getValue(), _oldAttributeValue.getValue());
			}
			return false;
		},
		
		/**
		 * Compares this instance with the given one.
		 * 
		 * @public
		 * @alias equals
		 * @memberof Condition#
		 * @param {Condition} _condition Condition that should be compared
		 * @returns {boolean}
		 */
		'public equals' : function(_condition) {				
			if(Class.isA(Condition, _condition)){
				if(_condition.getName() == this.getName()
						&& _condition.getReferenceValue() == this.getReferenceValue()
						&& _condition.getAttributeType().equalsTypeOf(this.attributeType)
						&& _condition.getComparisonMethod() === this.comparisonMethod){
					return true;
				};
			};
			return false;

		},
		

		});

	return Condition;
});