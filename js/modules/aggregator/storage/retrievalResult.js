/**
 * This module represents a RetrievalResult.
 * It contains the data that were retrieved from the database
 * 
 * @module RetrievalResult
 * @fileOverview
 */
define(['easejs'],
    function(easejs){
    	var Class = easejs.Class;
    	/**
    	 * @class RetrievalResult
    	 * @classdesc Contains the data that were retrieved from the database.
    	 * @requires easejs
    	 */
		var RetrievalResult = Class('RetrievalResult',{
			
			/**
			 * @alias name
			 * @private
			 * @type {string}
			 * @memberof RetrievalResult#
			 * @desc Name of the retrieved Attribute.
			 */
			'private name' : '', 
			/**
			 * @alias timestamp
			 * @private
			 * @type {date}
			 * @memberof RetrievalResult#
			 * @desc Time of the retrieval.
			 */
			'private timestamp' : '',
			/**
			 * @alias values
			 * @private
			 * @type {AttributeValueList}
			 * @memberof RetrievalResult#
			 * @desc Retrieved Attributes.
			 */
			'private values' : [],
				
			/**
			 * Builder for name.
			 * 
			 * @public
			 * @alias withName
			 * @memberof RetrievalResult#
			 * @param {String} _name name
			 * @returns {RetrievalResult}
			 */
    		'public withName' : function(_name){
    			this.setName(_name);
    			return this;
    		},

    		/**
			 * Builder for timestamp.
			 * 
			 * @public
			 * @alias withTimestamp
			 * @memberof RetrievalResult#
			 * @param {String} _timestamp timestamp
			 * @returns {RetrievalResult}
			 */
    		'public withTimestamp' : function(_timestamp){
    			this.setTimestamp(_timestamp);
    			return this;
    		},

    		/**
			 * Builder for values.
			 * 
			 * @public
			 * @alias withValues
			 * @memberof RetrievalResult#
			 * @param {Array} _values values
			 * @returns {RetrievalResult}
			 */
    		'public withValues' : function(_values){
    			this.setValues(_values);
    			return this;
    		},
    		
    		/**
    		 * Returns the Attribute name.
    		 * 
    		 * @public
    		 * @alias getName
    		 * @memberof RetrievalResult#
    		 * @returns {string}
    		 */
			'public getName' : function(){
				return this.name;
			},
			
			/**
			 * Returns the retrieval time.
			 * 
			 * @public
			 * @alias getTimestamp
			 * @memberof RetrievalResult#
			 * @returns {date}
			 */
			'public getTimestamp' : function(){
				return this.timestamp;
			},
			
			/**
			 * Returns the retrieved Attributes.
			 * 
			 * @public
			 * @alias getValues
			 * @memberof RetrievalResult#
			 * @returns {Array}
			 */
			'public getValues' : function(){
				return this.values;
			},

			/**
    		 * Sets the Attribute name.
    		 * 
    		 * @public
    		 * @alias setName
    		 * @memberof RetrievalResult#
    		 * @param {string} _name Name of the retrieved Attribute.
    		 */
			'public setName' : function(_name){
				if(typeof _name === 'string'){
					this.name = _name;
				};
			},

			/**
    		 * Sets the retrieval time.
    		 * 
    		 * @public
    		 * @alias setTimestamp
    		 * @memberof RetrievalResult#
    		 * @param {date} _timstamp Retrieval time.
    		 */
			'public setTimestamp' : function(_timesstamp){
				if(_timesstamp instanceof Date){
					this.type = _timesstamp;
				};
			},
			
			/**
    		 * Sets the retrieved values.
    		 * 
    		 * @public
    		 * @alias setValues
    		 * @memberof RetrievalResult#
    		 * @param {Array} _values Retrieved Attributes.
    		 */
			'public setValues' : function(_values){
				if(_values instanceof Array){
					this.values = _values;
				};
			},

			});

		return RetrievalResult;
	
});