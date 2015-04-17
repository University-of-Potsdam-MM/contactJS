/**
 * This module represents an AttributeTypeList. It is a subclass of AbstractList.
 * 
 * @module AttributeTypeList
 * @fileOverview
 */
define([ 'easejs', 'abstractList', 'attributeType', 'parameterList' ],
	function(easejs, AbstractList, AttributeType, ParameterList) {
		var Class = easejs.Class;
		/**
		 * @class AttributeTypeList
		 * @classdesc This class represents a list for AttributeType.
		 * @extends AbstractList
		 * @requires easejs
		 * @requires AbstractList
		 * @requires AttributeType
		 */
		var AttributeTypeList = Class('AttributeTypeList').extend(AbstractList,	{

			/**
			 * @alias items
			 * @protected
			 * @type {AttributeTypeList}
			 * @memberof AttributeTypeList#
			 * @desc ItemList
			 */
			'protected items' : [],

			/**
			 * Builder for item list.
			 * 
			 * @public
			 * @alias withItems
			 * @memberof AttributeTypeList#
			 * @param {(AttributeTypeList)} _attributeTypeList AttributeTypeList
			 * @returns {AttributeTypeList}
			 */
			'public withItems' : function(_attributeTypeList) {
				var list = [];
				if (_attributeTypeList instanceof Array) {
					list = _attributeTypeList;
				} else if (Class.isA(AttributeTypeList, _attributeTypeList)) {
					list = _attributeTypeList.getItems();
				}
				this.items = list;
				return this;
			},

			/**
			 * Adds the specified item to the itemList.
			 * 
			 * @public
			 * @alias put
			 * @memberof AttributeTypeList#
			 * @param {AttributeType} _attributeType AttributeType
			 */
			'public put' : function(_attributeType, _multipleInstances) {
				var _multipleInstances = typeof _multipleInstances == "undefined" ? false : _multipleInstances;
				if (Class.isA(AttributeType, _attributeType)) {
					if (_multipleInstances || !(this.contains(_attributeType))) {
						this.items.push(_attributeType);
					}
				}
			},

			/**
			 * Adds all items in the specified list to the
			 * itemList.
			 * 
			 * @public
			 * @alias putAll
			 * @memberof AttributeTypeList#
			 * @param {(AttributeTypeList|Array)} _attributeTypeList AttributeTypeList
			 */
			'public putAll' : function(_attributeTypeList) {
				var list = [];
				if (_attributeTypeList instanceof Array) {
					list = _attributeTypeList;
				} else if (Class.isA(AttributeTypeList,	_attributeTypeList)) {
					list = _attributeTypeList.getItems();
				}
				for ( var i in list) {
					this.put(list[i]);
				}
			},

			/**
			 * Verifies whether the given item is included
			 * in this list.
			 * 
			 * @public
			 * @alias contains
			 * @memberof AttributeTypeList#
			 * @param {AttributeType} _item AttributeType that should be verified.
			 * @returns {boolean}
			 */
			'public contains' : function(_item) {
				if (Class.isA(AttributeType, _item)) {
					for (var index in this.items) {
						var tmp = this.items[index];
						if (tmp.equals(_item)) {
							return true;
						}
					}
				}
				return false;
			},


			/**
			 * Compare the specified AttributeTypeList with this instance.
			 * 
			 * @public
			 * @alias equals
			 * @memberof AttributeTypeList#
			 * @param {AttributeTypeList} _list AttributeTypeList that should be compared.
			 * @returns {boolean}
			 */
			'public equals' : function(_list) {
				if (Class.isA(AttributeTypeList, _list)	&& _list.size() == this.size()) {
					for (var index in _list.getItems()) {
						var theAttributeType = _list.getItems()[index];
						if (!this.contains(theAttributeType)) return false;
					}
					return true;
				}
				return false;
			},

			/**
			 * Creates a clone of the current list.
			 *
			 * @public
			 * @alias clone
			 * @memberof AttributeTypeList#
			 * @returns {AttributeTypeList}
			 */
            'public clone': function() {
                var newList = new AttributeTypeList();
                for (var index in this.items) {
                    var oldAttributeType = this.items[index];
                    var newAttributeType = new AttributeType().
                        withName(oldAttributeType.getName()).
                        withType(oldAttributeType.getType()).
                        withParameters(oldAttributeType.getParameters());
                    newList.put(newAttributeType);
                }
                return newList;
            },

			'public removeAttributeType': function(_attributeType, _allOccurrences) {
				_allOccurrences = typeof _allOccurrences == "undefined" ? false : _allOccurrences;
				for (var index in this.items) {
					var theAttributeType = this.items[index];
					if (theAttributeType.equals(_attributeType)) {
						this.items.splice(index, 1);
					}
				}
				if (_allOccurrences && this.contains(_attributeType)) this.removeAttributeType(_attributeType, _allOccurrences);
			},

			'public hasAttributesWithInputParameters': function() {
				for (var index in this.items) {
					var theAttributeType = this.items[index];
					if (theAttributeType.hasInputParameter()) return true;
				}
				return false;
			},

			'public getAttributesWithInputParameters': function() {
				var list = new AttributeTypeList();
				for (var index in this.items) {
					var theAttributeType = this.items[index];
					if (theAttributeType.hasInputParameter()) list.put(theAttributeType);
				}
				return list;
			}
        });

		return AttributeTypeList;
	});