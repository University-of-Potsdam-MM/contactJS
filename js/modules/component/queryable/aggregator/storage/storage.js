define(['contextInformation', 'contextInformationList', 'retrievalResult', 'parameter', 'parameterList'],
 	function(ContextInformation, ContextInformationList, RetrievalResult, Parameter, ParameterList){
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
				 * Names of all stored contextual information (tableNames as string).
				 *
				 * @type {Array}
				 * @private
				 */
				this._contextInformationNames = [];

				/**
				 * Data of a retrieval.
				 *
				 * @type {RetrievalResult}
				 * @private
				 */
				this._contextInformation = new RetrievalResult();

				/**
				 * Cache before storing the new data in the database.
				 *
				 * @type {ContextInformationList}
				 * @private
				 */
				this._data = new ContextInformationList();

				/**
				 * Names of all stored contextual information.
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
				 * If at least 'countCondition' contextual information are collected data will be flushed.
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
				this._storage = '';

				this._initStorage(name);
				if(time && time === parseInt(time) && time != 0) this._timeCondition = time;
				if(counter && counter === parseInt(counter) && counter != 0) this._countCondition = counter;

				return this;
			}

			/**
			 * Returns the last retrieved contextual information.
			 *
			 * @returns {RetrievalResult}
			 */
			Storage.prototype.getCurrentData = function() {
				return this._contextInformation;
			};

			/**
			 * Returns the names of all stored contextual information (tableNames as string).
			 *
			 * @returns {Array}
			 */
			Storage.prototype.getContextInformationOverview = function() {
				return this._contextInformationNames;
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
					this._storage = window.openDatabase(name, "1.0", "DB_" + name, 1024*1024);
					this._parent.log('I will initialize storage with name '+name+".");
				}
			};

			/**
			 * Creates a new table. A table contains the values of one contextual information.
			 * So the name is the contextual information name.
			 *
			 * @private
			 * @param {ContextInformation} contextInformation tableName (should be the contextual information name)
			 * @param {?function} callback For alternative actions, if an asynchronous function is used.
			 */
			Storage.prototype._createTable = function(contextInformation, callback){
				if(this._storage){
					var tableName = this._tableName(contextInformation);
					var statement = 'CREATE TABLE IF NOT EXISTS "' + tableName + '" (value_, type_, created_)';
					this._parent.log('CREATE TABLE IF NOT EXISTS "' + tableName + '"');
					if(callback && typeof(callback) == 'function'){
						this._storage.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, callback);
					} else {
						this._storage.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, this._successCB);
					}
					if(!this._contextInformationNames.indexOf(contextInformation.getName()) > -1){
						this._contextInformationNames.push(tableName);
					}
				}
			};

			/**
			 * Inserts value into a table. The name of the given contextual information.
			 * identifies the table.
			 *
			 * @private
			 * @param {ContextInformation} contextInformation The contextual information that should be stored.
			 * @param {?function} callback For alternative actions, if an asynchronous function is used.
			 */
			Storage.prototype._insertIntoTable = function(contextInformation, callback){
				if(this._storage && contextInformation && contextInformation instanceof ContextInformation){
					var tableName = this._tableName(contextInformation);
					var statement = 'INSERT INTO "' + tableName
						+ '" (value_, type_, created_) VALUES ("'
						+ contextInformation.getValue() + '", "'
						+ contextInformation.getDataType() + '", "'
						+ contextInformation.getTimestamp() + '")';
					this._parent.log('INSERT INTO "'+tableName+'" VALUES ('+contextInformation.getValue()+", "+contextInformation.getDataType()+", "+contextInformation.getTimestamp());
					if(callback && typeof(callback) == 'function'){
						this._storage.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, callback);
					} else {
						this._storage.transaction(function(tx){tx.executeSql(statement);}, this._errorCB, this._successCB);
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
			 * Returns the contextual information names array.
			 *
			 * @param {?function} [callback] For alternative actions, if an asynchronous function is used.
			 */
			Storage.prototype.getContextInformationNames = function(callback){
				if(this._storage){
					var self = this;
					this._storage.transaction(function(tx) {
							self._queryTables(tx, self, callback);
						}, function(error) {
							self._errorCB(error);
						}
					);
				}
			};

			/**
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
				self._contextInformationNames = [];
				var len = results.rows.length;
				for(var i=0; i<len; i++){
					var table = results.rows.item(i).name;
					if(table.indexOf("DatabaseInfoTable") == -1){
						self._contextInformationNames.push(results.rows.item(i).name);
					}

				}
				if(callback && typeof(callback) == 'function'){
					callback();
				}
			};

			/**
			 * Verifies if a table for an contextual information exists.
			 *
			 * @private
			 * @param {(ContextInformation|String)} contextInformationOrName The contextual information or its name for the verification.
			 * @returns {boolean}
			 */
			Storage.prototype._tableExists = function(contextInformationOrName){
				if(contextInformationOrName instanceof ContextInformation){
					var name = this._tableName(contextInformationOrName);
					return this._contextInformationNames.indexOf(name) > -1;
				} else if(typeof contextInformationOrName === 'string'){
					return this._contextInformationNames.indexOf(contextInformationOrName) > -1;
				}
				return false;
			};

			/**
			 * Retrieves a table and sets the RetrievalResult.
			 *
			 * @param {String} tableName Name for the table that should be retrieved.
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Storage.prototype.retrieveContextInformation = function(tableName, callback){
				console.log("retrieve contextual information from "+tableName);

				if(this._storage){
					var self = this;
					self._flushStorage();
					this._storage.transaction(function(tx) {
						self._queryValues(tx, tableName, self, callback);
					}, function(error) {
						self._errorCB(error);
					});
				}
			};

			/**
			 * Query function for given contextual information.
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
					this._parent.log('SELECT * FROM "' +tableName+"'");
					var statement = 'SELECT * FROM "' + tableName+'"';
					tx.executeSql(statement, [],
						function(tx, results) {
							self._queryValuesSuccess(tx, results, tableName, self, callback);
						}, function(error) {
							self._errorCB(error);
						});
				} else {
					this._parent.log('Table "'+tableName+'" unavailable');
				}
			};

			/**
			 * Success function for retrieveContextInformation().
			 * Puts the retrieved data in RetrievalResult object.
			 *
			 * @callback
			 * @private
			 * @param {*} tx
			 * @param {*} results
			 * @param {String} tableName Name of the searched contextual information.
			 * @param self
			 * @param {?function} callback For additional actions, if an asynchronous function is used.
			 */
			Storage.prototype._queryValuesSuccess = function(tx, results, tableName, self, callback){
				var len = results.rows.length;
				var contextInformationList = [];
				var contextInformationName = this._resolveContextInformationName(tableName);
				var parameterList = this._resolveParameters(tableName);
				for(var i=0; i<len; i++){
					var contextInformation = new ContextInformation(true).
						withName(contextInformationName).withValue(results.rows.item(i).value_).
						withDataType(results.rows.item(i).type_).
						withTimestamp(results.rows.item(i).created_).
						withParameters(parameterList);
					contextInformationList.push(contextInformation);
				}
				self._contextInformation = new RetrievalResult().withName(tableName)
					.withTimestamp(new Date())
					.withValues(contextInformationList);
				if(callback && typeof(callback) == 'function'){
					callback();
				}
			};

			/**
			 * Stores the given contextual information.
			 * If the flush condition does not match,
			 * the data is first added to the local cache before.
			 *
			 * @public
			 * @param {ContextInformation} contextInformation Value that should be stored.
			 */
			Storage.prototype.store = function(contextInformation) {
				this._addData(contextInformation);
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
			 * @param {ContextInformation} contextInformation Value that should be stored.
			 */
			Storage.prototype._addData = function(contextInformation){
				if(contextInformation instanceof ContextInformation){
					this._data.put(contextInformation);
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
				this._data = new ContextInformationList();
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
			 * Builds the tableName for the given contextual information.
			 *
			 * @private
			 * @param {ContextInformation} contextInformation The contextual information that should be stored.
			 * @returns{String}
			 */
			Storage.prototype._tableName = function(contextInformation){
				return contextInformation.toString(true);
			};

			/**
			 * Extracts the contextual information name from the table name.
			 *
			 * @private
			 * @param {String} tableName Table name that should be resolved.
			 * @returns{String}
			 */
			Storage.prototype._resolveContextInformationName = function(tableName){
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