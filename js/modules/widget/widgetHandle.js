/**
 * This module represents a WidgetHandle which contains name and id of the
 * Widget that should be subscribed to.
 * 
 * @module WidgetHandle
 * @fileOverview
 */
define([ 'easejs' ], function(easejs) {
	var Class = easejs.Class;
		
	/**
	 * @class WidgetHandle
	 * @classdesc This Class contains name and id of a Widget that should be
	 *            subscribed to.
	 * @requires easejs
	 */
	var WidgetHandle = Class('WidgetHandle', {
			
		/**
		 * @alias name
		 * @private
		 * @type {string}
		 * @memberof WidgetHandle#
		 * @desc Name of the Widget that should be subscribed to.
		 */
		'private name' : '',
		/**
		 * @alias id
		 * @private
		 * @type {string}
		 * @memberof WidgetHandle#
		 * @desc Id of the Widget that should be subscribed to.
		 */
		'private id' : '',

		/**
		 * Builder for variable name
		 * 
		 * @public
		 * @alias withName
		 * @memberof WidgetHandle#
		 * @param {string} _name
		 * @returns {WidgetHandle}
		 */
		'public withName' : function(_name) {
			this.setName(_name);
			return this;
		},

		/**
		 * Builder for variable id
		 * 
		 * @public
		 * @alias withId
		 * @memberof WidgetHandle#
		 * @param {string} _id
		 * @returns {WidgetHandle}
		 */
		'public withId' : function(_id) {
			this.setId(_id);
			return this;
		},

		/**
		 * Returns the name of the Widget that should be subscribed to.
		 * 
		 * @public
		 * @alias getName
		 * @memberof WidgetHandle#
		 * @returns {string} name
		 */
		'public getName' : function() {
			return this.name;
		},

		/**
		 * Sets the name of the Widget that should be subscribed to.
		 * 
		 * @public
		 * @alias setName
		 * @memberof WidgetHandle#
		 * @param {string} _name name of the Widget that should be subscribed to
		 */
		'public setName' : function(_name) {
			if (typeof _name === 'string') {
				this.name = _name;
			}
		},

		/**
		 * Returns the id of the Widget that should be subscribed to.
		 * 
		 * @public
		 * @alias getId
		 * @memberof WidgetHandle#
		 * @returns {string} 
		 */
		'public getId' : function() {
			return this.id;
		},

		/**
		 * Sets the id of the Widget that should be subscribed to.
		 * 
		 * @public
		 * @alias setId
		 * @memberof WidgetHandle#
		 * @param {string} _id id of the Widget that should be subscribed to
		 */
		'public setId' : function(_id) {
			if (typeof _id === 'string') {
				this.id = _id;
			}
		},

		/**
		 * Compare the specified WidgetHandle with this instance
		 * 
		 * @public
		 * @alias equals
		 * @memberof WidgetHandle#
		 * @param {WidgetHandle} _widgetHandle WidgetHandle that should be compared
		 * @returns {boolean}
		 */
		'public equals' : function(_widgetHandle) {
			if (Class.isA(WidgetHandle, _widgetHandle)) {
				if (_widgetHandle.getName() == this.getName()
						&& _widgetHandle.getId() == this.getId()) {
					return true;
				}
			}
			return false;
		},

	});

	return WidgetHandle;
});