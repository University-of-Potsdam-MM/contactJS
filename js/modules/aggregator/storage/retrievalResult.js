/**
 * This module represents a RetrievalResult.
 * It contains the data that were retrieved from the database
 * 
 * @module RetrievalResult
 * @fileOverview
 */
define(["attributeList"], function(AttributeList){
	return (function() {
		/**
		 * @class RetrievalResult
		 * @classdesc Contains the data that were retrieved from the database.
		 * @requires easejs
		 * @returns {RetrievalResult}
		 * @constructor
		 */
		function RetrievalResult() {
			/**
			 * Name of the retrieved Attribute.
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
			 * Retrieved Attributes.
			 *
			 * @type {AttributeList}
			 * @private
			 */
			this._values = new AttributeList();

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
		 * Returns the Attribute name.
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
		 * Returns the retrieved Attributes.
		 *
		 * @returns {AttributeList}
		 */
		RetrievalResult.prototype.getValues = function(){
			return this._values;
		};

		/**
		 * Sets the Attribute name.
		 *
		 * @param {string} name Name of the retrieved Attribute.
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
		 * @param {Array} values Retrieved Attributes.
		 */
		RetrievalResult.prototype.setValues = function(values){
			if(values instanceof Array){
				this._values = values;
			}
		};

		return RetrievalResult;
	})();
});