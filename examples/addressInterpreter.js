/**
 * Created by tobias on 25.03.15.
 */
define(['contactJS'], function(contactJS) {
	return (function() {
		AddressInterpreter.description = {
			in: [
				{
					'name':'latitude',
					'type':'double'
				},
				{
					'name':'longitude',
					'type':'double'
				}
			],
			out: [
				{
					'name':'formattedAddress',
					'type':'string'
				}
			]
		};

		/**
		 *
		 * @extends Interpreter
		 * @class AddressInterpreter
		 * @param {Discoverer} discoverer
		 */
		function AddressInterpreter(discoverer) {
			contactJS.Interpreter.call(this, discoverer);
			this._name = "AddressInterpreter";
			return this;
		}

		AddressInterpreter.prototype = Object.create(contactJS.Interpreter.prototype);
		AddressInterpreter.prototype.constructor = AddressInterpreter;

		AddressInterpreter.prototype._interpretData = function(inContextInformation, outContextInformation, callback) {
			var addressValue = outContextInformation.getItems()[0];

			var latitude = inContextInformation.getValueForContextInformationOfKind(this._inContextInformation.getItems()[0]);
			var longitude = inContextInformation.getValueForContextInformationOfKind(this._inContextInformation.getItems()[1]);

			if(navigator.onLine){
				if (latitude && longitude) {
					var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&sensor=false";
					$.getJSON(url, function(json) {
						if (json["status"] != ("OK")) {
							//TODO: handle error case
							addressValue.setValue("NO_VALUE");
						} else {
							addressValue.setValue(json["results"][0]["formatted_address"]);
						}
						callback([addressValue]);
					});
				}
			} else {
				//TODO: handle error case
				addressValue.setValue("NO_VALUE");
				callback([addressValue]);
			}
		};

		return AddressInterpreter;
	})();
});