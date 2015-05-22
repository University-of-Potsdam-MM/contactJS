/**
 * This module represents the helper class Translation. 
 * 
 * @module Translation
 * @fileOverview
 */
define('translation', ['attribute'], function(Attribute) {

	return function()
	var Translation = Class('Translation', {
		
		'private fromAttributeType' : {},
		
		'private toAttributeType' : {},		

		/**
		 * Constructor: Constructs a translation tuple.
		 * 
		 * @class Translation
		 * @classdesc This class represents a translation tuple.
		 * 			  It holds two synonymous attribute types.
		 * @requires easejs
		 * @requires attribute
		 * @constructs Translation
		 */
		'public __construct' : function(_fromAttributeType, _toAttributeType) {
			if (Class.isA(Attribute, _fromAttributeType) && Class.isA(Attribute, _toAttributeType)) 
			{
				this.fromAttributeType = _fromAttributeType;
				this.toAttributeType = _toAttributeType;	
			}
		},
				
		/**
		 * Look for a translation and return the found synonym.
		 * 
		 * @public
		 * @alias getSynonym
		 * @memberof Translation#
		 * @returns {Attribute} The synonymous attribute
		 */
		'public getSynonym': function() {			
			return this.toAttributeType; 
		},
	
		/**
		 * Look for a translation and return true if one exists.
		 * 
		 * @public
		 * @alias translates
		 * @memberof Translation#
		 * @param {Attribute} attribute Attribute whose synonym is queried
		 * @returns {boolean} 
		 */
		'public translates': function(_attribute) {
			
			return this.fromAttributeType.equalsTypeOf(_attribute); 
		}
		
		});

	return Translation;
});