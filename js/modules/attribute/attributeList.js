/**
 * This module represents an AttributeList. It is a subclass of AbstractList.
 *
 * @module AttributeList
 * @fileOverview
 */
define(['easejs', 'abstractList', 'attribute', 'parameterList' ],
    function(easejs, AbstractList, Attribute, ParameterList) {
        var Class = easejs.Class;

        /**
         * @class AttributeList
         * @classdesc This class represents a list for Attribute.
         * @extends AbstractList
         * @requires easejs
         * @requires AbstractList
         * @requires Attribute
         */
        var AttributeList = Class('AttributeList').extend(AbstractList,	{
            /**
             * @alias items
             * @protected
             * @type {Array.<Attribute>}
             * @memberof AttributeList#
             * @desc ItemList
             */
            'protected items' : [],

            /**
             * Builder for item list.
             *
             * @public
             * @alias withItems
             * @memberof AttributeList#
             * @param {(AttributeList)} _attributeList AttributeList
             * @returns {AttributeList}
             */
            'public withItems' : function(_attributeList) {
                var list = [];
                if (_attributeList instanceof Array) {
                    list = _attributeList;
                } else if (Class.isA(AttributeList, _attributeList)) {
                    list = _attributeList.getItems();
                }
                this.items = list;
                return this;
            },

            /**
             * Adds the specified item to the itemList.
             *
             * @public
             * @alias put
             * @memberof AttributeList#
             * @param {AttributeType} _attribute AttributeType
             * @param {boolean} _multipleInstances
             */
            'public put' : function(_attribute, _multipleInstances) {
                _multipleInstances = typeof _multipleInstances == "undefined" ? false : _multipleInstances;
                if (Class.isA(Attribute, _attribute)) {
                    if (_multipleInstances || !(this.containsTypeOf(_attribute))) {
                        this.items.push(_attribute);
                    } else {
                        this.updateValue(_attribute);
                    }
                }
            },

            /**
             * Adds all items in the specified list to the
             * itemList.
             *
             * @public
             * @alias putAll
             * @memberof AttributeList#
             * @param {(AttributeList|Array)} _attributeList AttributeList
             */
            'public putAll' : function(_attributeList) {
                var list = [];
                if (_attributeList instanceof Array) {
                    list = _attributeList;
                } else if (Class.isA(AttributeList,	_attributeList)) {
                    list = _attributeList.getItems();
                }
                for ( var i in list) {
                    this.put(list[i]);
                }
            },

            /**
             *
             * @param {Attribute} _attribute
             * @param {?boolean} _typeOnly
             * @returns {*}
             */
            'public contains': function(_attribute, _typeOnly) {
                _typeOnly = typeof _typeOnly == "undefined" ? false : _typeOnly;
                return _typeOnly ? this.containsTypeOf(_attribute) : this.containsValueOf(_attribute);
            },

            /**
             * Verifies whether the given item is included
             * in this list.
             *
             * @public
             * @alias containsTypeOf
             * @memberof AttributeList#
             * @param {AttributeType} _attribute AttributeType that should be verified.
             * @returns {boolean}
             */
            'public containsTypeOf' : function(_attribute) {
                if (Class.isA(Attribute, _attribute)) {
                    for (var index in this.items) {
                        var tmp = this.items[index];
                        if (tmp.equalsTypeOf(_attribute)) {
                            return true;
                        }
                    }
                }
                return false;
            },

            /**
             * Verifies whether the given item is included
             * in the list.
             *
             * @public
             * @alias containsValueOf
             * @memberof AttributeList#
             * @param {Attribute} _attribute AttributeValue that should be verified.
             * @returns {boolean}
             */
            'public containsValueOf' : function(_attribute) {
                if (Class.isA(Attribute, _attribute)) {
                    for (var index in this.items) {
                        var tmp = this.items[index];
                        if (tmp.equalsValueOf(_attribute)) {
                            return true;
                        }
                    }
                }
                return false;
            },

            'public equals': function(_attributeList, _typeOnly) {
                _typeOnly = typeof _typeOnly == "undefined" ? false : _typeOnly;
                return _typeOnly ? this.equalsAllTypesOf(_attributeList) : this.equalsAllValuesOf(_attributeList);
            },

            /**
             * Compare the specified AttributeList with this instance.
             *
             * @public
             * @alias equals
             * @memberof AttributeList#
             * @param {AttributeList} _attributeList AttributeList that should be compared.
             * @returns {boolean}
             */
            'public equalsAllTypesOf' : function(_attributeList) {
                if (Class.isA(AttributeList, _attributeList)	&& _attributeList.size() == this.size()) {
                    for (var index in _attributeList.getItems()) {
                        var theAttributeType = _attributeList.getItems()[index];
                        if (!this.containsTypeOf(theAttributeType)) return false;
                    }
                    return true;
                }
                return false;
            },

            /**
             * Compare the specified AttributeList with
             * this instance.
             *
             * @public
             * @alias equals
             * @memberof AttributeList#
             * @param {AttributeList} _attributeList AttributeList that should be compared.
             * @returns {boolean}
             */
            'public equalsAllValuesOf' : function(_attributeList) {
                if (Class.isA(AttributeList, _attributeList) && _attributeList.size() == this.size()) {
                    for (var index in _attributeList.getItems()) {
                        var theAttribute = _attributeList.getItems()[index];
                        if (!this.containsValueOf(theAttribute)) return false;
                    }
                    return true;
                }
                return false;
            },

            /**
             * Returns only this values that matches to the
             * given type.
             *
             * @public
             * @alias getSubset
             * @memberof AttributeList#
             * @param {(AttributeList|Array)} _attributeList Attributes that should be returned.
             * @returns {AttributeList}
             */
            'public getSubset' : function(_attributeList) {
                var response = new AttributeList();
                var list = [];
                if (_attributeList instanceof Array) {
                    list = _attributeList;
                } else if (Class.isA(AttributeList,	_attributeList)) {
                    list = _attributeList.getItems();
                }
                for (var i in list) {
                    var attribute = list[i];
                    if (Class.isA(Attribute, attribute)) {
                        var attribute = this.getAttributeWithTypeOf(attribute);
                        if (typeof attribute != "undefined") {
                            response.put(attribute);
                        }
                    }
                }
                return response;
            },

            /**
             * Returns a subset without the given types.
             *
             * @public
             * @alias getSubsetWithoutItems
             * @memberof AttributeList#
             * @param {(AttributeList|Array)} _attributeList AttributeTypes that should not be included
             * @returns {AttributeList}
             */
            'public getSubsetWithoutItems' : function(_attributeList) {
                var response = this;
                var list = [];
                if (_attributeList instanceof Array) {
                    list = _attributeList;
                } else if (Class.isA(AttributeList,	_attributeList)) {
                    list = _attributeList.getItems();
                }
                for (var i in list) {
                    var attribute = list[i];
                    if (Class.isA(Attribute, attribute)) {
                        response.removeAttributeWithTypeOf(attribute);
                    }
                }
                return response;
            },

            /**
             * Creates a clone of the current list.
             *
             * @public
             * @alias clone
             * @memberof AttributeList#
             * @returns {AttributeList}
             */
            'public clone': function(_typeOnly) {
                var newList = new AttributeList();
                for (var index in this.items) {
                    var oldAttribute = this.items[index];
                    var newAttribute = new Attribute().withName(oldAttribute.getName()).withType(oldAttribute.getType()).withParameters(oldAttribute.getParameters());
                    if (!_typeOnly) newAttribute.setValue(oldAttribute.getValue());
                    newList.put(newAttribute);
                }
                return newList;
            },

            'public removeAttributeWithTypeOf': function(_attribute, _allOccurrences) {
                _allOccurrences = typeof _allOccurrences == "undefined" ? false : _allOccurrences;
                for (var index in this.items) {
                    var theAttribute = this.items[index];
                    if (theAttribute.equalsTypeOf(_attribute)) {
                        this.items.splice(index, 1);
                    }
                }
                if (_allOccurrences && this.contains(_attribute)) this.removeAttributeWithTypeOf(_attribute, _allOccurrences);
            },

            'public hasAttributesWithInputParameters': function() {
                for (var index in this.items) {
                    var theAttribute = this.items[index];
                    if (theAttribute.hasInputParameter()) return true;
                }
                return false;
            },

            'public getAttributesWithInputParameters': function() {
                var list = new AttributeList();
                for (var index in this.items) {
                    var theAttribute = this.items[index];
                    if (theAttribute.hasInputParameter()) list.put(theAttribute);
                }
                return list;
            },

            /**
             * Returns the attribute value that matches the provided attribute type.
             *
             * @public
             * @alias getValueForAttributeWithTypeOf
             * @memberof AttributeList#
             * @param {AttributeType} _attribute
             * @returns {Attribute}
             */
            'public getValueForAttributeWithTypeOf': function(_attribute) {
                return this.getAttributeWithTypeOf(_attribute).getValue();
            },

            'public getAttributeWithTypeOf': function(_attribute) {
                for (var index in this.getItems()) {
                    var theAttribute = this.getItems()[index];
                    if (theAttribute.equalsTypeOf(_attribute)) return theAttribute;
                }
            },

            'public updateValue': function(_attribute) {
                for (var index in this.items) {
                    var theAttribute = this.items[index];
                    if (theAttribute.equalsTypeOf(_attribute)) this.items[index] = _attribute;
                }
            }

        });

        return AttributeList;
});