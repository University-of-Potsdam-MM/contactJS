define(['component', 'contextInformation', 'contextInformationList', 'interpreterResult' ],
	function(Component, ContextInformation, ContextInformationList, InterpreterResult) {
		return (function() {

			/**
			 * Defines all in and out contextual information as an object.
			 *
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
			 * @class Interpreter
			 * @extends Component
			 */
			function Interpreter(discoverer) {
				Component.call(this, discoverer);

				/**
				 * Name of the interpreter.
				 *
				 * @type {string}
				 * @private
				 */
				this.name = 'Interpreter';

				/**
				 * Types of all contextual information that can be handled.
				 *
				 * @private
				 * @type {ContextInformationList}
				 */
				this._inContextInformation = new ContextInformationList();

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
			 * Initializes interpreter and sets the expected contextual information and provided output contextual information.
			 *
			 * @private
			 */
			Interpreter.prototype._initInterpreter = function() {
				this._initInContextInformation();
				this._initOutContextInformation();
			};

			/**
			 * Initializes the input contextual information.
			 *
			 * @private
			 */
			Interpreter.prototype._initInContextInformation = function() {
				this._setInContextInformation(ContextInformationList.fromContextInformationDescriptions(this._discoverer, this.constructor.description.in));
			};

			/**
			 * Initializes the output contextual information.
			 *
			 * @private
			 */
			Interpreter.prototype._initOutContextInformation = function() {
				this._setOutContextInformation(ContextInformationList.fromContextInformationDescriptions(this._discoverer, this.constructor.description.out));
			};

			/**
			 * Returns the expected input contextual information.
			 *
			 * @public
			 * @returns {ContextInformationList}
			 */
			Interpreter.prototype.getInContextInformation = function() {
				return this._inContextInformation;
			};

			/**
			 * Adds an input contextual information.
			 *
			 * @protected
			 * @param {ContextInformation} contextInformation
			 */
			Interpreter.prototype._addInContextInformation = function(contextInformation) {
				this._inContextInformation.put(contextInformation);
			};

			/**
			 * Sets the input contextual information.
			 *
			 * @protected
			 * @param {(ContextInformationList|Array)} contextInformationListOrArray The contextual information to set.
			 */
			Interpreter.prototype._setInContextInformation = function(contextInformationListOrArray) {
				this._inContextInformation = new ContextInformationList().withItems(contextInformationListOrArray);
			};

			/**
			 * Verifies whether the specified contextual information is contained in _inContextInformation.
			 *
			 * @protected
			 * @param {ContextInformation} contextInformation The contextual information that should be verified.
			 * @return {boolean}
			 */
			Interpreter.prototype._isInContextInformation = function(contextInformation) {
				return !!this._inContextInformation.containsKindOf(contextInformation);
			};

			/**
			 * Validates the data and calls interpretData.
			 *
			 * @public
			 * @param {ContextInformationList} inContextInformation Data that should be interpreted.
			 * @param {ContextInformationList} outContextInformation
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Interpreter.prototype.callInterpreter = function(inContextInformation, outContextInformation, callback) {
				var self = this;

				if (!inContextInformation || !this._canHandleInContextInformation(inContextInformation)) throw "Empty input contextual information list or unhandled input contextual information.";
				if (!outContextInformation || !this._canHandleOutContextInformation(outContextInformation)) throw "Empty output contextual information list or unhandled output contextual information.";

				// get expected input contextual information
				var expectedInContextInformation = this._getExpectedInContextInformation(inContextInformation);

				this._interpretData(expectedInContextInformation, outContextInformation, function(interpretedData) {
					var response = new ContextInformationList().withItems(interpretedData);

					if (!self._canHandleOutContextInformation(response)) throw "Unhandled output contextual information generated.";

					self._setInContextInformation(inContextInformation);
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
			 * @param {ContextInformationList} inContextInformation
			 * @param {ContextInformationList} outContextInformation
			 * @param {Function} callback
			 */
			Interpreter.prototype._interpretData = function (inContextInformation, outContextInformation, callback) {
				throw Error("Abstract function call!");
			};

			/**
			 * Checks whether the specified data match the expected.
			 *
			 * @protected
			 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray Data that should be verified.
			 */
			Interpreter.prototype._canHandleInContextInformation = function(contextInformationListOrArray) {
				var list = [];
				if (contextInformationListOrArray instanceof Array) {
					list = contextInformationListOrArray;
				} else if (contextInformationListOrArray instanceof ContextInformationList) {
					list = contextInformationListOrArray.getItems();
				}
				if (list.length == 0 || contextInformationListOrArray.size() != this.getInContextInformation().size()) {
					return false;
				}
				for (var i in list) {
					var inContextInformation = list[i];
					if (!this._isInContextInformation(inContextInformation)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Checks whether the specified data match the expected.
			 *
			 * @protected
			 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray Data that should be verified.
			 */
			Interpreter.prototype._canHandleOutContextInformation = function(contextInformationListOrArray) {
				var list = [];
				if (contextInformationListOrArray instanceof Array) {
					list = contextInformationListOrArray;
				} else if (contextInformationListOrArray instanceof ContextInformationList) {
					list = contextInformationListOrArray.getItems();
				}
				if (list.length == 0 || contextInformationListOrArray.size() != this.getOutContextInformation().size()) {
					return false;
				}
				for (var i in list) {
					var outContextInformation = list[i];
					if (!this._isOutContextInformation(outContextInformation)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Returns a contextual information list which consists of the synonyms that are expected by the interpreter, if possible.
			 *
			 * @param {ContextInformationList} contextInformationList
			 * @returns {*}
			 * @private
			 */
			Interpreter.prototype._getExpectedInContextInformation = function(contextInformationList) {
				var self = this;
				var expectedContextInformation = new ContextInformationList();

				contextInformationList.getItems().forEach(function(contextInformation, index) {
					expectedContextInformation.put(contextInformation.getSynonymWithName(self.getInContextInformation().getItems()[index].getName()).setValue(contextInformation.getValue()));
				});

				return expectedContextInformation;
			};

			/**
			 * Returns the time of the last interpretation.
			 *
			 * @public
			 * @returns {Date}
			 */
			Interpreter.prototype.getLastInterpretationTime = function() {
				return this._lastInterpretation;
			};

			/**
			 *
			 * @returns {boolean}
			 */
			Interpreter.prototype.hasOutContextInformationWithInputParameters = function() {
				return this._outContextInformation.hasContextInformationWithInputParameters();
			};

			/**
			 *
			 * @returns {ContextInformationList}
			 */
			Interpreter.prototype.getOutContextInformationWithInputParameters = function() {
				return this._outContextInformation.getContextInformationWithInputParameters();
			};

			return Interpreter;
		})();
	}
);