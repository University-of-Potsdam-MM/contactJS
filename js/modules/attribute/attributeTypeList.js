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
			 * @alias counter
			 * @protected
			 * @type {integer}
			 * @memberof AttributeTypeList#
			 * @desc Number of items.
			 */
			'protected counter' : 0,
			/**
			 * @alias items
			 * @protected
			 * @type {AttributeTypeList}
			 * @memberof AttributeTypeList#
			 * @desc ItemList
			 */
			'protected items' : {},

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
				var list = {};
				if (_attributeTypeList instanceof Array) {
					list = _attributeTypeList;
				} else if (Class.isA(AttributeTypeList, _attributeTypeList)) {
					list = _attributeTypeList.getItems();
				}
				for ( var i in list) {
					var attributeType = list[i];
					if (Class.isA(AttributeType, attributeType)) {
						this.items[attributeType.getIdentifier()] = attributeType;
						this.counter++;
					}
				}
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
			'public put' : function(_attributeType) {
				if (Class.isA(AttributeType, _attributeType)) {
					if (!(this.containsKey(_attributeType.getIdentifier()))) {
						this.counter++;
					}
					this.items[_attributeType.getIdentifier()] = _attributeType;
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
					var attributeType = list[i];
					if (Class.isA(AttributeType, attributeType)) {						
						if (!(this.containsKey(attributeType.getIdentifier()))) {
							this.counter++;
						}
						this.items[attributeType.getIdentifier()] = attributeType;
					}
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
					var tmp = this.getItem(_item.getIdentifier());
					if (!(typeof tmp === 'undefined')
							&& tmp.equals(_item)) {
						return true;
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
					var items = _list.getItems();
					for (var i in items) {
						var item = items[i];
						if (!this.contains(item)) {
							return false;
						}
					}
					return true;
				}
				return false;
			},

            /**
             * Returns the attribute type that matches the provided identifier.
             * @public
			 * @override
             * @alias getItem
             * @memberof AttributeTypeList#
             * @param {string} _identifier The identifier that should be searched for.
             * @returns {AttributeType}
             */
            'override public getItem' : function(_identifier) {
                return this.items[_identifier];
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
            }
        });

		return AttributeTypeList;
	});