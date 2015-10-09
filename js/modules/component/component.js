/**
 * Created by tobias on 30.03.15.
 */
define(['data', 'dataList'],
    function(Data, DataList) {
        return (function() {

            Component.lastLogId = "";

            Component.description = {
                out: [
                    {
                        "name":"",
                        "type":""
                    }
                ],
                requiredObjects: []
            };

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
                 * @type {DataList}
                 * @protected
                 */
                this._outputData = new DataList();

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
             * @param {?DataList} [dataList]
             * @returns {DataList}
             */
            Component.prototype.getOutputData = function(dataList) {
                // test if contextual information is a list
                if (dataList && dataList instanceof DataList) {
                    return this._outputData.getSubset(dataList);
                } else {
                    return this._outputData;
                }
            };

            /**
             * Sets the output data.
             *
             * @param {DataList} dataList The data to be set.
             * @protected
             */
            Component.prototype._setOutputData = function(dataList) {
                this._outputData = dataList;
            };

            /**
             *
             * @param data
             * @param multipleInstances
             */
            Component.prototype.addOutputData = function(data, multipleInstances) {
                this.log("will add or update "+data+".");
                multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
                data.setTimestamp(this.getCurrentTime());
                if (data instanceof Data) {
                    this._outputData.put(data, multipleInstances);
                }
            };

            /**
             * Verifies whether the specified data is provided by the component.
             *
             * @param {Data} data
             * @returns {Boolean}
             * @protected
             */
            Component.prototype._isOutputData = function(data) {
                return !!this._outputData.containsKindOf(data);
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
             * @param {Data} data
             * @returns {boolean}
             */
            Component.prototype.doesSatisfyKindOf = function(data) {
                return this._outputData.containsKindOf(data);
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