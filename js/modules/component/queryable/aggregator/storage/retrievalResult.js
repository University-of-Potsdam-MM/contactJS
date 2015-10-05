define(["contextInformationList"], function(ContextInformationList){
	return (function() {
		/**
		 * Contains the data that were retrieved from the database.
		 *
		 * @class RetrievalResult
		 */
		function RetrievalResult() {
			/**
			 * Name of the retrieved contextual information.
			 *
			 * @private
			 * @type {string}
			 */
			this._name = '';

			/**
			 * Time of the retrieval.
			 *
			 * @type {date}
			 * @private
			 */
			this._timestamp = '';

			/**
			 * Retrieved contextual information.
			 *
			 * @type {ContextInformationList}
			 * @private
			 */
			this._values = new ContextInformationList();

			return this;
		}

		/**
		 * Builder for name.
		 *
		 * @param {String} name name
		 * @returns {RetrievalResult}
		 */
		RetrievalResult.prototype.withName = function(name){
			this.setName(name);
			return this;
		};

		/**
		 * Builder for timestamp.
		 *
		 * @param {String} timestamp timestamp
		 * @returns {RetrievalResult}
		 */
		RetrievalResult.prototype.withTimestamp = function(timestamp){
			this.setTimestamp(timestamp);
			return this;
		};

		/**
		 * Builder for values.
		 *
		 * @param {Array} values values
		 * @returns {RetrievalResult}
		 */
		RetrievalResult.prototype.withValues = function(values){
			this.setValues(values);
			return this;
		};

		/**
		 * Returns the contextual information name.
		 *
		 * @returns {string}
		 */
		RetrievalResult.prototype.getName = function(){
			return this._name;
		};

		/**
		 * Returns the retrieval time.
		 *
		 * @returns {date}
		 */
		RetrievalResult.prototype.getTimestamp = function(){
			return this._timestamp;
		};

		/**
		 * Returns the retrieved contextual information.
		 *
		 * @returns {ContextInformationList}
		 */
		RetrievalResult.prototype.getValues = function(){
			return this._values;
		};

		/**
		 * Sets the contextual information name.
		 *
		 * @param {string} name Name of the retrieved contextual information.
		 */
		RetrievalResult.prototype.setName = function(name){
			if(typeof name === 'string'){
				this._name = name;
			}
		};

		/**
		 * Sets the retrieval time.
		 *
		 * @param {date} timestamp Retrieval time.
		 */
		RetrievalResult.prototype.setTimestamp = function(timestamp){
			if(timestamp instanceof Date){
				this._type = timestamp;
			}
		};

		/**
		 * Sets the retrieved values.
		 *
		 * @param {Array} values Retrieved contextual information.
		 */
		RetrievalResult.prototype.setValues = function(values){
			if(values instanceof Array){
				this._values = values;
			}
		};

		return RetrievalResult;
	})();
});