define(['attribute', 'attributeList', 'retrievalResult', 'parameter', 'parameterList'],
 	function(Attribute, AttributeList, RetrievalResult, Parameter, ParameterList){
		return (function() {
			/**
			 * Initializes the database and all return values.
			 *
			 * @classdesc Storage handles the access to the database.
			 * @param {String} name
			 * @param {Number} time
			 * @param {Number} counter
			 * @param {Aggregator} aggregator
			 * @returns {Storage}
			 * @constructs Storage
			 */
			function Storage(name, time, counter, aggregator) {
				/**
				 * @type {Aggregator}
				 */
				this._parent = aggregator;

				/**
				 * Names of all stored Attributes (tableNames as string).
				 *
				 * @type {Array}
				 * @private
				 */
				this._attributeNames = [];

				/**
				 * Data of a retrieval.
				 *
				 * @type {RetrievalResult}
				 * @private
				 */
				this._attributes = new RetrievalResult();

				/**
				 * Cache before storing the new data in the database.
				 *
				 * @type {AttributeList}
				 * @private
				 */
				this._data = new AttributeList();

				/**
				 * Names of all stored Attributes.
				 *
				 * @type {Number}
				 * @private
				 */
				this._dataCount = 0;

				/**
				 * Time of the last flush.
				 *
				 * @type {Date}
				 * @private
				 */
				this._lastFlush = new Date();

				/**
				 * Condition (ms) at which point of time data are supposed to be flushed.
				 * If the value is more than the value of 'timeCondition' ago, data should be
				 * flushed again. The initial value is two hours.
				 *
				 * @type {Number}
				 * @private
				 */
				this._timeCondition = 7200000;

				/**
				 * Condition at which point of time data are supposed to be flushed.
				 * If at least 'countCondition' attributes are collected data will be flushed.
				 * Initial value is 5.
				 *
				 * @type {Number}
				 * @private
				 */
				this._countCondition = 5;

				/**
				 * Associated database.
				 *
				 * @type {Database}
				 * @private
				 */
				this._db = '';

				this._initStorage(name);
				if(time && time === parseInt(time) && time != 0) this._timeCondition = time;
				if(counter && counter === parseInt(counter) && counter != 0) this._countCondition = counter;

				return this;
			}

			/**
			 * Returns the last retrieved Attributes.
			 *
			 * @returns {RetrievalResult}
			 */
			Storage.prototype.getCurrentData = function() {
				return this._attributes;
			};

			/**
			 * Returns the names of all stored Attributes (tableNames as string).
			 *
			 * @returns {Array}
			 */
			Storage.prototype.getAttributesOverview = function() {
				return this._attributeNames;
			};

			/**
			 * Initializes a new database.
			 *
			 * @private
			 * @param {String} name Name of the database.
			 */
			Storage.prototype._initStorage = function(name){
				if(!window.openDatabase) {
					this._parent.log('Databases are not supported in this browser.');
				}else{
					this._db = window.openDatabase(name, "1.0", "DB_" + name, 1024*1024);
					this._parent.log('I will initialize storage with name '+name+".");
				}
			};

			/**
			 * Creates a new table. A table contains the values of one AttributeType.
			 * So the name is the AttributeName.
			 *
			 * @private
			 * @param {Attribute} attribute tableName (should be the attributeName)
			 * @param {?function} callback For alternative actions, if an asynchronous function is used.
			 */
			Storage.prototype._createTable = function(attribute, callback){
				if(this._db){
					var tableName = this._tableName(attribute);
					var statement = 'CREATE TABLE IF NOT EXISTS "' + tableName + '" (value_, type_, created_)';
					this._parent.log('CREATE TABLE IF NOT EXISTS "' + tableName + '"');
					if(callback && typeof(callback) == 'function'){
						this._db.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, callback);
					} else {
						this._db.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, this._successCB);
					}
					if(!this._attributeNames.indexOf(attribute.getName()) > -1){
						this._attributeNames.push(tableName);
					}
				}
			};

			/**
			 * Inserts value into a table. The name of the given Attribute
			 * identifies the table.
			 *
			 * @private
			 * @param {Attribute} attribute Attribute that should be stored.
			 * @param {?function} callback For alternative actions, if an asynchronous function is used.
			 */
			Storage.prototype._insertIntoTable = function(attribute, callback){
				if(this._db && attribute && attribute.constructor === Attribute){
					var tableName = this._tableName(attribute);
					var statement = 'INSERT INTO "' + tableName
						+ '" (value_, type_, created_) VALUES ("'
						+ attribute.getValue() + '", "'
						+ attribute.getType() + '", "'
						+ attribute.getTimestamp() + '")';
					this._parent.log('INSERT INTO "'+tableName+'" VALUES ('+attribute.getValue()+", "+attribute.getType()+", "+attribute.getTimestamp());
					if(callback && typeof(callback) == 'function'){
						this._db.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, callback);
					} else {
						this._db.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, this._successCB);
					}
				}
			};

			/**
			 * error function
			 *
			 * @callback
			 * @private
			 */
			Storage.prototype._errorCB = function(err) {
				console.log("Error processing SQL: "+err.message);
			};

			/**
			 * success function
			 *
			 * @callback
			 * @private
			 */
			Storage.prototype._successCB = function() {
				console.log("SQL processed successfully!");
			};


			/**
			 * Sets the attributeNames array.
			 *
			 * @param {?function} [callback] For alternative actions, if an asynchronous function is used.
			 */
			Storage.prototype.getAttributeNames = function(callback){
				if(this._db){
					var self = this;
					this._db.transaction(function(tx) {
							self._queryTables(tx, self, callback);
						}, function(error) {
							self._errorCB(error);
						}
					);
				}
			};

			/**
			 * Sets the attributeNames array. Is used in getAttributeNames().
			 *
			 * @callback
			 * @private
			 * @param {*} tx
			 * @param {Storage} self
			 * @param {?function} callback For alternative actions, if an asynchronous function is used.
			 */
			Storage.prototype._queryTables = function(tx, self, callback){
				var statement = "SELECT * from sqlite_master WHERE type = 'table'";
				tx.executeSql(statement, [], function(tx,results) {
						self._queryTableSuccess(tx, results, self, callback);
					}, function(error) {
						self._errorCB(error);
				});
			};

			/**
			 * Success function for queryTable.
			 *
			 * @callback
			 * @private
			 * @param {*} tx
			 * @param {*} results
			 * @param {Storage} self
			 * @param {?function} callback
			 */
			Storage.prototype._queryTableSuccess = function(tx, results, self, callback){
				self._attributeNames = [];
				var len = results.rows.length;
				for(var i=0; i<len; i++){
					var table = results.rows.item(i).name;
					if(table.indexOf("DatabaseInfoTable") == -1){
						self._attributeNames.push(results.rows.item(i).name);
					}

				}
				if(callback && typeof(callback) == 'function'){
					callback();
				}
			};

			/**
			 * Verifies if a table for an attribute exists.
			 *
			 * @private
			 * @param {(Attribute|String)} attributeOrName Attribute or name for the verification.
			 * @returns {boolean}
			 */
			Storage.prototype._tableExists = function(attributeOrName){
				if(attributeOrName.constructor === Attribute){
					var name = this._tableName(attributeOrName);
					return this._attributeNames.indexOf(name) > -1;
				} else if(typeof attributeOrName === 'string'){
					return this._attributeNames.indexOf(attributeOrName) > -1;
				}
				return false;
			};

			/**
			 * Retrieves a table and sets the RetrievalResult.
			 *
			 * @param {String} tableName Name for the table that should be retrieved.
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Storage.prototype.retrieveAttributes = function(tableName, callback){
				console.log("retrieveAttributes from "+tableName);

				if(this._db){
					var self = this;
					self._flushStorage();
					this._db.transaction(function(tx) {
						self._queryValues(tx, tableName, self, callback);
					}, function(error) {
						self._errorCB(error);
					});
				}
			};

			/**
			 * Query function for given attribute.
			 *
			 * @callback
			 * @private
			 * @param {*} tx
			 * @param {String} tableName Name for the table that should be retrieved.
			 * @param {Storage} self
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Storage.prototype._queryValues = function(tx, tableName, self, callback){
				if(self._tableExists(tableName)){
					console.log('SELECT * FROM "' +tableName+"'");
					var statement = 'SELECT * FROM "' + tableName+'"';
					tx.executeSql(statement, [],
						function(tx, results) {
							self._queryValuesSuccess(tx, results, tableName, self, callback);
						}, function(error) {
							self._errorCB(error);
						});
				} else {
					console.log('Table "'+tableName+'" unavailable');
				}
			};

			/**
			 * Success function for retrieveAttributes().
			 * Puts the retrieved data in RetrievalResult object.
			 *
			 * @callback
			 * @private
			 * @param {*} tx
			 * @param {*} results
			 * @param {String} tableName Name of the searched attribute.
			 * @param self
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Storage.prototype._queryValuesSuccess = function(tx, results, tableName, self, callback){
				var len = results.rows.length;
				var attributeList = [];
				var attributeName = this._resolveAttributeName(tableName);
				var parameterList = this._resolveParameters(tableName);
				for(var i=0; i<len; i++){
					var attribute = new Attribute(true).
						withName(attributeName).withValue(results.rows.item(i).value_).
						withType(results.rows.item(i).type_).
						withTimestamp(results.rows.item(i).created_).
						withParameters(parameterList);
					attributeList.push(attribute);
				}
				self._attributes = new RetrievalResult().withName(tableName)
					.withTimestamp(new Date())
					.withValues(attributeList);
				if(callback && typeof(callback) == 'function'){
					callback();
				}
			};

			/**
			 * Stores the given Attribute.
			 * If the flush condition does not match,
			 * the data is first added to the local cache before.
			 *
			 * @public
			 * @param {Attribute} attributeValue Value that should be stored.
			 */
			Storage.prototype.store = function(attributeValue) {
				this._addData(attributeValue);
				if(this._checkFlushCondition){
					this._flushStorage();
					this._resetForFlush();
				}
			};

			/**
			 * Adds data to the local cache.
			 * The cache is used to decrease the database access.
			 *
			 * @private
			 * @param {Attribute} _attribute Value that should be stored.
			 */
			Storage.prototype._addData = function(_attribute){
				if(_attribute.constructor === Attribute){
					this._data.put(_attribute);
					this._dataCount++;
				}
			};

			/**
			 * Verifies the flush conditions.
			 *
			 * @private
			 * @returns {boolean}
			 */
			Storage.prototype._checkFlushCondition = function(){
				if(this._dataCount > this._countCondition){
					return true;
				}
				var currentDate = new Date();
				if((currentDate.getTime() - this._lastFlush.getTime()) < this._timeCondition ){
					return true;
				} //2 stunden??
				return false;
			};

			/**
			 * Clears the local cache.
			 *
			 * @private
			 */
			Storage.prototype._resetForFlush = function(){
				this._data = new AttributeList();
				this._dataCount = 0;
				this._lastFlush = new Date();
			};

			/**
			 * Stores all data from the local cache to the database.
			 *
			 * @private
			 */
			Storage.prototype._flushStorage = function(){
				var self = this;
				if(self._data.size() == 0){
					return;
				}
				for(var i in self._data.getItems()){
					var item = self._data.getItems()[i];
					if(!self._tableExists(item)){
						self._createTable(item, function() {
							self._insertIntoTable(item);
						});
					} else {
						self._insertIntoTable(item);
					}
				}
			};

			/**
			 * Sets the time condition for flush.
			 *
			 * @param {Number} time time in ms
			 */
			Storage.prototype.setTimeCondition = function(time){
				this._timeCondition = time;
			};

			/**
			 * Sets the counter for flush.
			 *
			 * @param {Number} _counter counter
			 */
			Storage.prototype.setCountCondition = function(_counter){
				this._countCondition = _counter;
			};

			/**
			 * Returns the current time condition for flush.
			 *
			 * @returns {Number}
			 */
			Storage.prototype.getTimeCondition = function(){
				return this._timeCondition;
			};

			/**
			 *  Returns the current count condition for flush.
			 *
			 * @returns {Number}
			 */
			Storage.prototype.getCountCondition = function(){
				return this._countCondition;
			};

			/****************************
			 * 			Helper			*
			 ****************************/
			/**
			 * Builds the tableName for the given attribute.
			 *
			 * @private
			 * @param {Attribute} attribute Attribute that should be stored.
			 * @returns{String}
			 */
			Storage.prototype._tableName = function(attribute){
				return attribute.toString(true);
			};

			/**
			 * Extracts the attributeName form the table name.
			 *
			 * @private
			 * @param {String} tableName Table name that should be resolved.
			 * @returns{String}
			 */
			Storage.prototype._resolveAttributeName = function(tableName){
				var resolvedTableName = tableName.split('__');
				return resolvedTableName[0];
			};

			/** Extracts the parameters form the table name.
			 *
			 * @private
			 * @param {String} _tableName Table name that should be resolved.
			 * @returns{String}
			 */
			Storage.prototype._resolveParameters = function(_tableName){
				var resolvedTableName = _tableName.split('__');

				var parameterList = new ParameterList();
				for(var i = 1; i < resolvedTableName.length; i++ ){
					var resolvedParameter =  resolvedTableName[i].split('_');
					var parameter= new Parameter().withKey(resolvedParameter[0]).withValue(resolvedParameter[1]);
					parameterList.put(parameter);
				}
				return parameterList;
			};

			return Storage;
		})();
	}
);