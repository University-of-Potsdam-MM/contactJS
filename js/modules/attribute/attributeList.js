/**
 * @module Attribute
 */
define(['abstractList', 'attribute'], function(AbstractList, Attribute) {
    return (function() {
        /**
         * @class
         * @classdesc This class represents a list for Attribute.
         * @extends AbstractList
         * @constructs AttributeList
         */
        function AttributeList() {
            AbstractList.call(this);
            this._type = Attribute;
            return this;
        }

        AttributeList.prototype = Object.create(AbstractList.prototype);
        AttributeList.prototype.constructor = AttributeList;

        /**
         * Create an AttributeList from the description provided by a Widget or Interpreter.
         *
         * @static
         * @param {Discoverer} discoverer
         * @param {Array} attributeDescriptions
         * @returns {AttributeList}
         */
        AttributeList.fromAttributeDescriptions = function(discoverer, attributeDescriptions) {
            var theAttributeList = new AttributeList();
            for(var attributeDescriptionIndex in attributeDescriptions) {
                theAttributeList.put(Attribute.fromAttributeDescription(discoverer, attributeDescriptions[attributeDescriptionIndex]));
            }
            return theAttributeList;
        };

        /**
         * Creates an attribute list from an array of attribute names.
         *
         * @param {Discoverer} discoverer
         * @param {Array<String>} attributeNames
         * @returns {AttributeList}
         */
        AttributeList.fromAttributeNames = function(discoverer, attributeNames) {
            var theAttributeList = new AttributeList();
            var possibleAttributes = discoverer.getPossibleAttributes();

            for (var attributeNameIndex in attributeNames) {
                var theAttributeName = attributeNames[attributeNameIndex];
                theAttributeList.put(possibleAttributes._getAttributeWithName(theAttributeName));
            }

            return theAttributeList;
        };

        /**
         * Adds the specified item to the itemList.
         *
         * @public
         * @param {Attribute} attribute AttributeType
         * @param {Boolean} [multipleInstances=false]
         */

        AttributeList.prototype.put = function(attribute, multipleInstances) {
            multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
            if (attribute instanceof this._type) {
                if (multipleInstances || !(this.containsTypeOf(attribute))) {
                    this._items.push(attribute);
                } else {
                    this.updateValue(attribute);
                }
            }
        };

        /**
         * Adds all items in the specified list to the
         * itemList.
         *
         * @public
         * @param {(AttributeList|Array)} attributeList AttributeList
         */
        AttributeList.prototype.putAll = function(attributeList) {
            var list = [];
            if (attributeList instanceof Array) {
                list = attributeList;
            } else if (attributeList.constructor === AttributeList) {
                list = attributeList.getItems();
            }
            for ( var i in list) {
                this.put(list[i]);
            }
        };

        AttributeList.prototype.putIfTypeNotContained = function(attribute) {
            if (!this.containsTypeOf(attribute)) this.put(attribute);
        };

        /**
         *
         * @deprecated Use containsTypeOf or containsValueOf instead.
         * @param {Attribute} attribute
         * @param {?Boolean} typeOnly
         * @returns {Boolean}
         */
        AttributeList.prototype.contains = function(attribute, typeOnly) {
            typeOnly = typeof typeOnly == "undefined" ? false : typeOnly;
            return typeOnly ? this.containsTypeOf(attribute) : this.containsValueOf(attribute);
        };

        /**
         * Verifies whether an attribute with the type of the given item is included in this list.
         *
         * @param {Attribute} attribute AttributeType that should be verified.
         * @returns {Boolean}
         */
        AttributeList.prototype.containsTypeOf = function(attribute) {
            if (attribute.constructor === Attribute) {
                for (var index in this.getItems()) {
                    var theAttribute = this.getItems()[index];
                    if (theAttribute.equalsTypeOf(attribute)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Verifies whether the given item is included in the list.
         *
         * @param {Attribute} attribute AttributeValue that should be verified.
         * @returns {Boolean}
         */
        AttributeList.prototype.containsValueOf = function(attribute) {
            if (attribute.constructor === Attribute) {
                for (var index in this._items) {
                    var theAttribute = this._items[index];
                    if (theAttribute.equalsValueOf(attribute)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         *
         * @deprecated Use equalsTypesIn or equalsValuesIn instead.
         * @param {AttributeList} attributeList
         * @param {Boolean} typeOnly
         * @returns {Boolean}
         */
        AttributeList.prototype.equals = function(attributeList, typeOnly) {
            typeOnly = typeof typeOnly == "undefined" ? false : typeOnly;
            return typeOnly ? this.equalsTypesIn(attributeList) : this.equalsValuesIn(attributeList);
        };

        /**
         * Compare the specified AttributeList with this instance.
         *
         * @param {AttributeList} attributeList AttributeList that should be compared.
         * @returns {boolean}
         */
        AttributeList.prototype.equalsTypesIn = function(attributeList) {
            if (attributeList.constructor === AttributeList  && attributeList.size() == this.size()) {
                for (var index in attributeList.getItems()) {
                    var theAttribute = attributeList.getItems()[index];
                    if (!this.containsTypeOf(theAttribute)) return false;
                }
                return true;
            }
            return false;
        };

        /**
         * Compare the specified AttributeList with this instance.
         *
         * @param {AttributeList} attributeList AttributeList that should be compared.
         * @returns {boolean}
         */
        AttributeList.prototype.equalsValuesIn = function(attributeList) {
            if (attributeList.constructor === AttributeList && attributeList.size() == this.size()) {
                for (var index in attributeList.getItems()) {
                    var theAttribute = attributeList.getItems()[index];
                    if (!this.containsValueOf(theAttribute)) return false;
                }
                return true;
            }
            return false;
        };

        /**
         *
         * @param {String} attributeName
         * @returns {?Attribute}
         * @private
         */
        AttributeList.prototype._getAttributeWithName = function(attributeName) {
            for (var index in this._items) {
                var theAttribute = this._items[index];
                if (theAttribute.getName() == attributeName) return theAttribute;
            }
            return null;
        };

        /**
         * Returns only this values that matches to the given type.
         *
         * @param {(AttributeList|Array)} attributeList Attributes that should be returned.
         * @returns {AttributeList}
         */
        AttributeList.prototype.getSubset = function(attributeList) {
            var response = new AttributeList();
            var list = [];
            if (attributeList instanceof Array) {
                list = attributeList;
            } else if (attributeList instanceof AttributeList) {
                list = attributeList.getItems();
            }
            for (var i in list) {
                var theAttribute = list[i];
                if (theAttribute.constructor === Attribute) {
                    var responseAttribute = this.getAttributeWithTypeOf(theAttribute);
                    if (typeof responseAttribute != "undefined") {
                        response.put(responseAttribute);
                    }
                }
            }
            return response;
        };

        /**
         * Returns a subset without the given types.
         *
         * @param {(AttributeList|Array)} attributeList Attributes to be excluded
         * @returns {AttributeList}
         */
        AttributeList.prototype.getSubsetWithoutItems = function(attributeList) {
            var response = this;
            var list = [];
            if (attributeList instanceof Array) {
                list = attributeList;
            } else if (attributeList.constructor === AttributeList) {
                list = attributeList.getItems();
            }
            for (var i in list) {
                var attribute = list[i];
                if (attribute.constructor === Attribute) {
                    response.removeAttributeWithTypeOf(attribute);
                }
            }
            return response;
        };

        /**
         * Creates a clone of the current list.
         *
         * @param {Boolean} typeOnly
         * @returns {AttributeList}
         */
        AttributeList.prototype.clone = function(typeOnly) {
            var newList = new AttributeList();
            for (var index in this._items) {
                var oldAttribute = this._items[index];
                var newAttribute = new Attribute(true)
                    .withName(oldAttribute.getName())
                    .withType(oldAttribute.getType())
                    .withParameters(oldAttribute.getParameters())
                    .withSynonyms(oldAttribute.getSynonyms());
                if (!typeOnly) newAttribute.setValue(oldAttribute.getValue());
                newList.put(newAttribute);
            }
            return newList;
        };

        /**
         *
         * @param {Attribute} attribute
         * @param {Boolean} allOccurrences
         */
        AttributeList.prototype.removeAttributeWithTypeOf = function(attribute, allOccurrences) {
            allOccurrences = typeof allOccurrences == "undefined" ? false : allOccurrences;
            for (var index in this._items) {
                var theAttribute = this._items[index];
                if (theAttribute.equalsTypeOf(attribute)) {
                    this._items.splice(index, 1);
                }
            }
            if (allOccurrences && this.contains(attribute)) this.removeAttributeWithTypeOf(attribute, allOccurrences);
        };

        /**
         *
         * @returns {boolean}
         */
        AttributeList.prototype.hasAttributesWithInputParameters = function() {
            for (var index in this._items) {
                var theAttribute = this._items[index];
                if (theAttribute.hasInputParameter()) return true;
            }
            return false;
        };

        /**
         *
         * @returns {AttributeList}
         */
        AttributeList.prototype.getAttributesWithInputParameters = function() {
            var list = new AttributeList();
            for (var index in this._items) {
                var theAttribute = this._items[index];
                if (theAttribute.hasInputParameter()) list.put(theAttribute);
            }
            return list;
        };

        /**
         * Returns the attribute value that matches the provided attribute type.
         *
         * @param {Attribute} attribute
         * @returns {String}
         */
        AttributeList.prototype.getValueForAttributeWithTypeOf = function(attribute) {
            return this.getAttributeWithTypeOf(attribute).getValue();
        };

        /**
         *
         * @param {Attribute} attribute
         * @returns {Attribute}
         */
        AttributeList.prototype.getAttributeWithTypeOf = function(attribute) {
            for (var index in this.getItems()) {
                var theAttribute = this.getItems()[index];
                if (theAttribute.equalsTypeOf(attribute)) return theAttribute;
            }
        };

        /**
         *
         * @param {Attribute} attribute
         */
        AttributeList.prototype.updateValue = function(attribute) {
            for (var index in this._items) {
                var theAttribute = this._items[index];
                if (theAttribute.equalsTypeOf(attribute)) this._items[index] = attribute;
            }
        };

        return AttributeList;
    })();
});