/**
 * Created by tobias on 30.03.15.
 */
define(['attributeList'],
    function(AttributeList) {
        return (function() {

            Component.lastLogId = "";

            /**
            *
            * @returns {Component}
            * @constructs Component
            */
            function Component(discoverer) {
                /**
                 * the name of the component.
                 *
                 * @type {string}
                 * @private
                 */
                this._name = 'Component';

                /**
                 * The uuid of the object.
                 *
                 * @type {string}
                 * @private
                 */
                this._id  = Math.uuid();

                /**
                 * All available Attributes and their values.
                 *
                 * @type {AttributeList}
                 * @private
                 */
                this._outAttributes = new AttributeList();

                /**
                 * Associated discoverer.
                 *
                 * @type {Discoverer}
                 * @private
                 */
                this._discoverer = discoverer;

                return this;
            }

            /**
            * Returns the name of the object.
            *
            * @returns {string}
            */
            Component.prototype.getName = function() {
               return this._name;
            };

            /**
            * Sets the name of the component if it wasn't set before.
            *
            * @param {string} name Name of the component.
            */
            Component.prototype.setName = function(name) {
               if (typeof this._name == "undefined" && typeof name === 'string') {
                   this._name = name;
               }
            };

            /**
            * Returns the id of the object.
            *
            * @returns {string}
            */
            Component.prototype.getId = function() {
               return this._id;
            };

            /**
             * Returns the available AttributeTypes.
             *
             * @param {?AttributeList} [attributes]
             * @returns {AttributeList}
             */
            Component.prototype.getOutAttributes = function(attributes) {
                // test if attributeList is a list
                if (attributes && attributes instanceof AttributeList) {
                    return this._outAttributes.getSubset(attributes);
                } else {
                    return this._outAttributes;
                }
            };

            /**
             * Adds an outAttribute.
             *
             * @param {Attribute} attribute
             * @protected
             */
            Component.prototype._setOutAttribute = function(attribute) {
                this._outAttributes.put(attribute);
            };

            /**
             * Sets an outAttributes.
             *
             * @param {(AttributeList|Array)} attributesOrArray Attributes to set.
             * @protected
             */
            Component.prototype._setOutAttributes = function(attributesOrArray) {
                this._outAttributes = new AttributeList().withItems(attributesOrArray);
            };

            /**
             * Verifies whether the specified attribute is a provided Attribute.
             *
             * @param {Attribute} attribute
             * @returns {Boolean}
             * @protected
             */
            Component.prototype._isOutAttribute = function(attribute) {
                return !!this._outAttributes.containsTypeOf(attribute);
            };

            /**
             * Sets and registers to the associated Discoverer.
             *
             * @param {Discoverer} _discoverer Discoverer
             */
            Component.prototype.setDiscoverer = function(_discoverer) {
                if (!this._discoverer) {
                    this._discoverer = _discoverer;
                    this._register();
                }
            };

            /**
             * Registers the component to the associated Discoverer.
             *
             * @private
             */
            Component.prototype._register = function() {
                if (this._discoverer) {
                    this._discoverer.registerNewComponent(this);
                }
            };

            /**
             * Create a log message.
             *
             * @param {string} string
             */
            Component.prototype.log = function(string) {
               if (Component.lastLogId != this.getId())
                   console.log(this.getName()+" ("+this.getId()+") "+string);
               else
                   console.log(this.getName()+" (...) "+string);
               Component.lastLogId = this.getId();
            };

            return Component;
        })();
    }
);