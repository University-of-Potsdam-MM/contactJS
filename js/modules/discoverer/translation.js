/**
 * This module represents the helper class Translation. 
 * 
 * @module Translation
 * @fileOverview
 */
define('translation', ['easejs', 'attributeType'], function(easejs, AttributeType) {
 	var Class = easejs.Class;
 	
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
		 * @requires attributeType
		 * @constructs Translation
		 */
		'public __construct' : function(_fromAttributeType, _toAttributeType) {
			
			this.fromAttributeType = _fromAttributeType;
			this.toAttributeType = _toAttributeType;				
		},
				
		/**
		 * Look for a translation and return the found synonym.
		 * 
		 * @public
		 * @alias getSynonym
		 * @memberof Translation#
		 * @param {AttributeType} attributeType AttributeType whose synonym is queried
		 * @returns {AttributeType} The synonym if one exists, otherwise the given attributeType
		 */
		'public getSynonym': function(_attributeType) {
			
			return this.hasSynonym(_attributeType) ? this.toAttributeType : _attributeType; 
		},
	
		/**
		 * Look for a translation and return true if one exists.
		 * 
		 * @public
		 * @alias hasSynonym
		 * @memberof Translation#
		 * @param {AttributeType} attributeType AttributeType whose synonym is queried
		 * @returns {boolean} 
		 */
		'public hasSynonym': function(_attributeType) {
			
			return this.fromAttributeType.equals(_attributeType); 
		}
		
		});

	return Translation;
});