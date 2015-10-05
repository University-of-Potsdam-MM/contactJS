define(['contextInformationList'], function(ContextInformationList){
	return (function() {
		/**
		 * Initializes the input and output contextual information.
		 * Contains the interpreted data, inclusive the input for the interpretation.
		 *
		 * @class InterpreterResult
		 */
		function InterpreterResult() {
			/**
			 * Time of the interpretation.
			 *
			 * @type {date}
			 * @private
			 */
			this._timestamp = '';

			/**
			 * Interpreted data.
			 *
			 * @type {ContextInformationList}
			 * @private
			 */
			this._outContextInformation = new ContextInformationList();

			/**
			 * Data, which were used for the interpretation.
			 *
			 * @type {ContextInformationList}
			 * @private
			 */
			this._inContextInformation = new ContextInformationList();


			return this;
		}

		/**
		 * Builder for timestamp.
		 *
		 * @param {String} timestamp timestamp
		 * @returns {InterpreterResult}
		 */
		InterpreterResult.prototype.withTimestamp = function(timestamp) {
			this.setTimestamp(timestamp);
			return this;
		};

		/**
		 * Builder for output contextual information.
		 *
		 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray values
		 * @returns {InterpreterResult}
		 */
		InterpreterResult.prototype.withOutContextInformation = function(contextInformationListOrArray){
			this.setOutContextInformation(contextInformationListOrArray);
			return this;
		};

		/**
		 * Builder for input contextual information.
		 *
		 * @param {(ContextInformationList|.<ContextInformation>)} contextInformationListOrArray values
		 * @returns {InterpreterResult}
		 */
		InterpreterResult.prototype.withInContextInformation = function(contextInformationListOrArray) {
			this.setInContextInformation(contextInformationListOrArray);
			return this;
		};

		/**
		 * Returns the interpretation time.
		 *
		 * @returns {Date}
		 */
		InterpreterResult.prototype.getTimestamp = function() {
			return this._timestamp;
		};

		/**
		 * Returns the interpreted contextual information.
		 *
		 * @returns {ContextInformationList}
		 */
		InterpreterResult.prototype.getOutContextInformation = function(){
			return this._outContextInformation;
		};

		/**
		 * Returns the input contextual information.
		 *
		 * @returns {ContextInformationList}
		 */
		InterpreterResult.prototype.getInContextInformation = function(){
			return this._inContextInformation;
		};

		/**
		 * Sets the interpretation time.
		 *
		 * @param {date} timestamp interpretation time
		 */
		InterpreterResult.prototype.setTimestamp = function(timestamp){
			if(timestamp instanceof Date){
				this._timestamp = timestamp;
			}
		};

		/**
		 * Sets the interpreted values.
		 *
		 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray The retrieved contextual information.
		 */
		InterpreterResult.prototype.setOutContextInformation = function(contextInformationListOrArray){
			if (contextInformationListOrArray instanceof Array) {
				for(var i in contextInformationListOrArray){
					this._outContextInformation.put(contextInformationListOrArray[i]);
				}
			} else if (contextInformationListOrArray instanceof ContextInformationList) {
				this._outContextInformation = contextInformationListOrArray.getItems();
			}
		};

		/**
		 * Sets the put contextual information.
		 *
		 * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray
		 */
		InterpreterResult.prototype.setInContextInformation = function(contextInformationListOrArray){
			if (contextInformationListOrArray instanceof Array) {
				for(var i in contextInformationListOrArray){
					this._inContextInformation.put(contextInformationListOrArray[i]);
				}
			} else if (contextInformationListOrArray instanceof ContextInformationList) {
				this._inContextInformation = contextInformationListOrArray.getItems();
			}
		};

		return InterpreterResult;
	});
});