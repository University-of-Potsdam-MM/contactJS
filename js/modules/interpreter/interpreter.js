/**
 * This module represents an Context Interpreter.
 * 
 * @module Interpreter
 * @fileOverview
 */
define([ 'easejs', 'MathUuid', 'attribute', 'attributeList',
		'interpreterDescription', 'interpreterResult' ],
		function(easejs, MathUuid, Attribute, AttributeList,
				InterpreterDescription, InterpreterResult) {
			var Class = easejs.Class;
			var AbstractClass = easejs.AbstractClass;
			var Interpreter = AbstractClass('Interpreter',
			{
				/**
				 * @alias name
				 * @public
				 * @type {string}
				 * @memberof Interpreter#
				 * @desc Name of the Interpreter.
				 */
				'public name' : 'Interpreter',
				/**
				 * @alias id
				 * @public
				 * @type {string}
				 * @memberof Interpreter#
				 * @desc Id of the Interpreter. Will be generated.
				 */
				'public id' : '',
				/**
				 * @alias inAttributeTypes
				 * @protected
				 * @type {AttributeList}
				 * @memberof Interpreter#
				 * @desc Types of all attributes that can be handled.
				 */
				'protected inAttributeTypes' : [],
				/**
				 * @alias outAttributeTypes
				 * @protected
				 * @type {AttributeList}
				 * @memberof Interpreter#
				 * @desc Types of all attributes that will be returned.
				 */
				'protected outAttributeTypes' : [],
				/**
				 * @alias inAttributeValues
				 * @protected
				 * @type {AttributeList}
				 * @memberof Interpreter#
				 * @desc List of the data that should be interpreted.
				 */
				'protected inAttributeValues' : [],
				/**
				 * @alias outAttributeValues
				 * @protected
				 * @type {AttributeList}
				 * @memberof Interpreter#
				 * @desc List of interpreted data.
				 */
				'protected outAttributeValues' : [],
				/**
				 * @alias lastInterpretation
				 * @protected
				 * @type {Date}
				 * @memberof Interpreter#
				 * @desc Last interpretation time.
				 */
				'protected lastInterpretation' : '',
				/**
				 * @alias discoverer
				 * @protected
				 * @type {Discoverer}
				 * @memberof Interpreter#
				 * @desc Associated Discoverer.
				 */
				'protected discoverer' : '',

				/**
				 * Constructor: Generates the id and initializes the (in and out) types and values.
				 * 
				 * @abstract
				 * @class Interpreter
				 * @classdesc The Widget handles the access to sensors.
				 * @requires easejs
				 * @requires MathUuid
				 * @requires Attribute
				 * @requires AttributeList
				 * @requires InterpreterDescription
				 * @constructs Interpreter
				 */
				'public __construct' : function(_discoverer) {
					this.id = Math.uuid();
                    this.discoverer = _discoverer;
                    this.register();
					this.inAttributeTypes = new AttributeList();
					this.outAttributeTypes = new AttributeList();
					this.inAttributeValues = new AttributeList();
					this.outAttributeValues = new AttributeList();
					this.initInterpreter();
				},
				
				/**
				 * Returns the name of the interpreter.
				 * 
				 * @public
				 * @alias getName
				 * @memberof Interpreter#
				 * @returns {string}
				 */
				'public getName' : function() {
					return this.name;
				},

				/**
				 * Returns the id of the interpreter.
				 * 
				 * @public
				 * @alias getId
				 * @memberof Interpreter#
				 * @returns {string}
				 */
				'public getId' : function() {
					return this.id;
				},
				
				/**
				 * Returns the type of this class, in this case
				 * "Interpreter".
				 * 
				 * @public
				 * @alias getType
				 * @memberof Interpreter#
				 * @returns {string}
				 */
				'public getType' : function() {
					return 'Interpreter';
				},

				/**
				 * Initializes interpreter and sets the expected inAttributes
				 * and provided outAttributes.
				 * @private
				 * @alias initInterpreter
				 * @memberof Interpreter#
				 */
				'private initInterpreter' : function() {
					this.initInAttributes();
					this.initOutAttributes();
				},

				/**
				 * Initializes the inAttributes.
				 * 
				 * @function
				 * @abstract
				 * @protected
				 * @alias initInAttributes
				 * @memberof Interpreter#
				 */
				'abstract protected initInAttributes' : [],
				/**
				 * Initializes the outAttributes.
				 * 
				 * @function
				 * @abstract
				 * @protected
				 * @alias initOutAttributes
				 * @memberof Interpreter#
				 */
				'abstract protected initOutAttributes' : [],

				/**
				 * Returns the expected inAttributeTypes.
				 * 
				 * @public
				 * @alias getInAttributeTypes
				 * @memberof Interpreter#
				 * @returns {AttributeTypeList} 
				 */
				'public getInAttributeTypes' : function() {
					return this.inAttributeTypes;
				},

				/**
				 * Sets an inAttribute.
				 * 
				 * @protected
				 * @alias setInAttribute
				 * @memberof Interpreter#
				 * @param {string} _name name of the attribute
				 * @param {string} _type type of the attribute
				 * @param {string} _value value of the attribute
				 * @param {ParameterList|Array} _parameter Parameter of the attribute.
				 */
				'protected setInAttribute' : function(_name, _type, _value,	_parameters) {
					var attributeValue = new Attribute().withName(_name)
							.withValue(_value).withType(_type).withParameters(_parameters);
					if (this.isInAttribute(attributeValue)) {
						this.inAttributeValues.put(attributeValue);
					}
				},

				/**
				 * Sets an inAttributes.
				 * 
				 * @protected
				 * @alias setInAttributeValues
				 * @memberof Interpreter#
				 * @param {(AttributeList|Array)} _attributeList Attributes to set.
				 */
				'protected setInAttributeValues' : function(_attributeList) {
					this.inAttributeValues = new AttributeList().withItems(_attributeList);
				},
				/**
				 * Verifies whether the specified attribute is contained in inAttributeList.
				 * 
				 * @protected
				 * @alias isInAttribute
				 * @memberof Interpreter#
				 * @param {AttributeValue} _attribute Attribute that should be verified.
				 * @return {boolean}
				 */
				'protected isInAttribute' : function(_attribute) {
					return !!this.inAttributeTypes.containsTypeOf(_attribute);
				},

				/**
				 * Returns the provided outAttributeTypes.
				 * 
				 * @public
				 * @alias getOutAttributeTypes
				 * @memberof Interpreter#
				 * @returns {AttributeTypeList} 
				 */
				'public getOutAttributeTypes' : function() {
					return this.outAttributeTypes;
				},

				/**
				 * Adds an outAttribute.
				 * 
				 * @protected
				 * @alias setOutAttribute
				 * @memberof Interpreter#
				 * @param {string} _name name of the attribute
				 * @param {string} _type type of the attribute
				 * @param {string} _value value of the attribute
				 * @param {ParameterList|Array} _parameters Parameter of the attribute.
				 */
				'protected setOutAttribute' : function(_name, _type, _value,_parameters) {
					var attributeValue = new AttributeValue().withName(_name)
							.withValue(_value).withType(_type).withParameters(_parameters);
					if (this.isOutAttribute(attributeValue)) {
						this.outAttributeValues.put(attributeValue);
					}
				},

				/**
				 * Verifies whether the specified attribute is contained in outAttributeList.
				 * 
				 * @protected
				 * @alias isOutAttribute
				 * @memberof Interpreter#
				 * @param {AttributeValue} _attribute Attribute that should be verified.
				 * @return {boolean}
				 */
				'protected isOutAttribute' : function(_attribute) {
					return !!this.outAttributeTypes.containsTypeOf(_attribute);
				},

				/**
				 * Validates the data and calls interpretData.
				 * 
				 * @public
				 * @alias callInterpreter
				 * @memberof Interpreter#
				 * @param {AttributeList} _inAttributeValues Data that should be interpreted.
				 * @param {AttributeList} _outAttributeValues
				 * @param {?function} _function For additional actions, if an asynchronous function is used.
				 */
				'public callInterpreter' : function(_inAttributeValues, _outAttributeValues, _function) {
					var self = this;

					if (!_inAttributeValues || !this.canHandleInAttributes(_inAttributeValues)) throw "Empty input attribute list or unhandled input attribute.";
					if (!_outAttributeValues || !this.canHandleOutAttributes(_outAttributeValues)) throw "Empty output attribute list or unhandled output attribute.";

					this.interpretData(_inAttributeValues, _outAttributeValues, function(interpretedData) {
						var response = new AttributeList().withItems(interpretedData);

						if (!self.canHandleOutAttributes(response)) throw "Unhandled output attribute generated.";

						self.setInAttributeValues(_inAttributeValues);
						self.lastInterpretation = new Date();

						if (_function && typeof(_function) == 'function'){
							_function(response);
						}
					});
				},

				/**
				 * Interprets the data.
				 * 
				 * @function
				 * @abstract
				 * @public
				 * @alias interpretData
				 * @memberof Interpreter#
				 * @param {AttributeList} _data Data that should be interpreted.
				 * @param {?function} _function For additional actions, if an asynchronous function is used.
				 */
				'abstract protected interpretData' : ['_inAttributes', '_outAttributes', '_callback'],

				/**
				 * Checks whether the specified data match the expected.
				 * 
				 * @protected
				 * @alias canHandleInAttributes
				 * @memberof Interpreter#
				 * @param {AttributeList|Array.<Attribute>} _inAttributes Data that should be verified.
				 */
				'protected canHandleInAttributes' : function(_inAttributes) {
					var list = [];
					if (_inAttributes instanceof Array) {
						list = _inAttributes;
					} else if (Class.isA(AttributeList, _inAttributes)) {
						list = _inAttributes.getItems();
					}
					if (list.length == 0 || _inAttributes.size() != this.getInAttributeTypes().size()) {
						return false;
					}
					for ( var i in list) {
						var inAtt = list[i];
						if (!this.isInAttribute(inAtt)) {
							return false;
						}
					}
					return true;
				},

				/**
				 * Checks whether the specified data match the expected.
				 *
				 * @protected
				 * @alias canHandleOutAttributes
				 * @memberof Interpreter#
				 * @param {AttributeList|Array.<Attribute>} _outAttributes Data that should be verified.
				 */
				'protected canHandleOutAttributes' : function(_outAttributes) {
					var list = [];
					if (_outAttributes instanceof Array) {
						list = _outAttributes;
					} else if (Class.isA(AttributeList, _outAttributes)) {
						list = _outAttributes.getItems();
					}
					if (list.length == 0 || _outAttributes.size() != this.getOutAttributeTypes().size()) {
						return false;
					}
					for ( var i in list) {
						var inAtt = list[i];
						if (!this.isOutAttribute(inAtt)) {
							return false;
						}
					}
					return true;
				},

				/**
				 * Returns the time of the last interpretation.
				 * 
				 * @protected
				 * @alias getLastInterpretionTime
				 * @memberof Interpreter#
				 * @returns {Date} 
				 */
				'public getLastInterpretionTime' : function() {
					return this.lastInterpretation;
				},

				/**
				 * Returns the description of this component.
				 * @virtual
				 * @public
				 * @alias getInterpreterDescription
				 * @memberof Interpreter#
				 * @returns {InterpreterDescription} 
				 */
				'virtual public getDescription' : function() {
					var description = new InterpreterDescription().withId(
							this.id).withName(this.name);
					description.addOutAttributeTypes(this.outAttributeTypes);
					description.setInAttributeTypes(this.inAttributeTypes);
					return description;
				},

				/**
				 * Sets and registers to the associated Discoverer.
				 * @public
				 * @alias setDiscoverer
				 * @memberof Interpreter#
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
				 * @memberof Interpreter#
				 */
				'protected register' : function() {
					if (this.discoverer) {
						this.discoverer.registerNewComponent(this);
					}

				},

				/**
				 *
				 * @returns {boolean}
				 */
				'public hasOutAttributesWithInputParameters': function() {
					return this.outAttributeTypes.hasAttributesWithInputParameters();
				},

				'public getOutAttributesWithInputParameters': function() {
					return this.outAttributeTypes.getAttributesWithInputParameters();
				}
				
//				/**
//				 * Unregisters the component to the associated discoverer
//				 * and deletes the reference.
//				 * 
//				 * @public
//				 * @alias register
//				 * @memberof Widget#
//				 */
//				'protected unregister' : function() {
//					if (this.discoverer) {
//						this.discoverer.unregisterComponent(this.getId());
//						this.discoverer = null;
//					}
//				},

			});

			return Interpreter;
		});