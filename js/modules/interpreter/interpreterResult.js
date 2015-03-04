/**
 * This module represents a InterpreterResult.
 * 
 * @module InterpreterResult
 * @fileOverview
 */
define(['easejs', 'attributeValueList'],
    function(easejs, AttributeValueList){
    	var Class = easejs.Class;
    	
		var InterpreterResult = Class('InterpreterResult',{
					
			/**
			 * @alias timestamp
			 * @private
			 * @type {date}
			 * @memberof InterpreterResult#
			 * @desc Time of the interpretation.
			 */
			'private timestamp' : '',
			/**
			 * @alias outAttributes
			 * @private
			 * @type {AttributeValueList}
			 * @memberof InterpreterResult#
			 * @desc Interpreted data.
			 */
			'private outAttributes' : [],
				
			/**
			 * @alias inAttributes
			 * @private
			 * @type {AttributeValueList}
			 * @memberof InterpreterResult#
			 * @desc Data, which were used for the interpretation.
			 */
			'private inAttributes' : [],
			
			/**
			 * Constructor: Initializes the in- and outAttributes.
			 *
			 * @class InterpreterResult
			 * @classdesc Contains the interpreted data, inclusive the input for the interpretation.
			 * @requires easejs
			 * @requires AttributeValueList
			 */
			'public __construct' : function() {
				this.inAttributes = new AttributeValueList();
				this.outAttributes = new AttributeValueList();
			},
			
    		/**
			 * Builder for timestamp.
			 * 
			 * @public
			 * @alias withTimestamp
			 * @memberof InterpreterResult#
			 * @param {String} _timestamp timestamp
			 * @returns {InterpreterResult}
			 */
    		'public withTimestamp' : function(_timestamp){
    			this.setTimestamp(_timestamp);
    			return this;
    		},

    		/**
			 * Builder for outAttributes.
			 * 
			 * @public
			 * @alias withOutAttributes
			 * @memberof InterpreterResult#
			 * @param {(AttributeValueList|Array)} _outAttributes values
			 * @returns {InterpreterResult}
			 */
    		'public withOutAttributes' : function(_outAttributes){
    			this.setOutAttributes(_outAttributes);
    			return this;
    		},
    		
    		/**
			 * Builder for inAttributes.
			 * 
			 * @public
			 * @alias withInAttributes
			 * @memberof InterpreterResult#
			 * @param {(AttributeValueList|Array)} _inAttributes values
			 * @returns {InterpreterResult}
			 */
    		'public withInAttributes' : function(_inAttributes){
    			this.setInAttributes(_inAttributes);
    			return this;
    		},
    		
			
			/**
			 * Returns the interpretation time.
			 * 
			 * @public
			 * @alias getTimestamp
			 * @memberof InterpreterResult#
			 * @returns {date}
			 */
			'public getTimestamp' : function(){
				return this.timestamp;
			},
			
			/**
			 * Returns the interpreted attributes.
			 * 
			 * @public
			 * @alias getOutAttributes
			 * @memberof InterpreterResult#
			 * @returns {AttributeValueList}
			 */
			'public getOutAttributes' : function(){
				return this.outAttributes;
			},
			
			/**
			 * Returns the inAttributes.
			 * 
			 * @public
			 * @alias getInAttributes
			 * @memberof InterpreterResult#
			 * @returns {AttributeValueList}
			 */
			'public getInAttributes' : function(){
				return this.inAttributes;
			},

			/**
    		 * Sets the interpretation time.
    		 * 
    		 * @public
    		 * @alias setTimestamp
    		 * @memberof InterpreterResult#
    		 * @param {date} _timstamp interpretation time
    		 */
			'public setTimestamp' : function(_timesstamp){
				if(_timesstamp instanceof Date){
					this.type = _timesstamp;
				};
			},
			
			/**
    		 * Sets the interpreted values.
    		 * 
    		 * @public
    		 * @alias setOutAttributes
    		 * @memberof InterpreterResult#
    		 * @param {(AttributeValueList|Array)} _outAttributes retrieved attributes
    		 */
			'public setOutAttributes' : function(_outAttributes){
				if (_outAttributes instanceof Array) {
					for(var i in _outAttributes){
						this.outAttributes.put(_outAttributes[i]);
					};
				} else if (Class.isA(AttributeValueList, _outAttributes)) {
					this.outAttributes = _outAttributes;
				};
			},
			
			/**
    		 * Sets the inAttributes.
    		 * 
    		 * @public
    		 * @alias setInAttributes
    		 * @memberof InterpreterResult#
    		 * @param {(AttributeValueList|Array)} _inAttributes inAttributes
    		 */
			'public setInAttributes' : function(_inAttributes){
				if (_inAttributes instanceof Array) {
					for(var i in _outAttributes){
						this.inAttributes.put(_inAttributes[i]);
					};
				} else if (Class.isA(AttributeValueList, _inAttributes)) {
					this.inAttributes = _inAttributes;
				};
			}

		});

		return InterpreterResult;
	
});