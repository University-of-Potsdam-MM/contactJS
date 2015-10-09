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
				this._name = 'Interpreter';

				/**
				 * Types of all contextual information that can be handled.
				 *
				 * @private
				 * @type {ContextInformationList}
				 */
				this._inputContextInformation = new ContextInformationList();

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
				this._initInputContextInformation();
				this._initOutputContextInformation();
			};

			/**
			 * Initializes the input contextual information.
			 *
			 * @private
			 */
			Interpreter.prototype._initInputContextInformation = function() {
				this._setInputContextInformation(ContextInformationList.fromContextInformationDescriptions(this._discoverer, this.constructor.description.in));
			};

			/**
			 * Initializes the output contextual information.
			 *
			 * @private
			 */
			Interpreter.prototype._initOutputContextInformation = function() {
				this._setOutputContextInformation(ContextInformationList.fromContextInformationDescriptions(this._discoverer, this.constructor.description.out));
			};

			/**
			 * Convenience accessor for getOutputData.
			 *
			 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray Contextual information that should be entered.
			 * @returns {ContextInformationList}
			 */
			Interpreter.prototype.getOutputContextInformation = function(contextInformationListOrArray) {
				return /** @type {ContextInformationList} */ this.getOutputData(contextInformationListOrArray);
			};

			/**
			 * Convenience accessor for _setOutputData.
			 *
			 * @param contextInformation
			 * @private
			 */
			Interpreter.prototype._setOutputContextInformation = function(contextInformation) {
				this._setOutputData(contextInformation);
			};

			/**
			 * Convenience accessor for _isOutputData.
			 *
			 * @param {ContextInformation} contextInformation
			 * @returns {Boolean}
			 * @private
			 */
			Interpreter.prototype._isOutputContextInformation = function(contextInformation) {
				return this._isOutputData(contextInformation);
			};

			/**
			 * Returns the expected input contextual information.
			 *
			 * @public
			 * @returns {ContextInformationList}
			 */
			Interpreter.prototype.getInputContextInformation = function() {
				return this._inputContextInformation;
			};

			/**
			 * Adds an input contextual information.
			 *
			 * @protected
			 * @param {ContextInformation} contextInformation
			 */
			Interpreter.prototype._addInputContextInformation = function(contextInformation) {
				this._inputContextInformation.put(contextInformation);
			};

			/**
			 * Sets the input contextual information.
			 *
			 * @protected
			 * @param {(ContextInformationList|Array)} contextInformationListOrArray The contextual information to set.
			 */
			Interpreter.prototype._setInputContextInformation = function(contextInformationListOrArray) {
				this._inputContextInformation = new ContextInformationList().withItems(contextInformationListOrArray);
			};

			/**
			 * Verifies whether the specified contextual information is contained in _inputContextInformation.
			 *
			 * @protected
			 * @param {ContextInformation} contextInformation The contextual information that should be verified.
			 * @return {boolean}
			 */
			Interpreter.prototype._isInputContextInformation = function(contextInformation) {
				return !!this._inputContextInformation.containsKindOf(contextInformation);
			};

			/**
			 * Validates the data and calls interpretData.
			 *
			 * @public
			 * @param {ContextInformationList} inputContextInformation Data that should be interpreted.
			 * @param {ContextInformationList} outputContextInformation
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Interpreter.prototype.callInterpreter = function(inputContextInformation, outputContextInformation, callback) {
				var self = this;

				if (!inputContextInformation || !this._canHandleInputContextInformation(inputContextInformation)) throw "Empty input contextual information list or unhandled input contextual information.";
				if (!outputContextInformation || !this._canHandleOutputContextInformation(outputContextInformation)) throw "Empty output contextual information list or unhandled output contextual information.";

				// get expected input contextual information
				var expectedInputContextInformation = this._getExpectedInputContextInformation(inputContextInformation);

				this._interpretData(expectedInputContextInformation, outputContextInformation, function(interpretedData) {
					var response = new ContextInformationList().withItems(interpretedData);

					if (!self._canHandleOutputContextInformation(response)) throw "Unhandled output contextual information generated.";

					self._setInputContextInformation(inputContextInformation);
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
			Interpreter.prototype._canHandleInputContextInformation = function(contextInformationListOrArray) {
				var list = [];
				if (contextInformationListOrArray instanceof Array) {
					list = contextInformationListOrArray;
				} else if (contextInformationListOrArray instanceof ContextInformationList) {
					list = contextInformationListOrArray.getItems();
				}
				if (list.length == 0 || contextInformationListOrArray.size() != this.getInputContextInformation().size()) {
					return false;
				}
				for (var i in list) {
					var inContextInformation = list[i];
					if (!this._isInputContextInformation(inContextInformation)) {
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
			Interpreter.prototype._canHandleOutputContextInformation = function(contextInformationListOrArray) {
				var list = [];
				if (contextInformationListOrArray instanceof Array) {
					list = contextInformationListOrArray;
				} else if (contextInformationListOrArray instanceof ContextInformationList) {
					list = contextInformationListOrArray.getItems();
				}
				if (list.length == 0 || contextInformationListOrArray.size() != this.getOutputContextInformation().size()) {
					return false;
				}
				for (var i in list) {
					var outContextInformation = list[i];
					if (!this._isOutputContextInformation(outContextInformation)) {
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
			Interpreter.prototype._getExpectedInputContextInformation = function(contextInformationList) {
				var self = this;
				var expectedContextInformation = new ContextInformationList();

				contextInformationList.getItems().forEach(function(contextInformation, index) {
					expectedContextInformation.put(contextInformation.getSynonymWithName(self.getInputContextInformation().getItems()[index].getName()).setValue(contextInformation.getValue()));
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
			Interpreter.prototype.hasOutputContextInformationWithInputParameters = function() {
				return this._outputData.hasContextInformationWithInputParameters();
			};

			/**
			 *
			 * @returns {ContextInformationList}
			 */
			Interpreter.prototype.getOutputContextInformationWithInputParameters = function() {
				return this._outputData.getContextInformationWithInputParameters();
			};

			return Interpreter;
		})();
	}
);