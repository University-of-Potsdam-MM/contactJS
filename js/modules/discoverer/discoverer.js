/**
 * This module representing a Context Discoverer.
 * 
 * @module Discoverer
 * @fileOverview
 */
define([ 'easejs', 'attributeList', 'widget', 'interpreter', 'aggregator' ], function(easejs,
		AttributeList, Widget, Interpreter, Aggregator) {
	var Class = easejs.Class;
	
	var Discoverer = Class('Discoverer', {

		/**
		 * @alias widgets
		 * @private
		 * @type {Object}
		 * @memberof Discoverer#
		 * @desc List of available Widgets.
		 */
		'private widgets' : [],
		
		/**
		 * @alias aggregators
		 * @private
		 * @type {Object}
		 * @memberof Discoverer#
		 * @desc List of available Aggregators.
		 */
		'private aggregators' : [],
		
		/**
		 * @alias interpreters
		 * @private
		 * @type {Object}
		 * @memberof Discoverer#
		 * @desc List of available Interpreter.
		 */
		'private interpreters' : [],

		/**
		 * Constructor: All known components given in the associated functions will be registered as startup.
		 * 
		 * @class Discoverer
		 * @classdesc The Discoverer handles requests for components and attributes. 
		 * @requires easejs
		 * @requires AttributeList
		 * @constructs Discoverer
		 */
		'public __construct' : function() {

		},

		/**
		 * Returns the type of this class, in this case
		 * "Discoverer".
		 * 
		 * @public
		 * @alias getType
		 * @memberof Discoverer#
		 * @returns {string}
		 */
		'public getType' : function() {
			return 'Discoverer';
		},

		/**
		 * Registers the specified component.
		 * 
		 * @public
		 * @alias registerNewComponent
		 * @memberof Discoverer#
		 * @param {Widget|Aggregator|Interpreter} _component the component that should be registered 
		 */
		'public registerNewComponent' : function(_component) {
			if (_component.constructor === Widget && this.getWidget(_component.getId()) == null) this.widgets.push(_component);
			if (_component.constructor === Interpreter && this.getInterpreter(_component.getId()) == null) this.interpreters.push(_component);
			if (_component.constructor === Aggregator && this.getAggregator(_component.getId()) == null) this.aggregators.push(_component);
		},

		/**
		 * Deletes a component from the Discoverer.
		 * 
		 * @public
		 * @alias unregisterComponent
		 * @memberof Discoverer#
		 * @param {string} _id id of the component that should be registered 
		 */
		'public unregisterComponent' : function(_id) {
			for (var wi in this.widgets) {
				var theWidget = this.widgets[wi];
				if (_id == theWidget.getId()) this.widgets.splice(wi, 1);
			}
			for (var ii in this.interpreters) {
				var theInterpreter = this.interpreters[ii];
				if (_id == theInterpreter.getId()) this.interpreters.splice(ii, 1);
			}
			for (var ai in this.aggregators) {
				var theAggregator= this.aggregators[ai];
				if (_id == theAggregator.getId()) this.aggregators.splice(ai, 1);
			}
		},

		/**
		 * Returns the widget for the specified id.
		 * 
		 * @public
		 * @alias getWidget
		 * @memberof Discoverer#
		 * @param {string} _id id of the component that should be returned
		 * @returns {?Widget}
		 */
		'public getWidget' : function(_id) {
			for (var index in this.widgets) {
				var theWidget = this.widgets[index];
				if (theWidget.getId() == _id) return theWidget;
			}
			return null;
		},

		/**
		 * Returns the aggregator for the specified id.
		 * 
		 * @public
		 * @alias getAggregator
		 * @memberof Discoverer#
		 * @param {string} _id id of the component that should be returned
		 * @returns {Aggregator}
		 */
		'public getAggregator' : function(_id) {
			for (var index in this.aggregators) {
				var theAggregator = this.aggregators[index];
				if (theAggregator.getId() == _id) return theAggregator;
			}
			return null;
		},

		/**
		 * Returns the interpreter for the specified id.
		 * 
		 * @public
		 * @alias getInterpreter
		 * @memberof Discoverer#
		 * @param {string} _id id of the component that should be returned
		 * @returns {Interpreter}
		 */
		'public getInterpreter' : function(_id) {
			for (var index in this.interpreters) {
				var theInterpreter = this.interpreters[index];
				if (theInterpreter.getId() == _id) return theInterpreter;
			}
			return null;
		},

		/**
		 * Returns all registered components (widget, aggregator and interpreter).
		 *
		 * @public
		 * @alias getComponents
		 * @memberof Discoverer#
		 * @param {Array} _componentTypes Component types to get descriptions for. Defaults to Widget, Interpreter and Aggregator.
		 * @returns {Array}
		 */
		'public getComponents' : function(_componentTypes) {
			if (typeof _componentTypes == "undefined") _componentTypes = [Widget, Interpreter, Aggregator];
			var response = [];
			if (jQuery.inArray(Widget, _componentTypes) != -1) response = response.concat(this.widgets);
			if (jQuery.inArray(Aggregator, _componentTypes) != -1) response = response.concat(this.aggregators);
			if (jQuery.inArray(Interpreter, _componentTypes) != -1) response = response.concat(this.interpreters);
			return response;
		},


		/**
		 * Returns the instance (widget, aggregator or interpreter) for the specified id.
		 * 
		 * @public
		 * @alias getComponent
		 * @memberof Discoverer#
		 * @param {string} _id id of the component that should be returned
		 * @returns {?(Widget|Aggregator|Interpreter)}
		 */
		'public getComponent' : function(_id) {
			var component = this.getWidget(_id);
			if (component) {
				return component;
			}
			var component = this.getAggregator(_id);
			if (component) {
				return component;
			}
			var component = this.getInterpreter(_id);
			if (component) {
				return component;
			}
			return null;
		},

		/**
		 * Returns all components that have the specified attribute as
		 * outAttribute. It can be chosen between the verification of 
		 * all attributes or at least one attribute.
		 * 
		 * @public
		 * @alias getComponentsByAttributes
		 * @memberof Discoverer#
		 * @param {AttributeList} _attributeList list of searched attributes
		 * @param {boolean} _all choise of the verification mode
         * @param {Array} _componentTypes Components types to search for
		 * @returns {Array}
		 */
		'public getComponentsByAttributes' : function(_attributeList, _all, _componentTypes) {
			var componentList = [];
			var list = {};
            if (typeof _componentTypes == "undefined") _componentTypes = [Widget, Interpreter, Aggregator];
			if (_attributeList instanceof Array) {
				list = _attributeList;
			} else if (Class.isA(AttributeList, _attributeList)) {
				list = _attributeList.getItems();
			}
			if (typeof list != "undefined") {
				var components = this.getComponents(_componentTypes);
				for (var i in components) {
					var theComponent = components[i];
						if(_all && this.containsAllAttributes(theComponent, list)) {
							componentList.push(theComponent);
						} else if(!_all && this.containsAtLeastOneAttribute(theComponent, list)) {
							componentList.push(theComponent);
					}
				}
			}
			return componentList;
		},

		/***********************************************************************
		 * Helper *
		 **********************************************************************/
		/**
		 * Helper: Verifies whether a component description contains all searched attributes.
		 * 
		 * @private
		 * @alias containsAllAttributes
		 * @memberof Discoverer#
		 * @param {(WidgetDescription|InterpreterDescription)} _component description of a component
		 * @param {Array} _list searched attributes
		 * @returns {boolean}
		 */
		'private containsAllAttributes' : function(_component, _list) {
			for ( var j in _list) {
				var attribute = _list[j];
				if (!_component.doesSatisfyTypeOf(attribute)) {
					return false;
				}
			}
			return true;
		},

		/**
		 * Helper: Verifies whether a component description contains at least on searched attributes.
		 * 
		 * @private
		 * @alias containsAtLeastOneAttribute
		 * @memberof Discoverer#
		 * @param {(WidgetDescription|InterpreterDescription)} _component description of a component
		 * @param {Array} _list searched attributes
		 * @returns {boolean}
		 */
		'private containsAtLeastOneAttribute' : function(_component, _list) {
			for (var j in _list) {
				var attribute = _list[j];
				if (_component.doesSatisfyTypeOf(attribute)) {
					return true;
				}
			}
			return false;
		}
	});

	return Discoverer;
});