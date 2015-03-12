/**
 * This module representing a Context Discoverer.
 * 
 * @module Discoverer
 * @fileOverview
 */
define([ 'easejs', 'attributeTypeList', 'widget', 'interpreter', 'aggregator' ], function(easejs,
		AttributeTypeList, Widget, Interpreter, Aggregator) {
	var Class = easejs.Class;
	
	var Discoverer = Class('Discoverer', {

		/**
		 * @alias widgets
		 * @private
		 * @type {Array}
		 * @memberof Discoverer#
		 * @desc List of available Widgets.
		 */
		'private widgets' : [],
		
		/**
		 * @alias aggregators
		 * @private
		 * @type {Array}
		 * @memberof Discoverer#
		 * @desc List of available Aggregators.
		 */
		'private aggregators' : [],
		
		/**
		 * @alias interpreter
		 * @private
		 * @type {Array}
		 * @memberof Discoverer#
		 * @desc List of available Interpreter.
		 */
		'private interpreter' : [],

		/**
		 * Constructor: All known components given in the associated functions will be registered as startup.
		 * 
		 * @class Discoverer
		 * @classdesc The Discoverer handles requests for components and attributes. 
		 * @requires easejs
		 * @requires AttributeTypeList
		 * @constructs Discoverer
		 */
		'public __construct' : function() {
			this.register();
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

		/*
		 * single call for registering the different categories of components
		 */
		/**
		 * Single call for registration of the different categories of components.
		 * Calls: registerWidgets(), registerAggregators(), registerInterpreter()
		 * 
		 * @private
		 * @alias register
		 * @memberof Discoverer#
		 */
		'private register' : function() {
			this.registerWidgets();
			this.registerAggregators();
			this.registerInterpreter();
		},

		/**
		 * Registers all specified widgets.
		 * 
		 * @private
		 * @alias registerWidgets
		 * @memberof Discoverer#
		 */
		'private registerWidgets' : function() {
		},

		/**
		 * Registers all specified aggregators.
		 * 
		 * @private
		 * @alias registerAggregators
		 * @memberof Discoverer#
		 */
		'private registerAggregators' : function() {
		},

		/**
		 * Registers all specified interpreters.
		 * 
		 * @private
		 * @alias registerInterpreter
		 * @memberof Discoverer#
		 */
		'private registerInterpreter' : function() {
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
			var category = this.identificationHelper(_component);			
			if (category) {
				this.registryHelper(category, _component);
			}
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
			var component = this.getComponent(_id);
			var category = this.identificationHelper(component);
			if (category) {
				category.splice(_id, 1);
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
			var widget =  this.widgets[_id];
			if(!widget){
				this.widgets.splice(_id, 1);
				return null;
			}
			return widget;
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
			var aggregator = this.aggregators[_id];
			if(!aggregator ){
				this.aggregators.splice(_id, 1);
				return null;
			}
			return aggregator;
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
			var interpret = this.interpreter[_id];
			if(!interpret){
				this.interpreter.splice(_id, 1);
				return null;
			}
			return interpret;
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
		 * Returns the description of all registered widgets.
		 * 
		 * @public
		 * @alias getWidgetDescriptions
		 * @memberof Discoverer#
		 * @returns {Array}
		 */
		'private getWidgetDescriptions' : function() {
			var widgetDescription = [];
			var widgets = this.widgets;
			for (var i in widgets) {
				var singleWidget = widgets[i];
				widgetDescription.push(singleWidget.getDescription());
			}
			return widgetDescription;
		},

		/**
		 * Returns the description of all registered aggregators.
		 * 
		 * @public
		 * @alias getAggregatorDescriptions
		 * @memberof Discoverer#
		 * @returns {Array}
		 */
		'private getAggregatorDescriptions' : function() {
			var aggregatorDescription = [];
			var aggregators = this.aggregators;
			for (var i in aggregators) {
				var singleAggregator = aggregators[i];
				aggregatorDescription.push(singleAggregator.getDescription());
			}
			return aggregatorDescription;
		},

		/**
		 * Returns the description of all registered interpreter.
		 * 
		 * @public
		 * @alias getInterpreterDescriptions
		 * @memberof Discoverer#
		 * @returns {Array}
		 */
		'private getInterpreterDescriptions' : function() {
			var interpreterDescription = [];
			var interpreters = this.interpreter;
			for ( var i in interpreters) {
				var singleInterpreter = interpreters[i];
				interpreterDescription.push(singleInterpreter.getDescription());
			}
			return interpreterDescription;
		},

		/**
		 * Returns the description of all registered components (widget, aggregator and interpreter).
		 * 
		 * @public
		 * @alias getDescriptions
		 * @memberof Discoverer#
         * @param {Array} _componentTypes Component types to get descriptions for. Defaults to Widget, Interpreter and Aggregator.
		 * @returns {Array}
		 */
		'public getDescriptions' : function(_componentTypes) {
            if (typeof _componentTypes == "undefined") _componentTypes = [Widget, Interpreter, Aggregator];
			var response = [];
			if (jQuery.inArray(Widget, _componentTypes) != -1) response = response.concat(this.getWidgetDescriptions());
            if (jQuery.inArray(Aggregator, _componentTypes) != -1) response = response.concat(this.getAggregatorDescriptions());
            if (jQuery.inArray(Interpreter, _componentTypes) != -1) response = response.concat(this.getInterpreterDescriptions());
			return response;
		},

		/**
		 * Returns all components that have the specified attribute as
		 * outAttribute. It can be chosen between the verification of 
		 * all attributes or at least one attribute.
		 * 
		 * @public
		 * @alias getComponentsByAttributes
		 * @memberof Discoverer#
		 * @param {(AttributeTypeList|Array)} _attributeTypeList list of searched attributes
		 * @param {boolean} _all choise of the verification mode
         * @param {Array} _componentTypes Components types to search for
		 * @returns {Array}
		 */
		'public getComponentsByAttributes' : function(_attributeTypeList, _all, _componentTypes) {
			var componentList = [];
			var list = [];
            if (typeof _componentTypes == "undefined") _componentTypes = [Widget, Interpreter, Aggregator];
			if (_attributeTypeList instanceof Array) {
				list = _attributeTypeList;
			} else if (Class.isA(AttributeTypeList, _attributeTypeList)) {
				list = _attributeTypeList.getItems();
			}
			if (list) {
				var descriptions = this.getDescriptions(_componentTypes);
				for (var i in descriptions) {
					var description = descriptions[i];
						if(_all && this.containsAllAttributes(description, list)){
							componentList.push(this.getComponent(description.getId()));
						} else if(!_all && this.containsAtLeastOneAttribute(description, list)){
							componentList.push(this.getComponent(description.getId()));
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
		 * @param {(WidgetDescription|InterpreterDescription)} _description description of a component
		 * @param {Array} _list searched attributes
		 * @returns {boolean}
		 */
		'private containsAllAttributes' : function(_description,_list) {
			for ( var j in _list) {
				var attribute = _list[j];
				if (!_description.getOutAttributeTypes().contains(attribute)) {
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
		 * @param {(WidgetDescription|InterpreterDescription)} _description description of a component
		 * @param {Array} _list searched attributes
		 * @returns {boolean}
		 */
		'private containsAtLeastOneAttribute' : function(_description,_list) {
			for ( var j in _list) {
				var attribute = _list[j];
				if (_description.getOutAttributeTypes().contains(attribute)) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Helper: Saves the given component in the category list.
		 * 
		 * @private
		 * @alias registryHelper
		 * @memberof Discoverer#
		 * @param {string} _category category of component to register
		 * @param {(Widget|Aggregator|Interpreter)} _component component that should be registered
		 */
		'private registryHelper' : function(_category, _component) {
			_category[_component.getId()] = _component;
		},

		/*
		 * identifies the category of an instance widgets, aggregators,
		 * interpreter are currently supported
		 */
		/**
		 * Helper: Identifies the category of an instance. Widgets, aggregators,
		 * interpreter are currently supported.
		 * 
		 * @private
		 * @alias identificationHelper
		 * @memberof Discoverer#
		 * @param {(Widget|Aggregator|Interpreter)} _component that should be identified
		 */
		'private identificationHelper' : function(_component) {
			if (_component.getType() == 'Widget') {
				return this.widgets;
			} else if (_component.getType() == 'Aggregator') {
				return this.aggregators;
			} else if (_component.getType() == 'Interpreter') {
				return this.interpreter;
			} else {
				return null;
			}
		}

	});

	return Discoverer;
});