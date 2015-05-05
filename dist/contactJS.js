(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['easejs', 'jquery', 'MathUuid'],factory);
  } else {
    	root.contactJS = factory(root.easejs, root.$, root.MathUuid);
  }
}(this, function(easejs, $, MathUuid) {/**
 * almond 0.1.2 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice,
        main, req;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {},
            nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part;

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            return true;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    main = function (name, deps, callback, relName) {
        var args = [],
            usingExports,
            cjsModule, depName, ret, map, i;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i++) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name],
                        config: makeConfig(name)
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else if (!defining[depName]) {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                    cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync) {
        if (typeof deps === "string") {
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("../libs/almond/almond", function(){});

/**
 * This module represents a RetrievalResult.
 * It contains the data that were retrieved from the database
 * 
 * @module RetrievalResult
 * @fileOverview
 */
define('retrievalResult',['easejs'],
    function(easejs){
    	var Class = easejs.Class;
    	/**
    	 * @class RetrievalResult
    	 * @classdesc Contains the data that were retrieved from the database.
    	 * @requires easejs
    	 */
		var RetrievalResult = Class('RetrievalResult',{
			
			/**
			 * @alias name
			 * @private
			 * @type {string}
			 * @memberof RetrievalResult#
			 * @desc Name of the retrieved Attribute.
			 */
			'private name' : '', 
			/**
			 * @alias timestamp
			 * @private
			 * @type {date}
			 * @memberof RetrievalResult#
			 * @desc Time of the retrieval.
			 */
			'private timestamp' : '',
			/**
			 * @alias values
			 * @private
			 * @type {AttributeValueList}
			 * @memberof RetrievalResult#
			 * @desc Retrieved Attributes.
			 */
			'private values' : [],
				
			/**
			 * Builder for name.
			 * 
			 * @public
			 * @alias withName
			 * @memberof RetrievalResult#
			 * @param {String} _name name
			 * @returns {RetrievalResult}
			 */
    		'public withName' : function(_name){
    			this.setName(_name);
    			return this;
    		},

    		/**
			 * Builder for timestamp.
			 * 
			 * @public
			 * @alias withTimestamp
			 * @memberof RetrievalResult#
			 * @param {String} _timestamp timestamp
			 * @returns {RetrievalResult}
			 */
    		'public withTimestamp' : function(_timestamp){
    			this.setTimestamp(_timestamp);
    			return this;
    		},

    		/**
			 * Builder for values.
			 * 
			 * @public
			 * @alias withValues
			 * @memberof RetrievalResult#
			 * @param {Array} _values values
			 * @returns {RetrievalResult}
			 */
    		'public withValues' : function(_values){
    			this.setValues(_values);
    			return this;
    		},
    		
    		/**
    		 * Returns the Attribute name.
    		 * 
    		 * @public
    		 * @alias getName
    		 * @memberof RetrievalResult#
    		 * @returns {string}
    		 */
			'public getName' : function(){
				return this.name;
			},
			
			/**
			 * Returns the retrieval time.
			 * 
			 * @public
			 * @alias getTimestamp
			 * @memberof RetrievalResult#
			 * @returns {date}
			 */
			'public getTimestamp' : function(){
				return this.timestamp;
			},
			
			/**
			 * Returns the retrieved Attributes.
			 * 
			 * @public
			 * @alias getValues
			 * @memberof RetrievalResult#
			 * @returns {Array}
			 */
			'public getValues' : function(){
				return this.values;
			},

			/**
    		 * Sets the Attribute name.
    		 * 
    		 * @public
    		 * @alias setName
    		 * @memberof RetrievalResult#
    		 * @param {string} _name Name of the retrieved Attribute.
    		 */
			'public setName' : function(_name){
				if(typeof _name === 'string'){
					this.name = _name;
				}
			},

			/**
    		 * Sets the retrieval time.
    		 * 
    		 * @public
    		 * @alias setTimestamp
    		 * @memberof RetrievalResult#
    		 * @param {date} _timstamp Retrieval time.
    		 */
			'public setTimestamp' : function(_timesstamp){
				if(_timesstamp instanceof Date){
					this.type = _timesstamp;
				}
			},
			
			/**
    		 * Sets the retrieved values.
    		 * 
    		 * @public
    		 * @alias setValues
    		 * @memberof RetrievalResult#
    		 * @param {Array} _values Retrieved Attributes.
    		 */
			'public setValues' : function(_values){
				if(_values instanceof Array){
					this.values = _values;
				}
			}

			});

		return RetrievalResult;
	
});
/**
 * This module represents a List. 
 * It is an abstract Class.
 * 
 * @module AbstractList
 * @fileOverview
 */
define('abstractList',[],function() {
	return (function() {
		/**
		 * @class AbstractList
		 * @classdesc This class represents a list.
		 * @constructor
		 */
		function AbstractList() {
			/**
			 *
			 * @type {Array}
			 * @private
			 */
			this._items = [];

			/**
			 *
			 * @type {Object}
			 * @private
			 */
			this._type = Object;

			return this;
		}

		/**
		 * Builder for Item list.
		 *
		 * @param {*} list
		 * @returns {*}
		 */
		AbstractList.prototype.withItems = function(list) {
			if (list instanceof Array) {
				this._items = list;
			} else if (list.constructor === this.constructor) {
				this._items = list.getItems();
			}
			return this;
		};

		/**
		 * Adds the specified item to the itemList.
		 *
		 * @public
		 * @param {*} item item that should be added
		 */
		AbstractList.prototype.put = function(item) {
			if (item.constructor === this._type) {
				if (!(this.contains(item))) {
					this._items.push(item);
				}
			}
		};

		/**
		 * Adds all items in the specified list to the itemList.
		 *
		 * @public
		 * @param {*} listOrArray list of items that should be added
		 */
		AbstractList.prototype.putAll = function(listOrArray) {
			var list = [];
			if (listOrArray instanceof Array) {
				list = listOrArray;
			} else if (listOrArray.constructor === this.constructor) {
				list = listOrArray.getItems();
			}
			for (var i in list) {
				this.put(list[i]);
			}
		};

		/**
		 * Verifies whether the given item is included
		 * in this list.
		 *
		 * @public
		 * @param {*} item Item that should be checked.
		 * @returns {boolean}
		 */
		AbstractList.prototype.contains = function(item) {
			if (item.constructor === this._type) {
				for (var index in this._items) {
					var theItem = this._items[index];
					if (theItem.equals(item)) {
						return true;
					}
				}
			}
			return false;
		};

		/**
		 * Compare the specified WidgetHandleList with this instance.
		 *
		 * @abstract
		 * @public
		 * @param {*} list List that should be compared.
		 */
		AbstractList.prototype.equals = function(list) {
			if (list.constructor === this.constructor && list.size() == this.size()) {
				for (var index in list.getItems()) {
					var theItem = list.getItems()[index];
					if (!this.contains(theItem)) return false;
				}
				return true;
			}
			return false;
		};

		/**
		 * Returns the item for the specified key.
		 * @public
		 * @alias getItem
		 * @memberof AbstractList#
		 * @param {string} _key key that should be searched for
		 * @returns {*}
		 */
		AbstractList.prototype.getItem = function(_key) {
			return this._items[_key];
		};

		/**
		 * Removes the item from this list for the specified key.
		 *
		 * @public
		 * @param {string} key key that should be searched for
		 */
		AbstractList.prototype.removeItem = function(key) {
			if (this.containsKey(key)) {
				delete this._items[key];
			}
		};

		/**
		 * Returns the keys of all items.
		 *
		 * @public
		 * @returns {Array}
		 */
		AbstractList.prototype.getKeys = function() {
			var listKeys = [];
			for (var key in this._items) {
				listKeys.push(key);
			}
			return listKeys;
		};

		/**
		 * Returns all items.
		 *
		 * @virtual
		 * @public
		 * @returns {Array}
		 */
		AbstractList.prototype.getItems = function() {
			return this._items;
		};

		/**
		 * Returns the number of items that are included.
		 *
		 * @public
		 * @returns {Number}
		 */
		AbstractList.prototype.size = function() {
			return this._items.length;
		};

		/**
		 * Verifies whether the list is empty.
		 *
		 * @public
		 * @returns {boolean}
		 */
		AbstractList.prototype.isEmpty = function() {
			return this.size() == 0;
		};

		/**
		 * Clears this list.
		 *
		 * @public
		 */
		AbstractList.prototype.clear = function() {
			this._items = [];
		};

		return AbstractList;
	})();
});
/**
 * This module represents a Parameter.
 * Parameter specifies the Attributes to which they are associated.
 * 
 * @module Parameter
 * @fileOverview
 */
define('parameter',[],function(){
	return (function() {
		/**
		 * @class Parameter
		 * @classdesc Parameter specifies the Attributes to that these are associated.
		 */
		function Parameter() {
			/**
			 *
			 * @type {string}
			 * @private
			 */
			this._key = '';

			/**
			 *
			 * @type {string}
			 * @private
			 */
			this._value = '';

			return this;
		}

		/**
		 * Builder for key.
		 *
		 * @public
		 * @param {String} key Key
		 * @returns {Parameter}
		 */
		Parameter.prototype.withKey = function(key){
			this.setKey(key);
			return this;
		};

		/**
		 * Builder for value.
		 *
		 * @public
		 * @param {String} value Value
		 * @returns {Parameter}
		 */
		Parameter.prototype.withValue = function(value){
			this.setValue(value);
			return this;
		};

		/**
		 * Returns the key.
		 *
		 * @public
		 * @returns {string}
		 */
		Parameter.prototype.getKey = function(){
			return this._key;
		};

		/**
		 * Returns the value.
		 *
		 * @public
		 * @returns {string}
		 */
		Parameter.prototype.getValue = function(){
			return this._value;
		};

		/**
		 * Sets the key.
		 *
		 * @public
		 * @param {string} newKey Key
		 */
		Parameter.prototype.setKey = function(newKey){
			if(typeof newKey === 'string'){
				this._key = newKey;
			}
		};

		/**
		 * Sets the value.
		 *
		 * @public
		 * @param {string} newValue Value
		 */
		Parameter.prototype.setValue = function(newValue){
			if(typeof newValue === 'string'){
				this._value = newValue;
			}
		};

		/**
		 * Compares this instance with the given one.
		 *
		 * @param {Parameter} parameter Parameter that should be compared.
		 * @returns {boolean}
		 */
		Parameter.prototype.equals = function(parameter) {
			if(parameter.constructor === Parameter){
				if (parameter.getValue() == "PV_INPUT" || this.getValue() == "PV_INPUT") {
					return this.getKey() == parameter.getKey();
				} else {
					return this.getKey() == parameter.getKey() && this.getValue() == parameter.getValue();
				}
			}
			return false;
		};

		/**
		 * Returns a description of the parameter.
		 * Format: [ParameterName:ParameterValue]
		 *
		 * @example [CP_UNIT:KILOMETERS]
		 */
		Parameter.prototype.toString = function() {
			return "["+this.getKey()+":"+this.getValue()+"]";
		};

		return Parameter;
	})();
});
/**
 * This module represents a ParameterList. It is a subclass of AbstractList.
 * 
 * @module ParameterList
 * @fileOverview
 */
define('parameterList',['abstractList', 'parameter' ],
	function(AbstractList, Parameter) {
		return (function() {
			/**
			 * @class ParameterList
			 * @classdesc This class represents a list for Parameter.
			 * @extends AbstractList
			 * @requires AbstractList
			 * @requires Parameter
			 */
			function ParameterList() {
				AbstractList.call(this);

				this._type = Parameter;

				return this;
			}

			ParameterList.prototype = Object.create(AbstractList.prototype);
			ParameterList.prototype.constructor = ParameterList;

			/**
			 * Returns the objects of the list as JSON objects.
			 *
			 * @public
			 * @returns {{}}
			 */
			ParameterList.prototype.getItemsAsJson = function() {
				var parameters = {};
				for (var key in this._items) {
					var theParameter = this._items[key];
					parameters[theParameter.getKey()] = theParameter.getValue();
				}
				return parameters;
			};

			/**
			 * Return true if the list contains a parameter that is set at runtime.
			 *
			 * @public
			 * @returns {boolean}
			 */
			ParameterList.prototype.hasInputParameter = function() {
				for (var index in this._items) {
					var theParameter = this._items[index];
					if (theParameter.getValue() == "PV_INPUT") return true;
				}
				return false;
			};

			return ParameterList;
		})();
	});
/**
 * This module represents an AttributeType.
 * AttributeTypes defines name, type (string, double,...) an associated parameter of an attribute.
 *
 * @module AttributeType
 * @fileOverview
 */
define('attribute',['parameterList'], function(ParameterList){
    return (function() {
        /**
         * Constructor: Initializes the ParameterList.
         *
         * @class Attribute
         * @classdesc Attribute defines name, type (string, double,...) an associated parameter of an attribute.
         * @requires ParameterList
         * @constructs Attribute
         */
        function Attribute() {
            /**
             * Name of the Attribute.
             *
             * @type {string}
             * @private
             */
            this._name = '';

            /**
             * Defines the type of the Attribute (i.e String, Double,...).
             *
             * @type {string}
             * @private
             */
            this._type = '';

            /**
             *
             * @type {ParameterList}
             * @private
             */
            this._parameterList = new ParameterList();

            /**
             *
             * @type {string}
             * @private
             */
            this._value = 'NO_VALUE';

            /**
             * Time when the value was set.
             *
             * @type {Date}
             * @private
             */
            this._timestamp = new Date();

            return this;
        }

        /**
         * Builder for name.
         *
         * @param {String} name Name
         * @returns {Attribute}
         */
        Attribute.prototype.withName = function(name){
            this.setName(name);
            return this;
        };

        /**
         * Builder for type.
         *
         * @param {String} type Type
         * @returns {Attribute}
         */
        Attribute.prototype.withType = function(type){
            this.setType(type);
            return this;
        };

        /**
         * Builder for one parameter.
         *
         * @param {Parameter} parameter Parameter
         * @returns {Attribute}
         */
        Attribute.prototype.withParameter = function(parameter){
            this.addParameter(parameter);
            return this;
        };

        /**
         * Builder for parameterList.
         *
         * @param {(ParameterList|Array)} parameterList ParameterList
         * @returns {Attribute}
         */
        Attribute.prototype.withParameters = function(parameterList){
            this.setParameters(parameterList);
            return this;
        };

        /**
         * Builder for value.
         *
         * @param {String} value value
         * @returns {Attribute}
         */
        Attribute.prototype.withValue = function(value) {
            this.setValue(value);
            this.setTimestamp(new Date());
            return this;
        };

        /**
         * Builder for timestamp.
         *
         * @param {Date} timestamp timestamp
         * @returns {Attribute}
         */
        Attribute.prototype.withTimestamp = function(timestamp) {
            this.setTimestamp(timestamp);
            return this;
        };

        /**
         * Returns the name.
         *
         * @returns {string}
         */
        Attribute.prototype.getName = function(){
            return this._name;
        };

        /**
         * Returns the type.
         *
         * @returns {string}
         */
        Attribute.prototype.getType = function(){
            return this._type;
        };

        /**
         * Returns the parameters.
         *
         * @returns {ParameterList}
         */
        Attribute.prototype.getParameters = function(){
            return this._parameterList;
        };

        /**
         * Sets the name.
         *
         * @param {string} name Name
         */
        Attribute.prototype.setName = function(name){
            if(typeof name === 'string'){
                this._name = name;
            }
        };

        /**
         * Sets the type.
         *
         * @param {string} type Type
         */
        Attribute.prototype.setType = function(type){
            if(typeof type === 'string'){
                this._type = type;
            }
        };

        /**
         * Adds a parameter.
         *
         * @param {Parameter} parameter Parameter
         */
        Attribute.prototype.addParameter = function(parameter){
            this._parameterList.put(parameter);
        };

        /**
         * Adds a list of Parameter.
         *
         * @param {ParameterList} parameters ParameterList
         */
        Attribute.prototype.setParameters = function(parameters){
            this._parameterList.putAll(parameters);
        };

        /**
         * Returns true if the attribute is parameterized.
         *
         * @returns {boolean}
         */
        Attribute.prototype.hasParameters = function() {
            return this._parameterList.size() > 0;
        };

        /**
         * Sets the value.
         *
         * @param {string} value value
         * @returns {Attribute}
         */
        Attribute.prototype.setValue = function(value) {
            this._value = value;
            return this;
        };

        /**
         * Returns the value.
         *
         * @returns {string}
         */
        Attribute.prototype.getValue = function() {
            return this._value;
        };

        /**
         * Sets the timestamp.
         *
         * @param {Date} time timestamp
         */
        Attribute.prototype.setTimestamp = function(time) {
            this._timestamp = time;
        };

        /**
         * Returns the timestamp.
         *
         * @returns {Number}
         */
        Attribute.prototype.getTimestamp = function() {
            return this._timestamp;
        };

        /**
         *
         * @returns {boolean}
         */
        Attribute.prototype.hasInputParameter = function() {
            return this.hasParameters() && this._parameterList.hasInputParameter();
        };

        /**
         * Compares this instance with the given one.
         *
         * @param {Attribute} attribute Attribute that should be compared.
         * @returns {boolean}
         */
        Attribute.prototype.equalsTypeOf = function(attribute) {
            if (attribute.constructor === Attribute) {
                if (this.getName() == attribute.getName() && this.getType() == attribute.getType() && this.getParameters().equals(attribute.getParameters())) {
                    return true;
                }
            }
            return false;
        };

        /**
         *
         * @param {Attribute} attribute
         * @returns {Boolean}
         */
        Attribute.prototype.equalsValueOf = function(attribute) {
            if (attribute.constructor === Attribute) {
                if (this.equalsTypeOf(attribute) && this.getValue() == attribute.getValue()) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns an identifier that uniquely describes the attribute type and its parameters.
         * The identifier can be used to compare two attribute types. <br/>
         * Format: (AttributeName:AttributeType)#[FirstParameterName:FirstParameterValue]…
         *
         * @returns {String}
         * @example (CI_USER_LOCATION_DISTANCE:FLOAT)#[CP_TARGET_LATITUDE:52][CP_TARGET_LONGITUDE:13][CP_UNIT:KILOMETERS]
         */
        Attribute.prototype.toString = function(typeOnly) {
            var identifier = "(" + this.getName() + ":" + this.getType() + ")";
            if (this.hasParameters()) {
                identifier += "#";
                for (var index in this.getParameters().getItems()) {
                    var theParameter = this.getParameters().getItems()[index];
                    identifier += theParameter.toString();
                }
            }
            if (!typeOnly) identifier += ":" + this.getValue();
            return identifier;
        };

        return Attribute;
    })();
});
/**
 * This module represents an AttributeList. It is a subclass of AbstractList.
 *
 * @module AttributeList
 * @fileOverview
 */
define('attributeList',['abstractList', 'attribute'], function(AbstractList, Attribute) {
    return (function() {
        /**
         * @class AttributeList
         * @classdesc This class represents a list for Attribute.
         * @extends AbstractList
         * @requires AbstractList
         * @requires Attribute
         */
        function AttributeList() {
            AbstractList.call(this);

            this._type = Attribute;

            return this;
        }

        AttributeList.prototype = Object.create(AbstractList.prototype);
        AttributeList.prototype.constructor = AttributeList;

        /**
         * Adds the specified item to the itemList.
         *
         * @public
         * @param {AttributeType} attribute AttributeType
         * @param {boolean} multipleInstances
         */
        AttributeList.prototype.put = function(attribute, multipleInstances) {
            multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
            if (attribute.constructor === this._type) {
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

        /**
         *
         * @param {Attribute} _attribute
         * @param {?boolean} _typeOnly
         * @returns {*}
         */
        AttributeList.prototype.contains = function(_attribute, _typeOnly) {
            _typeOnly = typeof _typeOnly == "undefined" ? false : _typeOnly;
            return _typeOnly ? this.containsTypeOf(_attribute) : this.containsValueOf(_attribute);
        };

        /**
         * Verifies whether an attribute with the type of the given item is included in this list.
         *
         * @param {Attribute} attribute AttributeType that should be verified.
         * @returns {boolean}
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
         * @returns {boolean}
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
         * @deprecated
         * @param {AttributeList} attributeList
         * @param {Boolean} typeOnly
         * @returns {*}
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
            } else if (attributeList.constructor === AttributeList) {
                list = attributeList.getItems();
            }
            for (var i in list) {
                var theAttribute = list[i];
                if (theAttribute.constructor === Attribute) {
                    var responseAttribute = this.getAttributeWithTypeOf(theAttribute);
                    if (typeof responseAttribute != "NO_VALUE") {
                        response.put(responseAttribute);
                    }
                }
            }
            return response;
        };

        /**
         * Returns a subset without the given types.
         *
         * @param {(AttributeList|Array)} attributeList AttributeTypes that should not be included
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
                var newAttribute = new Attribute().withName(oldAttribute.getName()).withType(oldAttribute.getType()).withParameters(oldAttribute.getParameters());
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
         * @param {AttributeType} attribute
         * @returns {Attribute}
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
/**
 * This module representing a Storage.
 * The Storage handles the access to the database.
 * 
 * @module Widget
 * @fileOverview
 */
define('storage',['easejs', 'attribute', 'attributeList',
        'retrievalResult', 'parameter', 'parameterList'],
 	function( easejs, Attribute, AttributeList,
 			RetrievalResult, Parameter, ParameterList){
 	var Class = easejs.Class;
	var Storage =  Class('Storage',		
	{
		
		/**
		 * @alias attributeNames
		 * @private
		 * @type {Array}
		 * @memberof Storage#
		 * @desc Names of all stored Attributes (tableNames as string).
		 */
		'private attributeNames' : [],
		/**
		 * @alias attributes
		 * @private
		 * @type {RetrievalResult}
		 * @memberof Storage#
		 * @desc Data of a retrieval.
		 */
		'private attributes' : '',
		/**
		 * @alias data
		 * @private
		 * @type {AttributeList}
		 * @memberof Storage#
		 * @desc Cache before storing the new data in the database.
		 */
		'private data' : [],
		/**
		 * @alias dataCount
		 * @private
		 * @type {Integer}
		 * @memberof Storage#
		 * @desc Names of all stored Attributes.
		 */
		'private dataCount' : '',
		/**
		 * @alias lastFlush
		 * @private
		 * @type {Date}
		 * @memberof Storage#
		 * @desc Time of the last flush.
		 */
		'private lastFlush' : '',
		/**
		 * @alias  timeCondition
		 * @private
		 * @type {Integer}
		 * @memberof Storage#
		 * @desc Condition (ms) at which point of time data are supposed to be flushed. 
		 * If the value is more than the value of 'timeCondition' ago, data should be 
		 * flushed again. The initial value is two hours.
		 */
		'private timeCondition' : 7200000,
		/**
		 * @alias countCondition
		 * @private
		 * @type {Number}
		 * @memberof Storage#
		 * @desc Condition at which point of time data are supposed to be flushed. 
		 * If at least 'countCondition' attributes are collected data will be flushed. 
		 * Initial value is 5.
		 */
		'private countCondition' : 5,
		/**
		 * @alias db
		 * @private
		 * @type {Database}
		 * @memberof Storage#
		 * @desc Associated database.
		 */
		'private db' : '',
		
		/**
		 * Constructor: Initializes the database and all return values.
		 * 
		 * @class Storage
		 * @classdesc Storage handles the access to the database.
		 * @requires easejs
		 * @requires Attribute
		 * @requires AttributeList
		 * @requires Parameter
		 * @requires ParameterList
		 * @requires RetrievalResult
		 * @constructs Storage
		 */

		'public __construct' : function(_name, _time, _counter){
			this.initStorage(_name);
			this.attributes = new RetrievalResult();
			this.data = new AttributeList();
			this.dataCount = 0;
			this.lastFlush = new Date();
			if(_time && _time === parseInt(_time) && _time!=0)
				this.timeCondition = _time;
			if(_counter && _counter === parseInt(_counter) && _counter != 0)
				this.countCondition = _counter;
		},
		
		/**
		 * Returns the last retrieved Attributes.
		 * 
		 * @public
		 * @alias getCurrentData
		 * @memberof Storage#
		 * @returns {RetrievalResult} 
		 */		
		'public getCurrentData' : function(){
			return this.attributes;
		},
		
		/**
		 * Returns the names of all stored Attributes (tableNames as string).
		 * 
		 * @public
		 * @alias getAttributesOverview
		 * @memberof Storage#
		 * @returns {Array} 
		 */	
		'public getAttributesOverview' : function(){
			return this.attributeNames;
		},
		
		/**
		 * Initializes a new database.
		 * 
		 * @private
		 * @alias initStorage
		 * @memberof Storage#
		 * @param {String} _name Name of the database.
		 */
		'private initStorage' : function(_name){
			if(!window.openDatabase) {
		        console.log('Databases are not supported in this browser.');
			}else{
				this.db = window.openDatabase(_name, "1.0", "DB_" + _name, 1024*1024);
				console.log('initStorage: ' + _name);
			}
		},
		
		/**
		 * Creates a new table. A table contains the values of one AttributeType.
		 * So the name is the AttributeName.
		 * 
		 * @private
		 * @alias createTable
		 * @memberof Storage#
		 * @param {String} _attribute tableName (should be the attributeName)
		 * @param {?function} _function For alternative actions, if an asynchronous function is used.
		 */
		'private createTable' : function(_attribute, _function){
			if(this.db){
				var tableName = this.tableName(_attribute);
				var statement = 'CREATE TABLE IF NOT EXISTS "' + tableName + '" (value_, type_, created_)';
				console.log('CREATE TABLE IF NOT EXISTS "' + tableName + '"');
				if(_function && typeof(_function) == 'function'){
					this.db.transaction(function(tx){tx.executeSql(statement);}, this.errorCB, _function);	
				} else {
					this.db.transaction(function(tx){tx.executeSql(statement);}, this.errorCB, this.successCB);			
				}
				if(!this.attributeNames.indexOf(_attribute.getName()) > -1){
					this.attributeNames.push(tableName);
				}
			}
		},
		
		/**
		 * Inserts value into a table. The name of the given Attribute
		 * identifies the table. 
		 * 
		 * @private
		 * @alias insertIntoTable
		 * @memberof Storage#
		 * @param {Attribute} _attribute Attribute that should be stored.
		 * @param {?function} _function For alternative actions, if an asynchronous function is used.
		 */	
		'private insertIntoTable' : function(_attribute, _function){
			if(this.db && _attribute && Class.isA(Attribute, _attribute)){
				var tableName = this.tableName(_attribute);
				var statement = 'INSERT INTO "' + tableName
									 + '" (value_, type_, created_) VALUES ("'
									 + _attribute.getValue() + '", "'
									 + _attribute.getType() + '", "'
									 + _attribute.getTimestamp() + '")';
				console.log('INSERT INTO "'+tableName+'" VALUES ('+_attribute.getValue()+", "+_attribute.getType()+", "+_attribute.getTimestamp());
				if(_function && typeof(_function) == 'function'){
					this.db.transaction(function(tx){tx.executeSql(statement);}, this.errorCB, _function);	
				} else {
					this.db.transaction(function(tx){tx.executeSql(statement);}, this.errorCB, this.successCB);
				}
			}
		},
		
		/**
		 * error function 
		 * 
		 * @callback
		 * @private
		 * @alias errorCB
		 * @memberof Storage#
		 */	
		'private errorCB' : function(err) {
		    console.log("Error processing SQL: "+err.message);
		},

		/**
		 * success function 
		 * 
		 * @callback
		 * @private
		 * @alias successCB
		 * @memberof Storage#
		 */	
		'private successCB' : function() {
		    console.log("SQL processed successfully!");
		},
		
		
		/**
		 * Sets the attributeNames array. 
		 * 
		 * @public
		 * @alias getAttributeNames
		 * @memberof Storage#
		 * @param {?function} _function For alternative actions, if an asynchronous function is used.
		 */	
		'public getAttributeNames' : function(_function){
			if(this.db){
				var self = this;
				this.db.transaction(function(_tx){self.queryTables(_tx,self, _function);},
		    						function(error){self.errorCB(error);} );
			}		    
		},
		
		/**
		 * Sets the attributeNames array. Is used in getAttributeNames(). 
		 * 
		 * @callback
		 * @private
		 * @alias queryTables
		 * @memberof Storage#
		 * @param {*} _tx
		 * @param {@this} self
		 * @param {?function} _function For alternative actions, if an asynchronous function is used.
		 */	
		'private queryTables' : function(_tx, self, _function){
			var statement = "SELECT * from sqlite_master WHERE type = 'table'";
			_tx.executeSql(statement, [], function(_tx,results){self.queryTableSuccess(_tx,results,self, _function);}, 
						function(error){self.errorCB(error);});	
					
		},
		
		/**
		 * Success function for queryTable. 
		 * 
		 * @callback
		 * @private
		 * @alias queryTableSucces
		 * @memberof Storage#
		 * @param {*} _tx
		 * @param {*} results
		 * @param {@this} self
		 */	
		'private queryTableSuccess' : function(_tx, results, self, _function){
			self.attributeNames = [];
			var len = results.rows.length;
			for(var i=0; i<len; i++){
				var table = results.rows.item(i).name;
				if(table.indexOf("DatabaseInfoTable") == -1){
					self.attributeNames.push(results.rows.item(i).name);
				}
				
			}
			if(_function && typeof(_function) == 'function'){
				_function();
			}

		},
		
		/**
		 * Verifies if a table for an attribute exists. 
		 * 
		 * @private
		 * @alias tableExists
		 * @memberof Storage#
		 * @param {(AttributeValue|String)} _attribute Attribute or name for the verification.
		 * @returns {boolean}
		 */	
		'private tableExists' : function(_attribute){
			if(Class.isA(Attribute, _attribute)){
				var name = this.tableName(_attribute);
				return this.attributeNames.indexOf(name) > -1;				
			} else if(typeof _attribute === 'string'){
				return this.attributeNames.indexOf(_attribute) > -1;	
			}
			return false;
		},
		
		/**
		 * Retrieves a table and sets the RetrievalResult. 
		 * 
		 * @public
		 * @alias retrieveAttributes
		 * @memberof Storage#
		 * @param {String} _tableName Name for the table that should be retrieved.
		 * @param {?function} _function For additional actions, if an asynchronous function is used.
		 */	
		'public retrieveAttributes' : function(_tableName, _function){
			console.log("retrieveAttributes from "+_tableName);

			if(this.db){
				var self = this;	
				self.flushStorage();
				this.db.transaction(function(_tx) {
					self.queryValues(_tx,_tableName,self, _function);
				}, function(error) {
					self.errorCB(error);
				});
			}
		},
		
		/**
		 * Query function for given attribute. 
		 * 
		 * @callback
		 * @private
		 * @alias queryValues
		 * @memberof Storage#
		 * @param {*} _tx 
		 * @param {String} _tableName Name for the table that should be retrieved.
		 * @param {@this} self
		 * @param {?function} _function For additional actions, if an asynchronous function is used.
		 */	
		'private queryValues' : function(_tx, _tableName, self, _function){
			if(self.tableExists(_tableName)){
				console.log('SELECT * FROM "' +_tableName+"'");
				var statement = 'SELECT * FROM "' + _tableName+'"';
				_tx.executeSql(statement, [], 
					function(_tx,results){self.queryValuesSuccess(_tx,results,_tableName, self, _function);}, 
					function(error){self.errorCB(error);});			
			} else {
				console.log('Table "'+_tableName+'" unavailable');
			}
		},
		
		/**
		 * Success function for retrieveAttributes(). 
		 * Puts the retrieved data in RetrievalResult object.
		 * 
		 * @callback
		 * @private
		 * @alias queryValuesSucces
		 * @memberof Storage#
		 * @param {*} _tx
		 * @param {*} results
		 * @param {String} _tableName Name of the searched attribute.
		 * @param self
         * @param {?function} _function For additional actions, if an asynchronous function is used.
		 */	
		'private queryValuesSuccess' : function(_tx, results,_tableName, self, _function){
			var len = results.rows.length;
			var attributeList = [];
			var attributeName = this.resolveAttributeName(_tableName);
			var parameterList = this.resolveParameters(_tableName);
			for(var i=0; i<len; i++){
				var attribute = new Attribute().
								withName(attributeName).withValue(results.rows.item(i).value_).
								withType(results.rows.item(i).type_).
								withTimestamp(results.rows.item(i).created_).
								withParameters(parameterList);
				attributeList.push(attribute);
			}
			self.attributes = new RetrievalResult().withName(_tableName)
													.withTimestamp(new Date())
													.withValues(attributeList);
			if(_function && typeof(_function) == 'function'){
				_function();
			}
			 
		},
		
		/**
		 * Stores the given Attribute.
		 * If the flush condition does not match, 
		 * the data is first added to the local cache before.
		 * 
		 * @public
		 * @alias store
		 * @memberof Storage#
		 * @param {AttributeValue} _attributeValue Value that should be stored.
		 */		
		'public store' : function(_attributeValue){
			
			this.addData(_attributeValue);
			if(this.checkFlushCondition){
				this.flushStorage();
				this.resetForFlush();
			}
			
		},
		
		/**
		 * Adds data to the local cache. 
		 * The cache is used to decrease the database access.
		 * 
		 * @private 
		 * @alias addData
		 * @memberof Storage#
		 * @param {Attribute} _attribute Value that should be stored.
		 */		
		'private addData' : function(_attribute){
			if(Class.isA(Attribute, _attribute)){
				this.data.put(_attribute);
				this.dataCount++;
			}
		},
		
		/**
		 * Verifies the flush conditions.
		 * 
		 * @private 
		 * @alias checkFlushCondition
		 * @memberof Storage#
		 * @returns {boolean}
		 */	
		'private checkFlushCondition' : function(){
			if(this.dataCount > this.countCondition){
				return true;
			}
			var currentDate = new Date();
			if((currentDate.getTime() - lastFlush.getTime()) < this.timeCondition ){
				return true;
			} //2 stunden??
			return false;
		},
		
		/**
		 * Clears the local cache.
		 * 
		 * @private 
		 * @alias resetForFlush
		 * @memberof Storage#
		 */	
		'private resetForFlush' : function(){
			this.data = new AttributeList();
			this.dataCount = 0;
			this.lastFlush = new Date();
		},
		
		/**
		 * Stores all data from the local cache to the database.
		 * 
		 * @private 
		 * @alias flushStorage
		 * @memberof Storage#
		 */
		'private flushStorage' : function(){
			var self = this;
			if(self.data.size() == 0){
				return;
			}
			for(var i in self.data.getItems()){
				var item = self.data.getItems()[i];
				if(!self.tableExists(item)){
					self.createTable(item, function(){self.insertIntoTable(item);});
				} else {
					self.insertIntoTable(item);
				}
			}
		},
		
		/**
		 * Sets the time condition for flush.
		 * 
		 * @public
		 * @alias setTimeCondition
		 * @memberof Storage#
		 * @param {integer} _time time in ms
		 */
		'public setTimeCondition' : function(_time){
			this.timeCondition = _time;
		},
		
		/**
		 * Sets the counter for flush.
		 * 
		 * @public
		 * @alias setCountCondition
		 * @memberof Storage#
		 * @param {integer} _counter counter
		 */
		'public setCountCondition' : function(_counter){
			this.countCondition = _counter;
		},
		
		/**
		 * Returns the current time condition for flush.
		 * 
		 * @public
		 * @alias getTimeCondition
		 * @memberof Storage#
		 * @returns {integer}
		 */
		'public getTimeCondition' : function(){
			return this.timeCondition;
		},
		
		/**
		 *  Returns the current count condition for flush.
		 * 
		 * @public 
		 * @alias getCountCondition
		 * @memberof Storage#
		 * @returns{integer}
		 */
		'public getCountCondition' : function(){
			return this.countCondition;
		},

		/****************************
		 * 			Helper			*
		 ****************************/
		/**
		 * Builds the tableName for the given attribute.
		 * 
		 * @private 
		 * @alias tableName
		 * @memberof Storage#
		 * @param {AttributeValue} _attribute Attribute that should be stored.
		 * @returns{String}
		 */
		'private tableName' : function(_attribute){
			return _attribute.toString(true);
		},
		
		/**
		 * Extracts the attributeName form the table name.
		 * 
		 * @private 
		 * @alias resolveAttributeName
		 * @memberof Storage#
		 * @param {String} _tableName Table name that should be resolved.
		 * @returns{String}
		 */
		'private resolveAttributeName' : function(_tableName){
			var resolvedTableName = _tableName.split('__');
            return resolvedTableName[0];
		},
		
		/** Extracts the parameters form the table name.
		 * 
		 * @private 
		 * @alias resolveParameters
		 * @memberof Storage#
		 * @param {String} _tableName Table name that should be resolved.
		 * @returns{String}
		 */
		'private resolveParameters' : function(_tableName){
			var resolvedTableName = _tableName.split('__');

			var parameterList = new ParameterList();
			for(var i = 1; i < resolvedTableName.length; i++ ){
				var resolvedParameter =  resolvedTableName[i].split('_');
				var parameter= new Parameter().withKey(resolvedParameter[0]).withValue(resolvedParameter[1]);
				parameterList.put(parameter);
			}
			return parameterList;
		}
		
	});

	return Storage;
});
/**
 * This module represents a Callback.
 * Callbacks defines events for sending data to subscribers
 * 
 * @module Callback
 * @fileOverview
 */
define('callback',['easejs', 'attribute', 'attributeList'],
 	function(easejs, Attribute, AttributeList){
 	var Class = easejs.Class;
 	
	var Callback = Class('Callback',
	{

		/**
		 * @alias name
		 * @private
		 * @type {string}
		 * @memberof Callback#
		 * @desc Name of the Callback (i.e. Update).
		 */
		'private name' : '', 
		/**
		 * @alias attributeTypes
		 * @private
		 * @type {AttributeTypeList}
		 * @memberof Callback#
		 * @desc Associated Attributes that will be send to Subscriber.
		 */
		'private attributeTypes' : [], 
		
		/**
		 * Constructor: Initializes the AttributeTypeList.
		 * 
		 * @class Callback
		 * @classdesc Callbacks defines events for sending data to subscribers.
		 * 			The data to be sent, are specified in the attributeTypeList.
		 * @requires easejs
		 * @requires ParameterList
		 * @requires AttributeType
		 * @requires AttributeTypeList
		 * @constructs Callback
		 */
		'public __construct': function()
        {
			this.attributeTypes = new AttributeList();
        },

        /**
		 * Builder for name.
		 * 
		 * @public
		 * @alias withName
		 * @memberof Callback#
		 * @param {String} _name Name
		 * @returns {Callback}
		 */
		'public withName' : function(_name){
			this.setName(_name);
			return this;
		},
		
		/**
		 * Builder for AttributeTypes.
		 * 
		 * @public
		 * @alias withAttributeTypes
		 * @memberof Callback#
		 * @param {(AttributeTypeList|Array)} _attributeTypes attributeTypes
		 * @returns {Callback}
		 */
		'public withAttributeTypes' : function(_attributeTypes){
			this.setAttributeTypes(_attributeTypes);
			return this;
		},

		/**
		 * Returns the name.
		 * 
		 * @public
		 * @alias getName
		 * @memberof Callback#
		 * @returns {string}
		 */
		'public getName' : function(){
			return this.name;
		},

		/**
		 * Sets the name.
		 * 
		 * @public
		 * @alias setName
		 * @memberof Callback#
		 * @param {string} _name Name
		 */
		'public setName' : function(_name){
			if(typeof _name === 'string'){
				this.name = _name;
			};
		},

		/**
		 * Returns the associated attributes (only the types).
		 * 
		 * @public
		 * @alias getAttributeTypes
		 * @memberof Callback#
		 * @returns {AttributeTypeList}
		 */
		'public getAttributeTypes' : function(){
			return this.attributeTypes;
		},

		/**
		 * Adds a list of AttributeTypes.
		 * 
		 * @public
		 * @alias setAttributeTypes
		 * @memberof Callback#
		 * @param {AttributeList} _attributes AttributeTypeList
		 */
		'public setAttributeTypes' : function(_attributes){
			var list = [];
			if(_attributes instanceof Array){
				list = _attributes;
			} else if (Class.isA( AttributeList, _attributes)) {
				list = _attributes.getItems();
			}
			for(var i in list){
				var theAttribute = list[i];
				if(Class.isA(Attribute, theAttribute)){
					this.attributeTypes.put(theAttribute);
				}
			}
		},

		/**
		 * Adds an attribute to AttributeTypeList.
		 * 
		 * @public
		 * @alias addAttributeType
		 * @memberof Callback#
		 * @param {AttributeType} _attribute AttributeType
		 */
		'public addAttributeType' : function(_attribute){
			if(Class.isA(Attribute, _attribute )){
				if(!this.attributeTypes.containsTypeOf(_attribute)){
					this.attributeTypes.put(_attribute);
				}
			}
		},

		/**
		 * Removes an attribute from AttributeTypeList.
		 * 
		 * @public
		 * @alias removeAttributeType
		 * @memberof Callback#
		 * @param {AttributeType} _attributeType AttributeType
		 */
		'public removeAttributeType' : function(_attributeType){
			if(Class.isA(Attribute, _attributeType )){
				this.attributeTypes.removeItem(_attributeType.getName());
			}
		},
		
		/**
		 * Compares this instance with the given one.
		 * 
		 * @virtual
		 * @public
		 * @alias equals
		 * @memberof Callback#
		 * @param {Callback} _callback Callback that should be compared
		 * @returns {boolean}
		 */
		'public equals' : function(_callback) {				
			if(Class.isA(Callback, _callback)){
				if(_callback.getName() == this.getName()
					&& _callback.getAttributeTypes().equals(this.getAttributeTypes())){
					return true;
				};
			};
			return false;

		},


		});

	return Callback;
});
/**
 * This module represents an CallbackList. It is a subclass of AbstractList.
 * 
 * @module CallbackList
 * @fileOverview
 */
define('callbackList',['abstractList', 'callback'], function(AbstractList, Callback){
 	return (function() {
		/**
		 * @class CallbackList
		 * @classdesc This class represents a list for Callback.
		 * @extends AbstractList
		 * @requires AbstractList
		 * @requires Callback
		 */
		function CallbackList() {
			AbstractList.call(this);

			this._type = Callback;

			return this;
		}

		CallbackList.prototype = Object.create(AbstractList.prototype);
		CallbackList.prototype.constructor = CallbackList;

		/**
		 * Builder for item list.
		 *
		 * @public
		 * @param {(CallbackList|Array)} callbackListOrArray CallbackList
		 * @returns {CallbackList}
		 */
		CallbackList.prototype.withItems = function(callbackListOrArray){
			if (callbackListOrArray instanceof Array) {
				this._items = callbackListOrArray;
			} else if (callbackListOrArray.constructor === CallbackList) {
				this._items = callbackListOrArray.getItems();
			}
			return this;
		};

		/**
		 * Adds the specified item to the itemList.
		 *
		 * @public
		 * @param {Callback} callback Callback
		 */
		CallbackList.prototype.put = function(callback){
			if (callback.constructor === Callback) {
				if (!(this.contains(callback))) {
					this._items.push(callback);
				}
			}
		};

		/**
		 * Adds all items in the specified list to this itemList
		 *
		 * @public
		 * @param {(CallbackList|Array)} callbackListOrArray CallbackList
		 */
		CallbackList.prototype.putAll = function(callbackListOrArray){
			var list = [];
			if (callbackListOrArray instanceof Array) {
				list = callbackListOrArray;
			} else if (callbackListOrArray.constructor === CallbackList) {
				list = callbackListOrArray.getItems();
			}
			for (var i in list) {
				this.put(list[i]);
			}
		};

		/**
		 * Verifies whether the given item is included in this list.
		 *
		 * @public
		 * @param {Callback} callback CallbackType that should be verified.
		 * @returns {boolean}
		 */
		CallbackList.prototype.contains = function(callback){
			if (callback.constructor === Callback) {
				for (var index in this._items) {
					var tmp = this._items[index];
					if (tmp.equals(callback)) {
						return true;
					}
				}
			}
			return false;
		};

		/**
		 * Compare the specified CallbackList with this instance.
		 * @public
		 * @alias equals
		 * @memberof CallbackList#
		 * @param {CallbackList} callbackList CallbackList that should be compared.
		 * @returns {boolean}
		 */
		CallbackList.prototype.equals = function(callbackList){
			if (callbackList.constructor === CallbackList && callbackList.size() == this.size()) {
				for (var index in callbackList.getItems()) {
					var theCallback = callbackList.getItems()[index];
					if (!this.contains(theCallback)) return false;
				}
				return true;
			}
			return false;
		};

		return CallbackList;
	})();
});
/**
 * This module represents an interface for ConditionMethod. 
 * 
 * @module ConditionMethod
 * @fileOverview
 */
define('conditionMethod',['easejs'],
 	function(easejs){
 	var Interface = easejs.Interface;
 	/**
	 * @class ConditionMethod
	 * @classdesc This interface defines the interface for conditionMethod.
	 * @requires easejs
	 */
	var ConditionMethod = Interface('ConditionMethod',
	{
		
		/**
		 * Processes the method.
		 * .
		 * 
		 * @function
		 * @abstract
		 * @public
		 * @alias process
		 * @memberof ConditionMethod#
		 * @param {*} reference Comparison value, if one is required.
		 * @param {*} firstValue Value (from an attribute) that should be compared. 
		 * @param {*} secondValue Value (from an attribute) for comparison, if one is required.
		 */
		'public process': ['reference', 'firstValue', 'secondValue'],
		
		});

	return ConditionMethod;
});
/**
 * This module represents a Condition. 
 * Condition specifies subscriptions. 
 * The associated attributes are only sent, if the condition applies. 
 * 
 * @module Condition
 * @fileOverview
 */
define('condition',['easejs','attribute', 'conditionMethod'],
 	function(easejs, Attribute, ConditionMethod){
 	var Class = easejs.Class;
 	/**
	 * @class Condition
	 * @classdesc Condition for subscribed Attributes.
	 * @requires easejs
	 * @requires AttributeType
	 * @requires AttributeValue
	 * @rewuires ConditionMethod
	 */
	var Condition = Class('Condition',
	{

		/**
		 * @alias name
		 * @private
		 * @type {string}
		 * @memberof Condition#
		 * @desc Name of the Condition.
		 */
		'private name' :'',
		/**
		 * @alias attributeType
		 * @private
		 * @type {AttributeType}
		 * @memberof Condition#
		 * @desc AttributeType that should be checked.
		 */
		'private attributeType' : '', 
		/**
		 * @alias comparisonMethod
		 * @private
		 * @type {ConditionMethod}
		 * @memberof Condition#
		 * @desc Method for comparison.
		 */
		'private comparisonMethod' : '',
		/**
		 * @alias referenceValue
		 * @private
		 * @type {*}
		 * @memberof Condition#
		 * @desc Comparison value.
		 */
		'private referenceValue' : '',

		/**
		 * Builder for name.
		 * 
		 * @public
		 * @alias withName
		 * @memberof Condition#
		 * @param {String} _name Name
		 * @returns {Condition}
		 */
		'public withName' : function(_name){
			this.setName(_name);
			return this;
		},
		/**
		 * Builder for AttributeType.
		 * 
		 * @public
		 * @alias withAttributeType
		 * @memberof Condition#
		 * @param {AttributeType} _attributeType Attributes that would be verified.
		 * @returns {Condition}
		 */
		'public withAttributeType' : function(_attributeType){
			this.setAttributeType(_attributeType);
			return this;
		},
		/**
		 * Builder for comparison method.
		 * 
		 * @public
		 * @alias withComparisonMethod
		 * @memberof Condition#
		 * @param {ConditionMethod} _comparisonMethod method for comparison
		 * @returns {Condition}
		 */
		'public withComparisonMethod' : function(_comparisonMethod){
			this.setComparisonMethod(_comparisonMethod);
			return this;
		},
		/**
		 * Builder for comparison value.
		 * 
		 * @public
		 * @alias withReferenceValue
		 * @memberof Condition#
		 * @param {String} _referenceValue comparisonValue
		 * @returns {Condition}
		 */
		'public withReferenceValue' : function(_referenceValue){
			this.setReferenceValue(_referenceValue);
			return this;
		},

		/**
		 * Sets the name.
		 * 
		 * @public
		 * @alias setName
		 * @memberof Condition#
		 * @param {string} _name Name
		 */
		'public setName' : function(_name){
			if(typeof _name === 'string'){
				this.name = _name;
			}
		},
		
		/**
		 * Sets the attributeType.
		 * 
		 * @public
		 * @alias setAttributeType
		 * @memberof Condition#
		 * @param {Attribute} _attribute AttributeType
		 */
		'public setAttributeType' : function(_attribute){
			if(Class.isA(Attribute, _attribute)){
				this.attributeType = _attribute;
			}
		},

		/**
		 * Sets the ComparisonMethod.
		 * 
		 * @public
		 * @alias setComparisonMethod
		 * @memberof Condition#
		 * @param {ConditionMethod} _comparisonMethod comparison Method
		 */
		'public setComparisonMethod' : function(_comparisonMethod){
			if(Class.isA(ConditionMethod,_comparisonMethod)){
				this.comparisonMethod = _comparisonMethod;
			}
		},

		/**
		 * Sets the referenceValue.
		 * 
		 * @public
		 * @alias setReferenceValue
		 * @memberof Condition#
		 * @param {*} _referenceValue comparison value
		 */
		'public setReferenceValue' : function(_referenceValue){
			this.referenceValue = _referenceValue;
		},
		
		/**
		 * Returns the name.
		 * 
		 * @public
		 * @alias getName
		 * @memberof Condition#
		 * @returns {string}
		 */
		'public getName' : function(){
			return this.name;
		},
		
		/**
		 * Returns the AttributeType.
		 * 
		 * @public
		 * @alias getAttributeType
		 * @memberof Condition#
		 * @returns {AttributeType}
		 */
		'public getAttributeType' : function(){
			return this.attributeType;
		},
		
		/**
		 * Returns the comparison method.
		 * 
		 * @public
		 * @alias getComparisonMethod
		 * @memberof Condition#
		 * @returns {ConditionMethod}
		 */
		'public getComparisonMethod' : function(){
			return this.comparisonMethod;
		},
		
		/**
		 * Returns the comparison value.
		 * 
		 * @public
		 * @alias getReferenceValue
		 * @memberof Condition#
		 * @returns {*}
		 */
		'public getReferenceValue' : function(){
			return this.referenceValue;
		},
		
		/**
		 * Processes the comparison.
		 * 
		 * @public
		 * @alias compare
		 * @memberof Condition#
		 * @param {Attribute} _newAttributeValue new Attribute that should be compared
		 * @param {Attribute} _oldAttributeValue old Attribute
		 * @returns {boolean}
		 */
		'public compare' : function(_newAttributeValue, _oldAttributeValue){
			if(!this.attributeType.equalsTypeOf(_newAttributeValue)&& !this.attributeType.equalsTypeOf(_oldAttributeValue)){
				return false;
			}
			if(!this.comparisonMethod){
				return false;
			}
			if(Class.isA(Attribute, _newAttributeValue) && Class.isA(Attribute, _oldAttributeValue)){
				return this.comparisonMethod.process(this.referenceValue, _newAttributeValue.getValue(), _oldAttributeValue.getValue());
			}
			return false;
		},
		
		/**
		 * Compares this instance with the given one.
		 * 
		 * @public
		 * @alias equals
		 * @memberof Condition#
		 * @param {Condition} _condition Condition that should be compared
		 * @returns {boolean}
		 */
		'public equals' : function(_condition) {				
			if(Class.isA(Condition, _condition)){
				if(_condition.getName() == this.getName()
						&& _condition.getReferenceValue() == this.getReferenceValue()
						&& _condition.getAttributeType().equalsTypeOf(this.attributeType)
						&& _condition.getComparisonMethod() === this.comparisonMethod){
					return true;
				};
			};
			return false;

		},
		

		});

	return Condition;
});
/**
 * This module represents a ConditionList. It is a subclass of AbstractList.
 * 
 * @module ConditionList
 * @fileOverview
 */
define('conditionList',['abstractList', 'condition'], function(AbstractList, Condition){
	return (function() {
		/**
		 * @class ConditionList
		 * @classdesc This class represents a list for Conditions.
		 * @extends AbstractList
		 * @requires AbstractList
		 * @requires Condition
		 */
		function ConditionList() {
			AbstractList.call(this);

			this._type = Condition;

			return this;
		}

		ConditionList.prototype = Object.create(AbstractList.prototype);
		ConditionList.prototype.constructor = ConditionList;

		return ConditionList;
	})();
});
/**
 * This module represents a Subscriber.
 * 
 * @module Subscriber
 * @fileOverview
 */
define('subscriber',['easejs', 'attributeList', 'callbackList', 'condition', 'conditionList'],
 	function(easejs, AttributeList, CallbackList, Condition, ConditionList){

 	/*
 	* Callback: name and associated Attributes
 	*/
 	var Class = easejs.Class;
	var Subscriber = Class('Subscriber',
	{

		/**
		 * @alias subscriberName
		 * @private
		 * @type {string}
		 * @memb Name of the subscriber.
		 */
		'private subscriberName' : '',
		/**
		 * @alias subscriberId
		 * @private
		 * @type {string}
		 * @memberof Subscriber#
		 * @desc ID of the Subscriber.
		 */
		'private subscriberId' : '',
		/**
		 * @alias subscriptionCallbacks
		 * @private
		 * @type {CallbackList}
		 * @memberof Subscriber#
		 * @desc Callbacks that should be subscribed.
		 */
		'private subscriptionCallbacks' : [],
		/**
		 * @alias attributesSubset
		 * @private
		 * @type {AttributeTypeList}
		 * @memberof Subscriber#
		 * @desc Restricts the associated Attributes of the callback to a subset
		 * 		(i.e: the subscriber wants a subset from the available the context data).  
		 * 		If no attributes are specified, all available attributes will returned.
		 */
		'private attributesSubset' : [],
		/**
		 * @alias conditions
		 * @private
		 * @type {ConditionList}
		 * @memberof Subscriber#
		 * @desc Defines special conditions for notification.
		 */
		'private conditions' : [],

		/**
		 * Constructor: Initializes the subscriptionCallbacks, subscriptionCallbacks
		 * 				and conditions.
		 * 
		 * @class Subscriber
		 * @classdesc Subscriber defines the name and the ID of the Subscriber and the Callbacks 
		 * 			 (with possible restrictions) what the subscriber is interested in.
		 * @requires easejs
		 * @requires AttributeTypeList 
		 * @requires CallbackList 
		 * @requires Condition
		 * @requires ConditionList
		 * @constructs Subscriber
		 */
		'virtual public __construct': function()
        {
			this.subscriptionCallbacks = new CallbackList();
			this.subscriptionCallbacks = new AttributeList();
			this.attributesSubset = new AttributeList();
			this.conditions = new ConditionList();
        },
			
		/**
		 * Builder for subscriberName.
		 * 
		 * @public
		 * @alias withSubscriberName
		 * @memberof Subscriber#
		 * @param {String} _subscriberName subscriberName
		 * @returns {Subscriber}
		 */
		'public withSubscriberName' : function(_subscriberName){
			this.setSubscriberName(_subscriberName);
			return this;
		},
		
		/**
		 * Builder for subscriberId.
		 * 
		 * @public
		 * @alias withSubscriberId
		 * @memberof Subscriber#
		 * @param {String} _subscriberId subscriberId
		 * @returns {Subscriber}
		 */
		'public withSubscriberId' : function(_subscriberId){
			this.setSubscriberId(_subscriberId);
			return this;
		},
		
		/**
		 * Builder for subscriptionCallbacks.
		 * 
		 * @public
		 * @alias withSubscriptionCallbacks
		 * @memberof Subscriber#
		 * @param {CallbackList} _subscriptionCallbacks subscriptionCallbacks
		 * @returns {Subscriber}
		 */
		'public withSubscriptionCallbacks' : function(_subscriptionCallbacks){
			this.setSubscriptionCallbacks(_subscriptionCallbacks);
			return this;
		},
		
		/**
		 * Builder for attributesSubset.
		 * 
		 * @public
		 * @alias withAttributesSubset
		 * @memberof Subscriber#
		 * @param {AttributeTypeList} _attributesSubset attributesSubset
		 * @returns {Subscriber}
		 */
		'public withAttributesSubset' : function(_attributesSubset){
			this.setAttributesSubset(_attributesSubset);
			return this;
		},
		
		/**
		 * Builder for conditions.
		 * 
		 * @public
		 * @alias withConditions
		 * @memberof Subscriber#
		 * @param {(ConditionList|Array)} _conditions conditions
		 * @returns {Subscriber}
		 */
		'public withConditions' : function(_conditions){
			this.setConditions(_conditions);
			return this;
		},

		
		/**
		 * Returns the name.
		 * 
		 * @public
		 * @alias getSubscriberName
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getSubscriberName' : function(){
			return this.subscriberName;
		},

		/**
		 * Sets the setSubscriberName.
		 * 
		 * @public
		 * @alias setSubscriberName
		 * @memberof Subscriber#
		 * @param {string} _subscriberName subscriberName
		 */
		'public setSubscriberName' : function(_subscriberName){
			if(typeof _subscriberName === 'string'){
				this.subscriberName = _subscriberName;
			}
			
		},
		
		/**
		 * Returns the subscriberId.
		 * 
		 * @public
		 * @alias getSubscriberId
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getSubscriberId' : function(){
			return this.subscriberId;
		},

		/**
		 * Sets the subscriberId.
		 * 
		 * @public
		 * @alias setSubscriberId
		 * @memberof Subscriber#
		 * @param {string} _subscriberId subscriberId
		 */
		'public setSubscriberId' : function(_subscriberId){
			if(typeof _subscriberId === 'string'){
				this.subscriberId = _subscriberId;
			};
		},
		
		/**
		 * Returns the subscriptionCallbacks.
		 * 
		 * @public
		 * @alias getSubscriptionCallbacks
		 * @memberof Subscriber#
		 * @returns {CallbackList}
		 */
		'public getSubscriptionCallbacks' : function(){
			return this.subscriptionCallbacks;
		},

		/**
		 * Sets the subscriptionCallbacks.
		 * 
		 * @public
		 * @alias setSubscriptionCallbacks
		 * @memberof Subscriber#
		 * @param {CallbackList} _subscriptionCallbacks subscriptionCallbacks
		 */
		'public setSubscriptionCallbacks' : function(_subscriptionCallbacks){
			if(Class.isA(CallbackList, _subscriptionCallbacks)){
				this.subscriptionCallbacks = _subscriptionCallbacks;
			}
		},
		
		/**
		 * Returns the attributesSubset.
		 * 
		 * @public
		 * @alias getAttributesSubset
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getAttributesSubset' : function(){
			return this.attributesSubset;
		},

		/**
		 * Sets the attributesSubset.
		 * 
		 * @public
		 * @alias setAttributesSubset
		 * @memberof Subscriber#
		 * @param {AttributeList} _attributesSubset attributesSubset
		 */
		'public setAttributesSubset' : function(_attributesSubset){
			if(Class.isA(AttributeList, _attributesSubset)){
				this.attributesSubset = _attributesSubset;
			}
		},
		
		/**
		 * Returns the conditions.
		 * 
		 * @public
		 * @alias getConditions
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getConditions' : function(){
			return this.conditions;
		},

		/**
		 * Sets the conditions.
		 * 
		 * @public
		 * @alias setConditions
		 * @memberof Subscriber#
		 * @param {(Callback|Array)} _conditions conditions
		 */
		'public setConditions' : function(_conditions){
			var list = new Array();
			if(_conditions instanceof Array){
				list = _conditions;
			} else if (Class.isA( ConditionList, _conditions)) {
				list = _conditions.getItems();
			}
			for(var i in list){
				var condition = list[i];
				if(Class.isA( Condition, condition )){
					this.attributeTypes.put(condition);
				};
			};
		},
		
		/**
		 * Adds a condition.
		 * 
		 * @public
		 * @alias addCondition
		 * @memberof Subscriber#
		 * @param {Condition} _condition Condition
		 */
		'public addCondition' : function(_condition){
			if(Class.isA( Condition, _condition )){
				if(!this.condition.contains(_condition)){
					this.conditiond.put(_condition);	
				}
			};
		},

		/**
		 * Removes a condition.
		 * 
		 * @public
		 * @alias removeCondition
		 * @memberof Subscriber#
		 * @param {Condition} _condition Condition
		 */
		'public removeCondition' : function(_condition){
			if(Class.isA( Condition, _condition )){
				this.conditions.removeItem(_condition.getName());
			};
		},
		
		/**
		 * Compares this instance with the given one.
		 * 
		 * @public
		 * @alias equals
		 * @memberof Subscriber#
		 * @param {Subscriber} _subscriber Subscriber that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_subscriber) {				
			if(Class.isA(Subscriber, _subscriber)){
				if(_subscriber.getSubscriberName() == this.subscriberName
							&& _subscriber.getSubscriberId() == this.subscriberId
							&& _subscriber.getSubscriptionCallbacks().equals(this.getSubscriptionCallbacks())
							&& _subscriber.getAttributesSubset().equals(this.getAttributesSubset())
							&& _subscriber.getConditions().equals(this.getConditions())){
					return true;
				}
			}
			return false;
		}
				
		});

	return Subscriber;
});
/**
 * This module represents a SubscriberList. It is a subclass of AbstractList.
 * 
 * @module SubscriberList
 * @fileOverview
 */
define('subscriberList',['abstractList', 'subscriber'], function(AbstractList, Subscriber){
	return (function() {
		/**
		 * @class SubscriberList
		 * @classdesc This class represents a list for Subscriber.
		 * @extends AbstractList
		 * @requires AbstractList
		 * @requires Subscriber
		 */
		function SubscriberList() {
			AbstractList.call(this);

			this._type = Subscriber;

			return this;
		}

		SubscriberList.prototype = Object.create(AbstractList.prototype);
		SubscriberList.prototype.constructor = SubscriberList;

		/**
		 *
		 * @param {String} subscriberId
		 */
		SubscriberList.prototype.removeSubscriberWithId = function(subscriberId) {
			for (var index in this._items) {
				var theSubscriber = this._items[index];
				if (theSubscriber.getSubscriberId() == subscriberId) this._items.splice(index, 1);
			}
		};

		return SubscriberList;
	})();
});
/**
 * This module representing a Context Widget.
 * 
 * @module Widget
 * @fileOverview
 */
define('widget',['MathUuid', 'callback', 'callbackList', 'attribute', 'attributeList', 'conditionList', 'subscriber', 'subscriberList'],
	function(MathUuid, Callback, CallbackList, Attribute, AttributeList, ConditionList, Subscriber, SubscriberList) {
		return (function() {
			/**
			 * Constructor: Generates the ID and initializes the
			 * Widget with attributes, callbacks and subscriber
			 * that are specified in the provided functions.
			 *
			 * @abstract
			 * @class Widget
			 * @classdesc The Widget handles the access to sensors.
			 * @requires MathUuid
			 * @requires Callback
			 * @requires CallbackList
			 * @requires Attribute
			 * @requires AttributeList
			 * @requires ConditionList
			 * @requires Subscriber
			 * @requires SubscriberList
			 * @requires Discoverer
			 * @constructs Widget
			 */
			function Widget(discoverer, attributes) {
				var self = this;

				/**
				 * @alias name
				 * @public
				 * @type {string}
				 * @memberof Widget#
				 * @desc Name of the Widget.
				 */
				this.name = 'Widget';

				/**
				 * @alias id
				 * @public
				 * @type {string}
				 * @memberof Widget#
				 * @desc ID of the Widget. Will be generated.
				 */
				this.id = Math.uuid();

				/**
				 *
				 * @protected
				 * @type {AttributeList}
				 * @memberof Widget#
				 * @desc All available Attributes and their values.
				 */
				this._outAttributes = new AttributeList();

				/**
				 * @alias oldAttributes
				 * @protected
				 * @type {AttributeList}
				 * @memberof Widget#
				 * @desc This temporary variable is used for storing the old attribute values.
				 * 			So these can be used to check conditions.
				 */
				this._oldOutAttributes = [];

				/**
				 * @alias constantAttributes
				 * @protected
				 * @type {AttributeList}
				 * @memberof Widget#
				 * @desc All available constant Attributes and their values.
				 */
				this._constantOutAttributes = new AttributeList();

				/**
				 * @alias callbacks
				 * @protected
				 * @type {CallbackList}
				 * @memberof Widget#
				 * @desc List of Callbacks.
				 */
				this._callbacks = new CallbackList();

				/**
				 * @alias subscribers
				 * @protected
				 * @type {SubscriberList}
				 * @memberof Widget#
				 * @desc List of Subscriber.
				 */
				this._subscribers = new SubscriberList();

				/**
				 * @alias discoverer
				 * @protected
				 * @type {Discoverer}
				 * @memberof Widget#
				 * @desc Associated discoverer.
				 */
				this._discoverer = discoverer;

				this._register();
				this._init(attributes);

				return this;
			}

			/**
			 * Returns the name of the widget.
			 *
			 * @public
			 * @alias getName
			 * @memberof Widget#
			 * @returns {string}
			 */
			Widget.prototype.getName = function() {
				return this.name;
			};

			/**
			 * Returns the id of the widget.
			 *
			 * @public
			 * @alias getId
			 * @memberof Widget#
			 * @returns {string}
			 */
			Widget.prototype.getId = function() {
				return this.id;
			};

			/**
			 * Returns the type of this class, in this case
			 * "Widget".
			 *
			 * @virtual
			 * @public
			 * @returns {string}
			 */
			//TODO: remove and replace with constructor comparison
			Widget.prototype.getType = function() {
				return 'Widget';
			};

			/**
			 * Returns the available AttributeTypes.
			 *
			 * @public
			 * @param {?AttributeList} attributes
			 * @returns {AttributeList}
			 */
			Widget.prototype.getOutAttributes = function(attributes) {
				// test if attributeList is a list
				if (attributes && attributes.constructor === AttributeList) {
					return this._outAttributes.getSubset(attributes);
				} else {
					return this._outAttributes;
				}
			};

			/**
			 * Returns the available ConstantAttributeTypes
			 * (attributes that do not change).
			 *
			 * @public
			 * @param {?AttributeList} attributes
			 * @returns {AttributeList}
			 */
			Widget.prototype.getConstantOutAttributes = function(attributes) {
				if (attributes && attributes.constructor === AttributeList) {
					return this._constantOutAttributes.getSubset(attributes);
				} else {
					return this._constantOutAttributes;
				}
			};

			/**
			 * Returns the last acquired attribute value with the given attribute type.
			 *
			 * @param {AttributeType} attributeType The attribute type to return the last value for.
			 * @returns {*}
			 */
			Widget.prototype.getValueForAttributeWithTypeOf = function(attributeType) {
				return this.getOutAttributes().getAttributeWithTypeOf(attributeType).getValue();
			};

			/**
			 * Returns the old Attributes.
			 *
			 * @private
			 * @alias getOldAttributes
			 * @memberof Widget#
			 * @returns {AttributeList}
			 */
			Widget.prototype.getOldAttributes = function() {
				return this._oldOutAttributes;
			};

			/**
			 * Returns a list of callbacks that can be
			 * subscribed to.
			 *
			 * @public
			 * @alias getCallbacks
			 * @memberof Widget#
			 * @returns {CallbackList}
			 */
			Widget.prototype.getCallbackList = function() {
				return this._callbacks;
			};

			/**
			 * Returns the specified callbacks that can be
			 * subscribed to.
			 *
			 * @public
			 * @alias getCallbacks
			 * @memberof Widget#
			 * @returns {Array}
			 */
			Widget.prototype.getCallbacks = function() {
				return this._callbacks.getItems();
			};

			Widget.prototype.queryServices = function() {
				return this.services;
			};

			/**
			 * Returns the Subscriber.
			 *
			 * @public
			 * @alias getSubscriber
			 * @memberof Widget#
			 * @returns {SubscriberList}
			 */
			Widget.prototype.getSubscriber = function() {
				return this._subscribers;
			};

			/**
			 * Sets the name of the Widget.
			 *
			 * @protected
			 * @alias setName
			 * @memberof Widget#
			 * @param {string} name Name of the Widget.
			 */
			Widget.prototype.setName = function(name) {
				if (typeof name === 'string') {
					this.name = name;
				}
			};

			/**
			 * Sets the id of the Widget.
			 *
			 * @protected
			 * @alias setId
			 * @memberof Widget#
			 * @param {string} id Id of the Widget.
			 */
			Widget._setId = function(id) {
				if (typeof id === 'string') {
					this.id = id;
				}
			};

			/**
			 * Sets the AttributeValueList and also the associated
			 * AttributeTypes.
			 *
			 * @protected
			 * @alias setAttributes
			 * @memberof Widget#
			 * @param {(AttributeList|Array)} attributes List or Array of AttributeValues
			 */
			Widget.prototype._setOutAttributes = function(attributes) {
				var list = [];
				if (attributes instanceof Array) {
					list = attributes.reduce(function(o, v, i) {
						o[i] = v;
						return o;
					}, {});
				} else if (attributes.constructor === AttributeList) {
					list = attributes.getItems();
				}
				this._oldOutAttributes = this._outAttributes;
				for ( var i in list) {
					var attribute = list[i];
					if (attribute.constructor === Attribute) {
						attribute.setTimestamp(this.getCurrentTime());
						this.outAttributes.put(attribute);

						//FIXME
						var type = new AttributeType().withName(attribute.getName())
							.withType(attribute.getType())
							.withParameters(attribute.getParameters());
						this.attributeTypes.put(type);
					}
				}
			};

			/**
			 * Adds a new AttributeValue. If the given value is
			 * not included in the list, the associated type will
			 * be also added. Otherwise, only the value will be
			 * updated.
			 *
			 * @public
			 * @param {Attribute} attribute
			 * @param {Boolean} multipleInstances
			 */
			Widget.prototype.addOutAttribute = function(attribute, multipleInstances) {
				multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
				if (attribute.constructor === Attribute) {
					if (!this._outAttributes.containsTypeOf(attribute)) {
						this._oldOutAttributes = this._outAttributes;
						attribute.setTimestamp(this.getCurrentTime());
						this._outAttributes.put(attribute, multipleInstances);
					}
				}
			};

			/**
			 * Sets the ConstantAttributeValueList and also the
			 * associated AttributeTypes.
			 *
			 * @protected
			 * @alias setConstantOutAttributes
			 * @memberof Widget#
			 * @param {(AttributeList|Array)} constantAttributes List or Array of AttributeValues
			 */
			Widget.prototype._setConstantOutAttributes = function(constantAttributes) {
				var list = [];
				if (constantAttributes instanceof Array) {
					list = constantAttributes;
				} else if (Class.isA(AttributeValueList, constantAttributes)) {
					list = constantAttributes.getItems();
				}
				for ( var i in list) {
					var constantAttribute = list[i];
					if (Class.isA(AttributeValue, constantAttribute)) {
						constantAttribute.setTimestamp(this.getCurrentTime());
						this.constantAttributes.put(constantAttribute);
						var type = new AttributeType().withName(constantAttribute.getName())
							.withType(constantAttribute.getType())
							.withParameters(constantAttribute.getParameters());
						this.constantAttributeTypes.put(type);
					}
				}
			};

			/**
			 * Adds a new constantAttributeValue. If the given value is
			 * not included in the list, the associated type will
			 * be also added. Otherwise, only the value will be
			 * updated.
			 *
			 * @protected
			 * @param {Attribute} constantAttribute AttributeValue
			 */
			Widget.prototype._addConstantOutAttribute = function(constantAttribute) {
				if (Class.isA(AttributeValue, constantAttribute)) {
					if (!this.constantAttributes
							.contains(constantAttribute)) {

						var type = new AttributeType().withName(constantAttribute.getName())
							.withType(constantAttribute.getType())
							.withParameters(constantAttribute.getParameters());
						this.constantAttributeTypes.put(type);
					}
					_attribute.setTimestamp(this.getCurrentTime());
					this.constantAttributes.put(constantAttribute);
				}
			};

			/**
			 * Sets Callbacks.
			 *
			 * @protected
			 * @alias setCallbacks
			 * @memberof Widget#
			 * @param {(CallbackList|Array)} callbacks List or Array of Callbacks.
			 */
			Widget.prototype._setCallbacks = function(callbacks) {
				var list = [];
				if (callbacks instanceof Array) {
					list = callbacks;
				} else if (callbacks.constructor === CallbackList) {
					list = callbacks.getItems();
				}
				for ( var i in list) {
					var callback = list[i];
					if (callback.constructor === Callback) {
						this.callbacks.put(callback);
					}
				}
			};

			/**
			 * Adds a new Callback.
			 *
			 * @protected
			 * @alias addCallback
			 * @memberof Widget#
			 * @param {Callback} callback List or Array of AttributeValues.
			 */
			Widget.prototype._addCallback = function(callback) {
				if (callback.constructor === Callback) {
					this._callbacks.put(callback);
				}
			};

			Widget.prototype._setServices = function(services) {
				this.services = services;
			};

			/**
			 * Sets SubscriberList.
			 *
			 * @protected
			 * @alias setSubscriber
			 * @memberof Widget#
			 * @param {(SubscriberList|Array)}  subscribers List or Array of Subscriber.
			 */
			Widget.prototype._setSubscriber = function(subscribers) {
				var list = [];
				if (subscribers instanceof Array) {
					list = subscribers;
				} else if (subscribers.constructor === SubscriberList) {
					list = subscribers.getItems();
				}
				for ( var i in list) {
					var singleSubscriber = list[i];
					if (singleSubscriber.constructor === Subscriber) {
						this.subscribers.put(singleSubscriber);
					}
				}
			};

			/**
			 * Adds a new Subscriber.
			 *
			 * @public
			 * @param {?Subscriber} subscriber Subscriber
			 */
			Widget.prototype.addSubscriber = function(subscriber) {
				if (subscriber && subscriber.constructor === Subscriber) {
					this._subscribers.put(subscriber);
				}
			};

			/**
			 * Removes the specified Subscriber.
			 *
			 * @public
			 * @param {Subscriber} subscriberId Subscriber
			 */
			Widget.prototype.removeSubscriber = function(subscriberId) {
				this._subscribers.removeSubscriberWithId(subscriberId);
			};

			/**
			 * Returns the current time.
			 *
			 * @private
			 * @returns {Date}
			 */
			Widget.prototype.getCurrentTime = function() {
				return new Date();
			};

			/**
			 * Verifies whether the specified attributes is a
			 * provided Attribute.
			 *
			 * @protected
			 * @alias isOutAttribute
			 * @memberof Widget#
			 * @param {Attribute} attribute
			 * @returns {boolean}
			 */
			Widget.prototype._isOutAttribute = function(attribute) {
				return !!this._outAttributes.containsTypeOf(attribute);
			};

			/**
			 * Initializes the provided Attributes.
			 *
			 * @abstract
			 * @protected
			 */
			Widget.prototype._initOutAttributes = function() {
				throw new Error("Abstract function!");
			};

			/**
			 * Initializes the provided ConstantAttributes.
			 *
			 * @abstract
			 * @protected
			 */
			Widget.prototype._initConstantOutAttributes = function() {
				throw new Error("Abstract function!");
			};

			/**
			 * Initializes the provided Callbacks.
			 *
			 * @abstract
			 * @protected
			 */
			Widget.prototype._initCallbacks = function() {
				throw new Error("Abstract function!");
			};

			/**
			 * Function for initializing. Calls all initFunctions
			 * and will be called by the constructor.
			 *
			 * @protected
			 */
			Widget.prototype._init = function(attributes) {
				this._initOutAttributes();
				this._initConstantOutAttributes();
				this._initCallbacks();

				this.didFinishInitialization(attributes);
			};

			/**
			 * Method will be invoked after the initialization of the widget finished.
			 * Can be overridden by inheriting classes to take action after initialization.
			 *
			 * @public
			 * @virtual
			 * @param attributes
			 */
			Widget.prototype.didFinishInitialization = function(attributes) {

			};

			/**
			 * Notifies other components and sends the attributes.
			 *
			 * @virtual
			 * @public
			 */
			Widget.prototype.notify = function() {
				var callbacks = this.getCallbacks();
				for (var i in callbacks) {
					this.sendToSubscriber(callbacks[i]);
				}
			};

			/**
			 * Queries the associated sensor and updates the attributes with new values.
			 * Must be overridden by the subclasses. Overriding subclasses can call
			 * this.__super(_function) to invoke the provided callback function.
			 *
			 * @virtual
			 * @public
			 * @param {?function} callback For alternative actions, because an asynchronous function can be used.
			 */
			Widget.prototype.sendToSubscriber = function(callback) {
				if (callback && typeof(callback) == 'function') {
					callback();
				}
			};

			/**
			 * Updates the attributes by calling queryGenerator.
			 *
			 * @public
			 * @alias updateWidgetInformation
			 * @memberof Widget#
			 * @param {?function} callback For alternative  actions, because an asynchronous function can be used.
			 *
			 */
			Widget.prototype.updateWidgetInformation = function(callback) {
				this.queryGenerator(callback);
			};

			/**
			 * Updates the Attributes by external components.
			 *
			 * @virtual
			 * @public
			 * @alias putData
			 * @memberof Widget#
			 * @param {(AttributeList|Array)} attributes Data that should be entered.
			 *
			 */
			Widget.prototype.putData = function(attributes) {
				var list = [];
				if (attributes instanceof Array) {
					list = attributes;
				} else if (attributes.constructor === AttributeList) {
					list = attributes.getItems();
				}
				for ( var i in list) {
					var theAttribute = list[i];
					if (theAttribute.type === Attribute && this.isOutAttribute(theAttribute)) {
						this.addOutAttribute(theAttribute);
					}
				}
			};

			/**
			 * Returns all available AttributeValues, Attributes and ConstantAttributes.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Widget.prototype.queryWidget = function() {
				var response = new AttributeList();
				response.putAll(this.getOutAttributes());
				response.putAll(this.getConstantOutAttributes());
				return response;
			};

			/**
			 * Updates and returns all available AttributeValues,
			 * Attributes and ConstantAtrributes.
			 *
			 * @public
			 * @alias updateAndQueryWidget
			 * @memberof Widget#
			 * @param {?function} callback For alternative  actions, because an asynchronous function can be used.
			 * @returns {?AttributeList}
			 */
			Widget.prototype.updateAndQueryWidget = function(callback) {
				if(callback && typeof(callback) === 'function'){
					this.queryGenerator(callback);
				} else {
					this.queryGenerator();
					return this.queryWidget();
				}
			};

			/**
			 * Sends all Attributes, specified in the given callback,
			 * to components which are subscribed to this Callback.
			 *
			 * @protected
			 * @param {string} callback Name of the searched Callback.
			 */
			Widget.prototype._sendToSubscriber = function(callback) {
				if (callback && callback.constructor === Callback) {
					var subscriberList = this.subscribers.getItems();
					for (var i in subscriberList) {
						var subscriber = subscriberList[i];
						if (subscriber.getSubscriptionCallbacks().contains(callback)) {
							if(this.dataValid(subscriber.getConditions())){
								var subscriberInstance = this._discoverer.getComponent(subscriber.getSubscriberId());
								var callSubset =  callback.getAttributeTypes();
								var subscriberSubset = subscriber.getAttributesSubset();
								var data = this.outAttributes.getSubset(callSubset);
								if (subscriberSubset && subscriberSubset.size() > 0) {
									data = data.getSubset(subscriberSubset);
								}
							}
							if (data) {
								subscriberInstance.putData(data);
							}
						}
					}
				}
			};

			/**
			 * Verifies if the attributes match to the specified conditions in case any exists.
			 *
			 * @private
			 * @alias dataValid
			 * @memberof Widget#
			 * @param {string} conditions List of Conditions that will be verified.
			 * @returns {boolean}
			 */
			Widget.prototype._dataValid = function(conditions) {
				if (conditions.constructor === ConditionList) {
					return true;
				}
				if (!conditions.isEmpty()) {
					var items = _condition.getItems();
					for (var i in items) {
						var condition = items[i];
						var conditionAttributeType = condition.getAttributeType();
						var conditionAttributeTypeList = new AttributeTypeList()
							.withItems(new Array(conditionAttributeType));
						var newValue = this.getAttributes().getSubset(conditionAttributeTypeList);
						var oldValue = this.getOldAttributes.getSubset(conditionAttributeTypeList);
						return condition.compare(newValue, oldValue);
					}
				}
				return false;
			};

			/**
			 * Runs the context acquisition constantly in an interval.
			 * Can be called by init.
			 *
			 * @virtual
			 * @protected
			 * @param {Number} interval Interval in ms
			 */
			Widget.prototype._intervalRunning = function(interval) {
				var self = this;
				if (interval === parseInt(interval)) {
					setInterval(function() {self.queryGenerator();}, interval);
				}
			};

			/**
			 * Sets the associated Discoverer and registers to that.
			 *
			 * @public
			 * @param {Discoverer} _discoverer Discoverer
			 */
			Widget.prototype.setDiscoverer = function(_discoverer) {
				if (!this._discoverer) {
					this._discoverer = _discoverer;
					this.register();
				}
			};

			/**
			 * Registers the component to the associated Discoverer.
			 *
			 * @protected
			 */
			Widget.prototype._register = function() {
				if (this._discoverer) {
					this._discoverer.registerNewComponent(this);
				}
			};

			/**
			 * Returns true if the widget can satisfy the requested attribute type.
			 *
			 * @public
			 * @param {AttributeType} attribute
			 * @returns {boolean}
			 */
			Widget.prototype.doesSatisfyTypeOf = function(attribute) {
				return this._outAttributes.containsTypeOf(attribute);
			};

			return Widget;
		})();
	}
);
/**
 * This module represents a InterpreterResult.
 * 
 * @module InterpreterResult
 * @fileOverview
 */
define('interpreterResult',['easejs', 'attributeList'],
    function(easejs, AttributeList){
    	var Class = easejs.Class;
    	
		var InterpreterResult = Class('InterpreterResult',{
					
			/**
			 * @alias timestamp
			 * @private
			 * @type {date}
			 * @memberof InterpreterResult#
			 * @desc Time of the interpretation.
			 */
			'private timestamp' : '',
			/**
			 * @alias outAttributes
			 * @private
			 * @type {AttributeValueList}
			 * @memberof InterpreterResult#
			 * @desc Interpreted data.
			 */
			'private outAttributes' : [],
				
			/**
			 * @alias inAttributes
			 * @private
			 * @type {AttributeValueList}
			 * @memberof InterpreterResult#
			 * @desc Data, which were used for the interpretation.
			 */
			'private inAttributes' : [],
			
			/**
			 * Constructor: Initializes the in- and outAttributes.
			 *
			 * @class InterpreterResult
			 * @classdesc Contains the interpreted data, inclusive the input for the interpretation.
			 * @requires easejs
			 * @requires AttributeValueList
			 */
			'public __construct' : function() {
				this.inAttributes = new AttributeValueList();
				this.outAttributes = new AttributeValueList();
			},
			
    		/**
			 * Builder for timestamp.
			 * 
			 * @public
			 * @alias withTimestamp
			 * @memberof InterpreterResult#
			 * @param {String} _timestamp timestamp
			 * @returns {InterpreterResult}
			 */
    		'public withTimestamp' : function(_timestamp){
    			this.setTimestamp(_timestamp);
    			return this;
    		},

    		/**
			 * Builder for outAttributes.
			 * 
			 * @public
			 * @alias withOutAttributes
			 * @memberof InterpreterResult#
			 * @param {(AttributeValueList|Array)} _outAttributes values
			 * @returns {InterpreterResult}
			 */
    		'public withOutAttributes' : function(_outAttributes){
    			this.setOutAttributes(_outAttributes);
    			return this;
    		},
    		
    		/**
			 * Builder for inAttributes.
			 * 
			 * @public
			 * @alias withInAttributes
			 * @memberof InterpreterResult#
			 * @param {(AttributeValueList|Array)} _inAttributes values
			 * @returns {InterpreterResult}
			 */
    		'public withInAttributes' : function(_inAttributes){
    			this.setInAttributes(_inAttributes);
    			return this;
    		},
    		
			
			/**
			 * Returns the interpretation time.
			 * 
			 * @public
			 * @alias getTimestamp
			 * @memberof InterpreterResult#
			 * @returns {date}
			 */
			'public getTimestamp' : function(){
				return this.timestamp;
			},
			
			/**
			 * Returns the interpreted attributes.
			 * 
			 * @public
			 * @alias getOutAttributes
			 * @memberof InterpreterResult#
			 * @returns {AttributeValueList}
			 */
			'public getOutAttributes' : function(){
				return this.outAttributes;
			},
			
			/**
			 * Returns the inAttributes.
			 * 
			 * @public
			 * @alias getInAttributes
			 * @memberof InterpreterResult#
			 * @returns {AttributeValueList}
			 */
			'public getInAttributes' : function(){
				return this.inAttributes;
			},

			/**
    		 * Sets the interpretation time.
    		 * 
    		 * @public
    		 * @alias setTimestamp
    		 * @memberof InterpreterResult#
    		 * @param {date} _timestamp interpretation time
    		 */
			'public setTimestamp' : function(_timestamp){
				if(_timestamp instanceof Date){
					this.type = _timestamp;
				}
			},
			
			/**
    		 * Sets the interpreted values.
    		 * 
    		 * @public
    		 * @alias setOutAttributes
    		 * @memberof InterpreterResult#
    		 * @param {(AttributeValueList|Array)} _outAttributes retrieved attributes
    		 */
			'public setOutAttributes' : function(_outAttributes){
				if (_outAttributes instanceof Array) {
					for(var i in _outAttributes){
						this.outAttributes.put(_outAttributes[i]);
					}
				} else if (Class.isA(AttributeValueList, _outAttributes)) {
					this.outAttributes = _outAttributes;
				}
			},
			
			/**
    		 * Sets the inAttributes.
    		 * 
    		 * @public
    		 * @alias setInAttributes
    		 * @memberof InterpreterResult#
    		 * @param {(AttributeValueList|Array)} _inAttributes inAttributes
    		 */
			'public setInAttributes' : function(_inAttributes){
				if (_inAttributes instanceof Array) {
					for(var i in _outAttributes){
						this.inAttributes.put(_inAttributes[i]);
					}
				} else if (Class.isA(AttributeValueList, _inAttributes)) {
					this.inAttributes = _inAttributes;
				}
			}

		});

		return InterpreterResult;
	
});
/**
 * This module represents an Context Interpreter.
 * 
 * @module Interpreter
 * @fileOverview
 */
define('interpreter',['MathUuid', 'attribute', 'attributeList', 'interpreterResult' ],
	function(MathUuid, Attribute, AttributeList, InterpreterResult) {
		return (function() {
			/**
			 * Constructor: Generates the id and initializes the (in and out) types and values.
			 *
			 * @abstract
			 * @class Interpreter
			 * @classdesc The Widget handles the access to sensors.
			 * @requires easejs
			 * @requires MathUuid
			 * @requires Attribute
			 * @requires AttributeList
			 * @constructs Interpreter
			 */
			function Interpreter(discoverer) {
				/**
				 * Name of the Interpreter.
				 *
				 * @public
				 * @type {string}
				 */
				this.name = 'Interpreter';

				/**
				 * Id of the Interpreter. Will be generated.
				 *
				 * @public
				 * @type {string}
				 */
				this.id = Math.uuid();

				/**
				 * Types of all attributes that can be handled.
				 *
				 * @protected
				 * @type {AttributeList}
				 */
				this._inAttributes = new AttributeList();

				/**
				 * Types of all attributes that will be returned.
				 *
				 * @protected
				 * @type {AttributeList}
				 */
				this._outAttributes = new AttributeList();

				/**
				 * Last interpretation time.
				 *
				 * @protected
				 * @type {?Date}
				 */
				this._lastInterpretation = null;

				/**
				 * @alias discoverer
				 * @protected
				 * @type {Discoverer}
				 * @memberof Interpreter#
				 * @desc Associated Discoverer.
				 */
				this._discoverer = discoverer;

				this._register();
				this._initInterpreter();

				return this;
			}

			/**
			 * Returns the name of the interpreter.
			 *
			 * @public
			 * @returns {string}
			 */
			Interpreter.prototype.getName = function() {
				return this.name;
			};

			/**
			 * Returns the id of the interpreter.
			 *
			 * @public
			 * @returns {string}
			 */
			Interpreter.prototype.getId = function() {
				return this.id;
			};

			/**
			 * Returns the type of this class, in this case "Interpreter".
			 *
			 * @public
			 * @returns {string}
			 */
			Interpreter.prototype.getType = function() {
				return 'Interpreter';
			};

			/**
			 * Initializes interpreter and sets the expected inAttributes and provided outAttributes.
			 *
			 * @private
			 */
			Interpreter.prototype._initInterpreter = function() {
				this._initInAttributes();
				this._initOutAttributes();
			};

			/**
			 * Initializes the inAttributes.
			 *
			 * @abstract
			 * @protected
			 */
			Interpreter.prototype._initInAttributes = function() {
				throw Error("Abstract function call!");
			};

			/**
			 * Initializes the outAttributes.
			 *
			 * @abstract
			 * @protected
			 */
			Interpreter.prototype._initOutAttributes = function() {
				throw Error("Abstract function call!");
			};

			/**
			 * Returns the expected inAttributeTypes.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Interpreter.prototype.getInAttributes = function() {
				return this._inAttributes;
			};

			/**
			 * Sets an inAttribute.
			 *
			 * @protected
			 * @param {Attribute} attribute
			 */
			Interpreter.prototype._setInAttribute = function(attribute) {
				this._inAttributes.put(attribute);
			};

			/**
			 * Sets an inAttributes.
			 *
			 * @protected
			 * @param {(AttributeList|Array)} attributesOrArray Attributes to set.
			 */
			Interpreter.prototype._setInAttributes = function(attributesOrArray) {
				this._inAttributes = new AttributeList().withItems(attributesOrArray);
			};

			/**
			 * Verifies whether the specified attribute is contained in inAttributeList.
			 *
			 * @protected
			 * @param {Attribute} attribute Attribute that should be verified.
			 * @return {boolean}
			 */
			Interpreter.prototype._isInAttribute = function(attribute) {
				return !!this._inAttributes.containsTypeOf(attribute);
			};

			/**
			 * Returns the provided outAttributeTypes.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Interpreter.prototype.getOutAttributes = function() {
				return this._outAttributes;
			};

			/**
			 * Adds an outAttribute.
			 *
			 * @protected
			 * @param {Attribute} attribute
			 */
			Interpreter.prototype._setOutAttribute = function(attribute) {
				this._outAttributes.put(attribute);
			};

			/**
			 * Sets an outAttributes.
			 *
			 * @protected
			 * @param {(AttributeList|Array)} attributesOrArray Attributes to set.
			 */
			Interpreter.prototype._setOutAttributes = function(attributesOrArray) {
				this._outAttributes = new AttributeList().withItems(attributesOrArray);
			};

			/**
			 * Verifies whether the specified attribute is contained in outAttributeList.
			 *
			 * @protected
			 * @param {Attribute} attribute Attribute that should be verified.
			 * @return {boolean}
			 */
			Interpreter.prototype._isOutAttribute = function(attribute) {
				return !!this._outAttributes.containsTypeOf(attribute);
			};

			/**
			 * Validates the data and calls interpretData.
			 *
			 * @public
			 * @param {AttributeList} inAttributes Data that should be interpreted.
			 * @param {AttributeList} outAttributes
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Interpreter.prototype.callInterpreter = function(inAttributes, outAttributes, callback) {
				var self = this;

				if (!inAttributes || !this._canHandleInAttributes(inAttributes)) throw "Empty input attribute list or unhandled input attribute.";
				if (!outAttributes || !this._canHandleOutAttributes(outAttributes)) throw "Empty output attribute list or unhandled output attribute.";

				this._interpretData(inAttributes, outAttributes, function(interpretedData) {
					var response = new AttributeList().withItems(interpretedData);

					if (!self._canHandleOutAttributes(response)) throw "Unhandled output attribute generated.";

					self._setInAttributes(inAttributes);
					self.lastInterpretation = new Date();

					if (callback && typeof(callback) == 'function'){
						callback(response);
					}
				});
			};

			/**
			 * Interprets the data.
			 *
			 * @abstract
			 * @protected
			 * @param {AttributeList} inAttributes
			 * @param {AttributeList} outAttributes
			 * @param {Function} callback
			 */
			Interpreter.prototype._interpretData = function (inAttributes, outAttributes, callback) {
				throw Error("Abstract function call!");
			};

			/**
			 * Checks whether the specified data match the expected.
			 *
			 * @protected
			 * @param {AttributeList|Array.<Attribute>} attributeListOrArray Data that should be verified.
			 */
			Interpreter.prototype._canHandleInAttributes = function(attributeListOrArray) {
				var list = [];
				if (attributeListOrArray instanceof Array) {
					list = attributeListOrArray;
				} else if (attributeListOrArray.constructor === AttributeList) {
					list = attributeListOrArray.getItems();
				}
				if (list.length == 0 || attributeListOrArray.size() != this.getInAttributes().size()) {
					return false;
				}
				for ( var i in list) {
					var inAtt = list[i];
					if (!this._isInAttribute(inAtt)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Checks whether the specified data match the expected.
			 *
			 * @protected
			 * @param {AttributeList|Array.<Attribute>} attributeListOrArray Data that should be verified.
			 */
			Interpreter.prototype._canHandleOutAttributes = function(attributeListOrArray) {
				var list = [];
				if (attributeListOrArray instanceof Array) {
					list = attributeListOrArray;
				} else if (attributeListOrArray.constructor === AttributeList) {
					list = attributeListOrArray.getItems();
				}
				if (list.length == 0 || attributeListOrArray.size() != this.getOutAttributes().size()) {
					return false;
				}
				for ( var i in list) {
					var inAtt = list[i];
					if (!this._isOutAttribute(inAtt)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Returns the time of the last interpretation.
			 *
			 * @public
			 * @returns {Date}
			 */
			Interpreter.prototype.getLastInterpretionTime = function() {
				return this._lastInterpretation;
			};

			/**
			 * Sets and registers to the associated Discoverer.
			 *
			 * @public
			 * @param {Discoverer} discoverer Discoverer
			 */
			Interpreter.prototype.setDiscoverer = function(discoverer) {
				if (!this._discoverer) {
					this._discoverer = discoverer;
					this._register();
				}
			};

			/**
			 * Registers the component to the associated Discoverer.
			 *
			 * @public
			 */
			Interpreter.prototype._register = function() {
				if (this._discoverer) {
					this._discoverer.registerNewComponent(this);
				}
			};

			/**
			 *
			 * @returns {boolean}
			 */
			Interpreter.prototype.hasOutAttributesWithInputParameters = function() {
				return this._outAttributes.hasAttributesWithInputParameters();
			};

			/**
			 *
			 * @returns {boolean}
			 */
			Interpreter.prototype.getOutAttributesWithInputParameters = function() {
				return this._outAttributes.getAttributesWithInputParameters();
			};

			/**
			 *
			 * @param {Attribute}attribute
			 * @returns {boolean}
			 */
			Interpreter.prototype.doesSatisfyTypeOf = function(attribute) {
				return this._outAttributes.containsTypeOf(attribute);
			};

			return Interpreter;
		})();
	}
);
/**
 * Created by tobias on 15.04.15.
 */
define('interpretation',['interpreter', 'attributeList'],
    function(Interpreter, AttributeList) {

        var Interpretation = (function() {

            function Interpretation(interpreterId, inAttributes, outAttributes) {
                this.interpreterId = interpreterId;
                this.inAttributeTypes = inAttributes;
                this.outAttributeTypes = outAttributes;

                return this;
            }

            return Interpretation;
        })();

        return Interpretation;
    }
);
/**
 * This module representing a Context Aggregator. 
 * It aggregates data from multiple widgets.
 * 
 * @module Aggregator
 * @fileOverview
 */
define('aggregator',['MathUuid', 'widget', 'attribute', 'attributeList', 'subscriber', 'subscriberList', 'callbackList', 'storage', 'interpreter', 'interpretation'],
 	function(MathUuid, Widget, Attribute, AttributeList, Subscriber, SubscriberList, CallbackList, Storage, Interpreter, Interpretation){
		return (function() {
			/**
			 * Constructor: Generates the id and initializes the Aggregator.
			 *
			 * @class Aggregator
			 * @extends Widget
			 * @classdesc The Widget handles the access to sensors.
			 * @requires MathUuid
			 * @requires CallbackList
			 * @requires Attribute
			 * @requires AttributeList
			 * @requires Subscriber
			 * @requires SubscriberList
			 * @requires Storage
			 * @requires Widget
			 * @constructs Aggregator
			 */
			function Aggregator(discoverer, attributes) {
				/**
				 * List of subscribed widgets referenced by ID.
				 *
				 * @protected
				 * @type {Array.<Widget>}
				 */
				this._widgets = [];

				/**
				 *
				 * @protected
				 * @type {Array.<Interpretation>}
				 */
				this._interpretations = [];

				/**
				 * Database of the Aggregator.
				 *
				 * @protected
				 * @type {Storage}
				 */
				this._db = new Storage("DB_Aggregator", 7200000, 5);

				Widget.call(this, discoverer, attributes);

				/**
				 * Name of the Aggregator.
				 *
				 * @public
				 * @type {string}
				 */
				this.name = 'Aggregator';
			}

			Aggregator.prototype = Object.create(Widget.prototype);
			Aggregator.prototype.constructor = Aggregator;

			/**
			 * Returns the type of this class, in this case "Aggregator".
			 *
			 * @override
			 * @public
			 * @returns {string}
			 */
			Aggregator.prototype.getType = function() {
				return 'Aggregator';
			};

			/**
			 * Sets Widget IDs.
			 *
			 * @protected
			 * @param {Array.<String>} widgetIds List of Widget IDs
			 */
			Aggregator.prototype._setWidgets = function(widgetIds){
				this._widgets = widgetIds;
			};

			/**
			 * Adds Widget ID.
			 *
			 * @public
			 * @param {String|Widget} widgetIdOrWidget Widget ID
			 */
			Aggregator.prototype.addWidget = function(widgetIdOrWidget){
				if (widgetIdOrWidget.constructor === Widget) {
					this._widgets.push(widgetIdOrWidget.getId());
				} else if(typeof widgetIdOrWidget == "string") {
					this._widgets.push(widgetIdOrWidget);
				}
			};

			/**
			 * Returns the available Widget IDs.
			 *
			 * @public
			 * @returns {Array}
			 */
			Aggregator.prototype.getWidgets = function() {
				return this._widgets;
			};

			/**
			 * Removes Widget ID from list.
			 *
			 * @protected
			 * @param {String} _widgetId Id of the Widget
			 */
			Aggregator.prototype._removeWidget = function(_widgetId) {
				var index = this._widgets.indexOf(_widgetId);
				if (index > -1) {
					this._widgets = this._widgets.splice(index, 1);
				}
			};

			/**
			 * Retrieves all Attributes of the specified widgets.
			 *
			 * @protected
			 */
			Aggregator.prototype._initOutAttributes = function() {
				if(this._widgets.length > 0){
					for(var i in this._widgets){
						var widgetId = this._widgets[i];
						/** @type {Widget} */
						var theWidget = this._discoverer.getComponent(widgetId);
						if (theWidget) {
							this._setOutAttributes(theWidget.getOutAttributes());
						}
					}
				}
			};

			/**
			 * Retrieves all ConstantAttributes of the specified widgets.
			 *
			 * @protected
			 */
			Aggregator.prototype._initConstantOutAttributes = function() {
				if(this._widgets.length > 0){
					for(var i in this._widgets){
						var widgetId = this._widgets[i];
						/** @type {Widget} */
						var theWidget = this._discoverer.getComponent(widgetId);
						if (theWidget) {
							this._setConstantOutAttributes(theWidget.getConstantOutAttributes());
						}
					}
				}
			};

			/**
			 * Retrieves all actual Callbacks of the specified Widgets.
			 *
			 * @protected
			 * @override
			 */
			Aggregator.prototype._initCallbacks = function() {
				if(this._widgets.length > 0){
					for(var i in this._widgets){
						var widgetId = this._widgets[i];
						this.initWidgetSubscription(widgetId);
					}
				}
			};

			/**
			 * Start the setup of the aggregator after the initialisation has finished.
			 *
			 * @public
			 * @override
			 * @param {AttributeList} attributes
			 */
			Aggregator.prototype.didFinishInitialization = function(attributes) {
				this._aggregatorSetup(attributes);
			};

			/**
			 * InitMethod for Aggregators. Called by constructor. Initializes the associated Storage.
			 *
			 * @protected
			 */
			Aggregator.prototype._aggregatorSetup = function(attributes) {
				this._setAggregatorAttributeValues(attributes);
				this._setAggregatorConstantAttributeValues();
				this._setAggregatorCallbacks();

				this.didFinishSetup();
			};

			/**
			 * Initializes the provided attributeValues that are only specific to the Aggregator.
			 * Called by aggregatorSetup().
			 *
			 * @virtual
			 * @protected
			 */
			Aggregator.prototype._setAggregatorAttributeValues = function(attributes) {
				for (var index in attributes) {
					var theAttribute = attributes[index];
					this.addOutAttribute(theAttribute);
				}
			};

			/**
			 * Initializes the provided ConstantAttributeValues that are only specific to the Aggregator.
			 * Called by aggregatorSetup().
			 *
			 * @virtual
			 * @protected
			 */
			Aggregator.prototype._setAggregatorConstantAttributeValues = function() {

			};

			/**
			 * Initializes the provided Callbacks that are only specific to the Aggregator.
			 * Called by aggregatorSetup().
			 *
			 * @virtual
			 * @protected
			 */
			Aggregator.prototype._setAggregatorCallbacks = function() {

			};

			/**
			 * Returns the current Attributes that are saved in the cache.
			 *
			 * @public
			 * @returns {AttributeList}
			 */
			Aggregator.prototype.getCurrentData = function() {
				return this._outAttributes;
			};

			/**
			 * Subscribes to the given widget for the specified Callbacks.
			 *
			 * @protected
			 * @param {Widget} widget Widget that should be subscribed to.
			 * @param {CallbackList} callbacks required Callbacks
			 * @param subSet
			 * @param conditions
			 */
			Aggregator.prototype._subscribeTo = function(widget, callbacks, subSet, conditions){
				if(widget.constructor === Widget){
					var subscriber = new Subscriber().withSubscriberId(this.id).
						withSubscriberName(this.name).
						withSubscriptionCallbacks(callbacks).
						withAttributesSubset(subSet).
						withConditions(conditions);
					widget.addSubscriber(subscriber);
				}
			};

			/**
			 * Subscribes to the widgets that are defined in the Widget ID List
			 * used in the initCallback method.
			 *
			 * @protected
			 * @param {String} widgetId Widget that should be subscribed.
			 * @returns {?CallbackList}
			 */
			Aggregator.prototype._initWidgetSubscription = function(widgetId) {
				var callbacks = null;
				if(typeof widgetId == "string"){
					/** @type {Widget} */
					var theWidget = this._discoverer.getComponent(widgetId);
					if (theWidget) {
						//subscribe to all callbacks
						callbacks = theWidget.getCallbackList();
						this.subscribeTo(theWidget, callbacks);
					}
				}
				return callbacks;
			};

			/**
			 * Adds the specified callbacks of a widget to the aggregator.
			 *
			 * @public
			 * @param {String|Widget} widgetIdOrWidget Widget that should be subscribed.
			 * @param {CallbackList} callbackList required Callbacks
			 */
			Aggregator.prototype.addWidgetSubscription = function(widgetIdOrWidget, callbackList){
				if (widgetIdOrWidget.constructor === Widget) {
					if (!callbackList || callbackList.constructor !== CallbackList) {
						callbackList = widgetIdOrWidget.getCallbackList();
					}
					widgetIdOrWidget = widgetIdOrWidget.getId();
				}
				if(typeof widgetIdOrWidget == "string" && callbackList.constructor === CallbackList) {
					/** @type {?Widget} */
					var theWidget = this._discoverer.getComponent(widgetIdOrWidget);
					if (theWidget) {
						this._subscribeTo(theWidget, callbackList);
						this._callbacks.putAll(callbackList);
						var callsList = callbackList.getItems();
						for(var x in callsList){
							var singleCallback = callsList[x];
							var typeList = singleCallback.getAttributeTypes().getItems();
							for(var y in typeList){
								var singleType = typeList[y];
								this.addOutAttribute(singleType);
							}
						}
						this.addWidget(widgetIdOrWidget);
					}
				}
			};

			/**
			 * Removes subscribed Widgets and deletes the entry
			 * for subscribers in the associated Widget.
			 *
			 * @public
			 * @param {String} widgetId Widget that should be removed.
			 */
			Aggregator.prototype.unsubscribeFrom = function(widgetId) {
				if(typeof widgetId == "string") {
					var widget = this._discoverer.getComponent(widgetId);
					if (widget) {
						console.log('aggregator unsubscribeFrom: ' + widget.getName());
						widget.removeSubscriber(this.id);
						this._removeWidget(widgetId);
					}
				}
			};

			/**
			 * Puts context data to Widget and expects an array.
			 *
			 * @override
			 * @public
			 * @param {(AttributeList|Array)}  _data data that shall be input
			 */
			Aggregator.prototype.putData = function(attributeListOrArray){
				var list = [];
				if(attributeListOrArray instanceof Array){
					list = attributeListOrArray;
				} else if (attributeListOrArray.constructor === AttributeList) {
					list = attributeListOrArray.getItems();
				}
				for(var i in list){
					var theAttribute = list[i];
					if(theAttribute.constructor === Attribute && this._isOutAttribute(theAttribute)){
						this.addOutAttribute(theAttribute);
						if(this._db){
							this._store(theAttribute);
						}
					}
				}
			};

			/**
			 * Calls the given Interpreter for interpretation the data.
			 *
			 * @public
			 * @param {String} interpreterId ID of the searched Interpreter
			 * @param {AttributeList} inAttributes
			 * @param {AttributeList} outAttributes
			 * @param {?function} callback for additional actions, if an asynchronous function is used
			 */
			Aggregator.prototype.interpretData = function(interpreterId, inAttributes, outAttributes, callback){
				var interpreter = this._discoverer.getComponent(interpreterId);
				if (interpreter.constructor === Interpreter) {
					interpreter.callInterpreter(inAttributes, outAttributes, callback);
				}
			};

			/**
			 * Stores the data.
			 *
			 * @protected
			 * @param {Attribute} attribute data that should be stored
			 */
			Aggregator.prototype._store = function(attribute) {
				this._db.store(attribute);
			};

			/**
			 * Queries the database and returns the last retrieval result.
			 * It may be that the retrieval result is not up to date,
			 * because an asynchronous function is used for the retrieval.
			 * For retrieving the current data, this function can be used as callback function
			 * in retrieveStorage().
			 *
			 * @public
			 * @param {String} name Name of the searched AtTributes.
			 * @param {?function} callback for alternative  actions, because an asynchronous function is used
			 */
			Aggregator.prototype.queryAttribute = function(name, callback){
				this._db.retrieveAttributes(name, callback);
			};

			/**
			 * Queries a specific table and only actualizes the storage cache.
			 * For an alternativ action can be used a callback.
			 *
			 * @public
			 * @returns {RetrievalResult}
			 */
			Aggregator.prototype.retrieveStorage = function() {
				return this._db.getCurrentData();
			};

			/**
			 * Returns an overview about the stored attributes.
			 * It may be that the overview about the stored attributes is not up to date,
			 * because an asynchronous function is used for the retrieval.
			 * For retrieving the current data, this function can be used as callback function
			 * in queryTables().
			 *
			 * @public
			 * @returns {?Array}
			 */
			Aggregator.prototype.getStorageOverview = function() {
				return this._db.getAttributesOverview();
			};

			/**
			 * Only updates the attribute cache in the database.
			 * For an alternative action a callback can be used.
			 *
			 * @public
			 * @param {?function} callback for alternative actions, because an asynchronous function is used
			 */
			Aggregator.prototype.queryTables = function(callback) {
				this._db.getAttributeNames(callback);
			};

			/**
			 * Updates the information for the widget with the provided ID and calls the callback afterwards.
			 *
			 * @public
			 * @virtual
			 * @param {String} widgetId The ID of the widget to query.
			 * @param {Callback} callback The callback to query after the widget was updated.
			 */
			Aggregator.prototype.queryReferencedWidget = function(widgetId, callback) {
				this._discoverer.getWidget(widgetId).updateWidgetInformation(callback);
			};

			/**
			 * Returns the UUIDs of all connected widgets and interpreters.
			 *
			 * @private
			 * @returns {Array.<T>} The UUIDs.
			 */
			Aggregator.prototype.getComponentUUIDs = function() {
				var uuids = [];
				uuids = uuids.concat(this._widgets);
				for (var index in this._interpretations) {
					var theInterpretation = this._interpretations[index];
					uuids.push(theInterpretation.interpreterId);
				}
				return uuids;
			};

			/**
			 * Return true if a component with the provided UUID was connected to the aggregator.
			 *
			 * @private
			 * @alias hasComponent
			 * @memberof Aggregator#
			 * @param {String} uuid The UUID of the component to check.
			 * @returns {boolean}
			 */
			Aggregator.prototype._hasComponent = function(uuid) {
				return jQuery.inArray(uuid, this.getComponentUUIDs()) != -1;
			};

			/**
			 *
			 * @override
			 * @public
			 * @param {Attribute} attribute
			 * @returns {boolean}
			 */
			Aggregator.prototype.doesSatisfyTypeOf = function(attribute) {
				var componentUUIDs = this.getComponentUUIDs();
				var doesSatisfy = false;

				for (var index in componentUUIDs) {
					var theComponent = this._discoverer.getComponent(componentUUIDs[index]);
					if (theComponent.doesSatisfyTypeOf(attribute)) {
						doesSatisfy = true;
					}
				}

				return doesSatisfy;
			};

			/**
			 * Searches for components that can satisfy the requested attributes. Through recursion it is possible to search
			 * for components that satisfy attributes of components that have been found in the process.
			 *
			 * @private
			 * @param {AttributeList} unsatisfiedAttributes A list of attributes that components should be searched for.
			 * @param {boolean} all If true all attributes must be satisfied by a single component.
			 * @param {Array} componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
			 */
			Aggregator.prototype._getComponentsForUnsatisfiedAttributes = function(unsatisfiedAttributes, all, componentTypes) {
				// ask the discoverer for components that satisfy the requested components
				var relevantComponents = this._discoverer.getComponentsByAttributes(unsatisfiedAttributes, all, componentTypes);
				console.log("I found "+relevantComponents.length+" component(s) that might satisfy the requested attributes.");

				// iterate over all found components
				for(var index in relevantComponents) {
					// get the component
					var theComponent = relevantComponents[index];
					console.log("Let's look at component "+theComponent.getName()+".");

					// if the component was added before, ignore it
					if (!this._hasComponent(theComponent.getId())) {
						var outAttributes = theComponent.getOutAttributes().getItems();

						// if component is a widget and it wasn't added before, subscribe to its callbacks
						if (theComponent.constructor === Widget) {
							console.log("It's a widget.");

							this.addWidgetSubscription(theComponent);
							// remove satisfied attributes
							for (var widgetOutAttributeIndex in outAttributes) {
								var widgetOutAttribute = outAttributes[widgetOutAttributeIndex];
								// add the attribute type to the aggregators list of handled attribute types
								if (!this.getOutAttributes().containsTypeOf(widgetOutAttribute)) this.addOutAttribute(widgetOutAttribute);
								console.log("I can now satisfy attribute "+widgetOutAttribute+" with the help of "+theComponent.getName()+"! That was easy :)");
								unsatisfiedAttributes.removeAttributeWithTypeOf(widgetOutAttribute);
							}
						} else if (theComponent.constructor === Interpreter) { // if the component is an interpreter and all its in attributes can be satisfied, add the interpreter
							console.log("It's an interpreter.");

							var inAttributes = theComponent.getInAttributes().getItems();
							var canSatisfyInAttributes = true;

							// iterate over the attributes needed to satisfy the interpreter
							for (var inAttributeIdentifier in inAttributes) {
								// get the attribute
								var theInAttribute = inAttributes[inAttributeIdentifier];
								console.log("The interpreter needs the attribute "+theInAttribute+".");

								// if required attribute is not already satisfied by the aggregator search for components that do
								if (!this.doesSatisfyTypeOf(theInAttribute)) {
									console.log("It seems that I can't satisfy "+theInAttribute+", but I will search for components that can.");
									var newAttributeList = new AttributeList();
									newAttributeList.put(theInAttribute);
									this._getComponentsForUnsatisfiedAttributes(newAttributeList, false, [Widget, Interpreter]);
									// if the attribute still can't be satisfied drop the interpreter
									if (!this.doesSatisfyTypeOf(theInAttribute)) {
										console.log("I couldn't find a component to satisfy "+theInAttribute+". Dropping interpreter "+theComponent.getName()+". Bye bye.");
										canSatisfyInAttributes = false;
										break;
									}
								} else {
									console.log("It seems that I already satisfy the attribute "+theInAttribute+". Let's move on.");
								}
							}

							if (canSatisfyInAttributes) {
								// remove satisfied attribute
								for (var interpreterOutAttributeIndex in outAttributes) {
									var interpreterOutAttribute = outAttributes[interpreterOutAttributeIndex];
									// add the attribute type to the aggregators list of handled attribute types
									for (var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()) {
										var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
										if (theUnsatisfiedAttribute.equalsTypeOf(interpreterOutAttribute)) {
											this.addOutAttribute(theUnsatisfiedAttribute);
											console.log("I can now satisfy attribute "+theUnsatisfiedAttribute+" with the help of "+theComponent.getName()+"! Great!");
											this._interpretations.push(new Interpretation(theComponent.getId(), theComponent.getInAttributes(), new AttributeList().withItems([theUnsatisfiedAttribute])));
										}
									}
									unsatisfiedAttributes.removeAttributeWithTypeOf(interpreterOutAttribute, true);
								}
							} else {
								console.log("Found interpreter but can't satisfy required attributes.");
								for (var j in theComponent.getInAttributes().getItems()) {
									console.log("Missing "+theComponent.getInAttributes().getItems()[j]+".");
								}
							}
						}
					} else {
						console.log("Aggregator already has component "+theComponent.getName()+". Nothing to do here ;)");
					}
				}
			};

			/**
			 * After the aggregator finished its setup start searching for component that satisfy the attributes that where requrested.
			 *
			 * @public
			 * @virtual
			 */
			Aggregator.prototype.didFinishSetup = function() {
				var unsatisfiedAttributes = this.getOutAttributes().clone();

				// get all widgets that satisfy attribute types
				this._getComponentsForUnsatisfiedAttributes(unsatisfiedAttributes, false, [Widget]);
				// get all interpreters that satisfy attribute types
				this._getComponentsForUnsatisfiedAttributes(unsatisfiedAttributes, false, [Interpreter]);

				console.log("Unsatisfied attributes: "+unsatisfiedAttributes.size());
				console.log("Satisfied attributes: "+this.getOutAttributes().size());
				console.log("Interpretations "+this._interpretations.length);
			};

			/**
			 * Updates all the widgets referenced by the aggregator and calls the provided callback afterwards.
			 *
			 * @public
			 * @virtual
			 * @param {Function} callback The callback to query after all the widget where updated.
			 */
			Aggregator.prototype.queryReferencedWidgets = function(callback) {
				var self = this;
				var completedQueriesCounter = 0;

				if (this._widgets.length > 0) {
					for (var index in this._widgets) {
						var theWidgetId = this._widgets[index];
						this.queryReferencedWidget(theWidgetId, function () {
							completedQueriesCounter++;
							if (completedQueriesCounter == self._widgets.length) {
								if (callback && typeof(callback) == 'function') {
									callback(self.getOutAttributes());
								}
							}
						});
					}
				} else {
					if (callback && typeof(callback) == 'function') {
						callback(self.getOutAttributes());
					}
				}
			};

			/**
			 * Let's all connected interpreters interpret data.
			 *
			 * @public
			 * @param {function} _callback The callback to query after all the interpreters did interpret data.
			 */
			Aggregator.prototype.queryReferencedInterpreters = function(callback) {
				var self = this;
				var completedQueriesCounter = 0;

				if (this.interpretations.length > 0) {
					for (var index in this.interpretations) {
						var theInterpretation = this.interpretations[index];
						var theInterpreterId = theInterpretation.interpreterId;
						var interpretationInAttributeValues = this.getOutAttributes(theInterpretation.inAttributeTypes);
						var interpretationOutAttributeValues = this.getOutAttributes(theInterpretation.outAttributeTypes);

						self.interpretData(theInterpreterId, interpretationInAttributeValues, interpretationOutAttributeValues, function(_interpretedData) {
							for (var j in _interpretedData.getItems()) {
								var theInterpretedData = _interpretedData.getItems()[j];

								self.addOutAttribute(theInterpretedData);
								if (self.db){
									self.store(theInterpretedData);
								}
							}

							completedQueriesCounter++;
							if (completedQueriesCounter == self.interpretations.length) {
								if (callback && typeof(callback) == 'function') {
									callback(self.getOutAttributes());
								}
							}
						});
					}
				} else {
					if (callback && typeof(callback) == 'function') {
						callback(self.getOutAttributes());
					}
				}
			};

			/**
			 * Query all referenced widgets and afterwards all connected interpreters.
			 *
			 * @public
			 * @alias queryReferencedComponents
			 * @memberof Aggregator#
			 * @param {Function} callback the callback to query after all components did finish their work.
			 */
			Aggregator.prototype.queryReferencedComponents = function(callback) {
				var self = this;

				this.queryReferencedWidgets(function(_attributeValues) {
					self.queryReferencedInterpreters(function(_attributeValues) {
						if (callback && typeof(callback) == 'function') {
							callback(_attributeValues);
						}
					});
				});
			};

			return Aggregator;
		})();
	}
);
/**
 * This module represents the conditionMethod Equals. 
 * 
 * @module Equals
 * @fileOverview
 */
define('equals',['easejs', 'conditionMethod'],
 	function(easejs, ConditionMethod){
 	var Class = easejs.Class;
 	/**
	 * @class Equals
	 * @implements {ConditionMethod}
	 * @classdesc This class is the conditionMethod equals. 
	 * 			  It compares the values of two attributes.
	 * @requires easejs
	 * @requires conditionMethod
	 */
	var Equals = Class('Equals').implement( ConditionMethod ).extend(
	{
		/**
		 * Processes the equation.
		 * 
		 * @public
		 * @alias process
		 * @memberof Equals#
		 * @param {*} reference Is not used.
		 * @param {*} firstValue Value (from an attribute) that should be compared. 
		 * @param {*} secondValue Value (from an attribute) for comparison.
		 * @returns {boolean}
		 */
		'public process': function( reference, firstValue, secondValue){
			if(firstValue === secondValue){
				return true;
			}
			return false;
		},
		
		});

	return Equals;
});
/**
 * This module represents the conditionMethod Equals. 
 * 
 * @module Equals
 * @fileOverview
 */
define('unequals',['easejs', 'conditionMethod'],
 	function(easejs, ConditionMethod){
 	var Class = easejs.Class;
 	/**
	 * @class Equals
	 * @implements {ConditionMethod}
	 * @classdesc This class is the conditionMethod equals. 
	 * 			  It compares the values of two attributes.
	 * @requires easejs
	 * @requires conditionMethod
	 */
	var UnEquals = Class('UnEquals').implement( ConditionMethod ).extend(
	{
		/**
		 * Processes the equation.
		 * 
		 * @public
		 * @alias process
		 * @memberof Equals#
		 * @param {*} reference Is not used.
		 * @param {*} firstValue Value (from an attribute) that should be compared.
		 * @param {*} secondValue Value (from an attribute) for comparison.
		 * @returns {boolean}
		 */
		'public process': function( reference, firstValue, secondValue){
			if(firstValue !== secondValue){
				return true;
			}
			return false;
		},
		
		});

	return UnEquals;
});
/**
 * This module representing a Context Discoverer.
 * 
 * @module Discoverer
 * @fileOverview
 */
define('discoverer',[ 'easejs', 'attributeList', 'widget', 'interpreter', 'aggregator' ], function(easejs,
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
	define('contactJS',['retrievalResult',
			'storage',
			'aggregator',
		    'attribute',
		    'attributeList',
		    'parameter',
		    'parameterList',		
		    'condition',
		    'conditionList',
		    'conditionMethod',
		    'equals',
            'unequals',

		    'discoverer',
		    'interpreter',
		    'interpreterResult',
		    'callback',   
		    'callbackList',
		    'subscriber',
		    'subscriberList',
		    'widget',
		    'abstractList'], 
		function(RetrievalResult,
				Storage,
				Aggregator,
			    Attribute,
			    AttributeList,
			    Parameter,
			    ParameterList,		
			    Condition,
			    ConditionList,
			    ConditionMethod,
			    Equals,
                UnEquals,
			    Discoverer,
			    Interpreter, 
			    InterpreterResult,
			    Callback,   
			    CallbackList,
			    Subscriber,
			    SubscriberList,
			    Widget,
			    AbstractList) {
		
	// Object Contructor
	var contactJS = function(obj) {
		return obj;
	};
	contactJS.VERSION = '1.2.0';
	// Methods
	contactJS.RetrievalResult = RetrievalResult;
	contactJS.Storage = Storage;
	contactJS.Aggregator = Aggregator;
	contactJS.Attribute = Attribute;
	contactJS.AttributeList = AttributeList;
	contactJS.Parameter = Parameter;
	contactJS.ParameterList = ParameterList;
	contactJS.Condition = Condition;
	contactJS.ConditionList = ConditionList;
	contactJS.ConditionMethod = ConditionMethod;
	contactJS.Equals = Equals;
    contactJS.UnEquals = UnEquals;
	contactJS.Discoverer = Discoverer;
	contactJS.Interpreter = Interpreter;
	contactJS.InterpreterResult = InterpreterResult;
	contactJS.Callback = Callback;
	contactJS.CallbackList = CallbackList;
	contactJS.Subscriber = Subscriber;
	contactJS.SubscriberList = SubscriberList;
	contactJS.Widget = Widget;
	contactJS.AbstractList = AbstractList;
	return contactJS;
});
 	define('easejs', function() {
    return easejs;
  });
  define('jquery', function() {
    return $;
  });
  define('MathUuid', function() {
    return MathUuid;
  });
 
  return require('contactJS');
}));