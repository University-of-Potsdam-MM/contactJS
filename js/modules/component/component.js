/**
 * Created by tobias on 30.03.15.
 */
define(['contextInformationList'],
    function(ContextInformationList) {
        return (function() {

            Component.lastLogId = "";

            /**
            *
            * @returns {Component}
            * @class Component
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
                 * All available contextual information and their values.
                 *
                 * @type {ContextInformationList}
                 * @private
                 */
                this._outContextInformation = new ContextInformationList();

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
             * Returns the available contextual information.
             *
             * @param {?ContextInformationList} [contextInformationList]
             * @returns {ContextInformationList}
             */
            Component.prototype.getOutContextInformation = function(contextInformationList) {
                // test if contextual information is a list
                if (contextInformationList && contextInformationList instanceof ContextInformationList) {
                    return this._outContextInformation.getSubset(contextInformationList);
                } else {
                    return this._outContextInformation;
                }
            };

            /**
             * Adds an output contextual information.
             *
             * @param {ContextInformation} contextInformation
             * @protected
             */
            Component.prototype._addOutContextInformation = function(contextInformation) {
                this._outContextInformation.put(contextInformation);
            };

            /**
             * Sets an output contextual information.
             *
             * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray The contextual information to set.
             * @protected
             */
            Component.prototype._setOutContextInformation = function(contextInformationListOrArray) {
                this._outContextInformation = new ContextInformationList().withItems(contextInformationListOrArray);
            };

            /**
             * Verifies whether the specified contextual information is a provided contextual information.
             *
             * @param {ContextInformation} contextInformation
             * @returns {Boolean}
             * @protected
             */
            Component.prototype._isOutContextInformation = function(contextInformation) {
                return !!this._outContextInformation.containsKindOf(contextInformation);
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
             * @protected
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

            /**
             *
             * @param {ContextInformation} contextInformation
             * @returns {boolean}
             */
            Component.prototype.doesSatisfyKindOf = function(contextInformation) {
                return this._outContextInformation.containsKindOf(contextInformation);
            };

            /*** Helper ***/

            /**
             * Returns the current time.
             *
             * @returns {Date}
             */
            Component.prototype.getCurrentTime = function() {
                return new Date();
            };

            return Component;
        })();
    }
);