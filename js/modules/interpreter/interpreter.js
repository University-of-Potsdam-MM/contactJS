define(['MathUuid', 'attribute', 'attributeList', 'interpreterResult' ],
	function(MathUuid, Attribute, AttributeList, InterpreterResult) {
		return (function() {

			/**
			 * Defines all in and outAttributes as an object.
			 * @type {object}
			 * @public
			 */
			Interpreter.inOut = {
				in: [
					{
						'name':'',
						'type':'',
						'parameterList': []
					}
				],
				out: [
					{
						'name':'',
						'type':'',
						'parameterList': []
					}
				]
			};

			/**
			 * Generates the id and initializes the (in and out) types and values.
			 *
			 * @abstract
			 * @classdesc The Widget handles the access to sensors.
			 * @constructs Interpreter
			 */
			function Interpreter(discoverer) {
				/**
				 * Name of the Interpreter.
				 *
				 * @public
				 * @type {string}
				 */
				this.name = 'Interpreter';

				/**
				 * Id of the Interpreter. Will be generated.
				 *
				 * @public
				 * @type {string}
				 */
				this.id = Math.uuid();

				/**
				 * Types of all attributes that can be handled.
				 *
				 * @private
				 * @type {AttributeList}
				 */
				this._inAttributes = new AttributeList();

				/**
				 * Types of all attributes that will be returned.
				 *
				 * @private
				 * @type {AttributeList}
				 */
				this._outAttributes = new AttributeList();

				/**
				 * Last interpretation time.
				 *
				 * @protected
				 * @type {?Date}
				 */
				this._lastInterpretation = null;

				/**
				 * @alias discoverer
				 * @protected
				 * @type {Discoverer}
				 * @memberof Interpreter#
				 * @desc Associated Discoverer.
				 */
				this._discoverer = discoverer;

				this._register();
				this._initInterpreter();

				return this;
			}

			/**
			 * Returns the name of the interpreter.
			 *
			 * @public
			 * @returns {string}
			 */
			Interpreter.prototype.getName = function() {
				return this.name;
			};

			/**
			 * Returns the id of the interpreter.
			 *
			 * @public
			 * @returns {string}
			 */
			Interpreter.prototype.getId = function() {
				return this.id;
			};

			/**
			 * Initializes interpreter and sets the expected inAttributes and provided outAttributes.
			 *
			 * @private
			 */
			Interpreter.prototype._initInterpreter = function() {
				this._initInAttributes();
				this._initOutAttributes();
			};

			/**
			 * Initializes the inAttributes.
			 *
			 * @private
			 */
			Interpreter.prototype._initInAttributes = function() {
				for(var inAttributeIndex in this.constructor.inOut.in) {
					var inA = this.constructor.inOut.in[inAttributeIndex];
					this._inAttributes.put(this._discoverer.buildAttribute(
						inA.name,
						inA.type,
						inA.parameterList,
						true
					));
				}
			};

			/**
			 * Initializes the outAttributes.
			 *
			 * @private
			 */
			Interpreter.prototype._initOutAttributes = function() {
				for(var outAttributeIndex in this.constructor.inOut.out) {
					var out = this.constructor.inOut.out[outAttributeIndex];
					this._outAttributes.put(this._discoverer.buildAttribute(
						out.name,
						out.type,
						out.parameterList,
						true
					));
				}

			};

			/**
			 * Returns the expected inAttributeTypes.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Interpreter.prototype.getInAttributes = function() {
				return this._inAttributes;
			};

			/**
			 * Sets an inAttribute.
			 *
			 * @protected
			 * @param {Attribute} attribute
			 */
			Interpreter.prototype._setInAttribute = function(attribute) {
				this._inAttributes.put(attribute);
			};

			/**
			 * Sets an inAttributes.
			 *
			 * @protected
			 * @param {(AttributeList|Array)} attributesOrArray Attributes to set.
			 */
			Interpreter.prototype._setInAttributes = function(attributesOrArray) {
				this._inAttributes = new AttributeList().withItems(attributesOrArray);
			};

			/**
			 * Verifies whether the specified attribute is contained in inAttributeList.
			 *
			 * @protected
			 * @param {Attribute} attribute Attribute that should be verified.
			 * @return {boolean}
			 */
			Interpreter.prototype._isInAttribute = function(attribute) {
				return !!this._inAttributes.containsTypeOf(attribute);
			};

			/**
			 * Returns the provided outAttributeTypes.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Interpreter.prototype.getOutAttributes = function() {
				return this._outAttributes;
			};

			/**
			 * Adds an outAttribute.
			 *
			 * @protected
			 * @param {Attribute} attribute
			 */
			Interpreter.prototype._setOutAttribute = function(attribute) {
				this._outAttributes.put(attribute);
			};

			/**
			 * Sets an outAttributes.
			 *
			 * @protected
			 * @param {(AttributeList|Array)} attributesOrArray Attributes to set.
			 */
			Interpreter.prototype._setOutAttributes = function(attributesOrArray) {
				this._outAttributes = new AttributeList().withItems(attributesOrArray);
			};

			/**
			 * Verifies whether the specified attribute is contained in outAttributeList.
			 *
			 * @protected
			 * @param {Attribute} attribute Attribute that should be verified.
			 * @return {boolean}
			 */
			Interpreter.prototype._isOutAttribute = function(attribute) {
				return !!this._outAttributes.containsTypeOf(attribute);
			};

			/**
			 * Validates the data and calls interpretData.
			 *
			 * @public
			 * @param {AttributeList} inAttributes Data that should be interpreted.
			 * @param {AttributeList} outAttributes
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Interpreter.prototype.callInterpreter = function(inAttributes, outAttributes, callback) {
				var self = this;

				if (!inAttributes || !this._canHandleInAttributes(inAttributes)) throw "Empty input attribute list or unhandled input attribute.";
				if (!outAttributes || !this._canHandleOutAttributes(outAttributes)) throw "Empty output attribute list or unhandled output attribute.";

				this._interpretData(inAttributes, outAttributes, function(interpretedData) {
					var response = new AttributeList().withItems(interpretedData);

					if (!self._canHandleOutAttributes(response)) throw "Unhandled output attribute generated.";

					self._setInAttributes(inAttributes);
					self.lastInterpretation = new Date();

					if (callback && typeof(callback) == 'function'){
						callback(response);
					}
				});
			};

			/**
			 * Interprets the data.
			 *
			 * @abstract
			 * @protected
			 * @param {AttributeList} inAttributes
			 * @param {AttributeList} outAttributes
			 * @param {Function} callback
			 */
			Interpreter.prototype._interpretData = function (inAttributes, outAttributes, callback) {
				throw Error("Abstract function call!");
			};

			/**
			 * Checks whether the specified data match the expected.
			 *
			 * @protected
			 * @param {AttributeList|Array.<Attribute>} attributeListOrArray Data that should be verified.
			 */
			Interpreter.prototype._canHandleInAttributes = function(attributeListOrArray) {
				var list = [];
				if (attributeListOrArray instanceof Array) {
					list = attributeListOrArray;
				} else if (attributeListOrArray.constructor === AttributeList) {
					list = attributeListOrArray.getItems();
				}
				if (list.length == 0 || attributeListOrArray.size() != this.getInAttributes().size()) {
					return false;
				}
				for ( var i in list) {
					var inAtt = list[i];
					if (!this._isInAttribute(inAtt)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Checks whether the specified data match the expected.
			 *
			 * @protected
			 * @param {AttributeList|Array.<Attribute>} attributeListOrArray Data that should be verified.
			 */
			Interpreter.prototype._canHandleOutAttributes = function(attributeListOrArray) {
				var list = [];
				if (attributeListOrArray instanceof Array) {
					list = attributeListOrArray;
				} else if (attributeListOrArray.constructor === AttributeList) {
					list = attributeListOrArray.getItems();
				}
				if (list.length == 0 || attributeListOrArray.size() != this.getOutAttributes().size()) {
					return false;
				}
				for ( var i in list) {
					var inAtt = list[i];
					if (!this._isOutAttribute(inAtt)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Returns the time of the last interpretation.
			 *
			 * @public
			 * @returns {Date}
			 */
			Interpreter.prototype.getLastInterpretionTime = function() {
				return this._lastInterpretation;
			};

			/**
			 * Sets and registers to the associated Discoverer.
			 *
			 * @public
			 * @param {Discoverer} discoverer Discoverer
			 */
			Interpreter.prototype.setDiscoverer = function(discoverer) {
				if (!this._discoverer) {
					this._discoverer = discoverer;
					this._register();
				}
			};

			/**
			 * Registers the component to the associated Discoverer.
			 *
			 * @public
			 */
			Interpreter.prototype._register = function() {
				if (this._discoverer) {
					this._discoverer.registerNewComponent(this);
				}
			};

			/**
			 *
			 * @returns {boolean}
			 */
			Interpreter.prototype.hasOutAttributesWithInputParameters = function() {
				return this._outAttributes.hasAttributesWithInputParameters();
			};

			/**
			 *
			 * @returns {AttributeList}
			 */
			Interpreter.prototype.getOutAttributesWithInputParameters = function() {
				return this._outAttributes.getAttributesWithInputParameters();
			};

			/**
			 *
			 * @param {Attribute}attribute
			 * @returns {boolean}
			 */
			Interpreter.prototype.doesSatisfyTypeOf = function(attribute) {
				return this._outAttributes.containsTypeOf(attribute);
			};

			return Interpreter;
		})();
	}
);