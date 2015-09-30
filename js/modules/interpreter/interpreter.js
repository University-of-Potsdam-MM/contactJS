define(['component', 'MathUuid', 'attribute', 'attributeList', 'interpreterResult' ],
	function(Component, MathUuid, Attribute, AttributeList, InterpreterResult) {
		return (function() {

			/**
			 * Defines all in and outAttributes as an object.
			 * @type {object}
			 * @public
			 */
			Interpreter.description = {
				in: [
					{
						'name':'',
						'type':''
					}
				],
				out: [
					{
						'name':'',
						'type':''
					}
				],
				requiredObjects: []
			};

			/**
			 * Generates the id and initializes the (in and out) types and values.
			 *
			 * @abstract
			 * @classdesc The Widget handles the access to sensors.
			 * @constructs Interpreter
			 */
			function Interpreter(discoverer) {
				Component.call(this, discoverer);

				this.name = 'Interpreter';

				/**
				 * Types of all attributes that can be handled.
				 *
				 * @private
				 * @type {AttributeList}
				 */
				this._inAttributes = new AttributeList();

				/**
				 * Last interpretation time.
				 *
				 * @protected
				 * @type {?Date}
				 */
				this._lastInterpretation = null;

				this._register();
				this._initInterpreter();

				return this;
			}

			Interpreter.prototype = Object.create(Component.prototype);
			Interpreter.prototype.constructor = Interpreter;

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
				this._inAttributes = AttributeList.fromAttributeDescriptions(this._discoverer, this.constructor.description.in);
			};

			/**
			 * Initializes the outAttributes.
			 *
			 * @private
			 */
			Interpreter.prototype._initOutAttributes = function() {
				this._outAttributes = AttributeList.fromAttributeDescriptions(this._discoverer, this.constructor.description.out);
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

				// get expected input attributes
				var expectedInAttributes = this._getExpectedInAttributes(inAttributes);

				this._interpretData(expectedInAttributes, outAttributes, function(interpretedData) {
					var response = new AttributeList().withItems(interpretedData);

					if (!self._canHandleOutAttributes(response)) throw "Unhandled output attribute(s) generated.";

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
				} else if (attributeListOrArray instanceof AttributeList) {
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
			 * Returns a attribute list which consists of the synonyms that are expected by the interpreter, if possible.
			 *
			 * @param attributes
			 * @returns {*}
			 * @private
			 */
			Interpreter.prototype._getExpectedInAttributes = function(attributes) {
				var self = this;
				var expectedAttributes = new AttributeList();

				attributes.getItems().forEach(function(attribute, index) {
					expectedAttributes.put(attribute.getSynonymWithName(self.getInAttributes().getItems()[index].getName()).setValue(attribute.getValue()));
				});

				return expectedAttributes;
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