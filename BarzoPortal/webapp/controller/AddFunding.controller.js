sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	var accessToken = "28dacdee4ff54524a7b7dfce37b63473";
	var baseUrl = "https://api.api.ai/v1/";
	var recognition;
	var oData = [];

	return Controller.extend("Barzo.controller.AddFunding", {
		onInit: function() {

			var bModel = new JSONModel(oData);
			this.getView().setModel(bModel);

			var model = new JSONModel();
			var oData = {
				"ProjeName": "",
				"ProjeCategoly": "",
				"ProjectTopic": "",
				"Budget": "",
				"StartDate": "",
				"EndDate": ""
			};
			model.setData(oData);
			this.getView().setModel(model, "main");
		},
		onSave: function() {
			var oModel = this.getView().getModel("main");
			var oData = oModel.getData();
			//			var projeModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZBPM_PROJE_SRV");
			/*			projeModel.create('/ProjeSet', oData, null, function() {
							var msg = "Created Successfully"
							var messageModel = that.getView().getModel("messages");
							messageModel.setProperty("/message", msg);
							that.router.navTo("result");
						}, function() {
							alert("Create successful");
						});*/
			var msg = "Created Successfully";
			var messageModel = this.getView().getModel("messages");
			messageModel.setProperty("/message", msg);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("result");
		},
		onClear: function() {
			var oModel = this.getView().getModel("main");
			var oData = oModel.getData();
			oData = {};
			oModel.setData(oData);
		},
		handleResearchValueHelp: function(evt) {
			
			var projeModel = new sap.ui.model.odata.ODataModel(
				"https://innojama54129c7e.hana.ondemand.com/public/innojam/team07/app/researcher.xsodata/", "team07", "Welcometeam07");
			this.getView().setModel(projeModel, "search");
			if (!this._searchDialog) {
				this._searchDialog = sap.ui.xmlfragment("Barzo.view.SearcherList", this);
				this.getView().addDependent(this._searchDialog);
			}
			this._searchDialog.open();
			
/*			if (!this._researchDialog) {
				this._researchDialog = sap.ui.xmlfragment("Barzo.view.View1", this);
				this.getView().addDependent(this._researchDialog);
			}
			this._researchDialog.open();*/
		},
		handleSelectCancel: function() {
			this._researchDialog.close();
		},
		addPostRequest: function(text) {

			var array = {
				"dateTime": "1407359908949",
				"userName": "Heinz",
				"title": text,
				"icon": "sap-icon://outgoing-call"
			};

			oData.push(array);

			this.getView().getModel().setData(oData);
		},

		addPostResponse: function(text) {

			var response = JSON.parse(text).result.fulfillment.messages[0].speech;

			var array = {
				"dateTime": "1407359908949",
				"userName": "AI Hana",
				"title": response,
				"icon": "sap-icon://incoming-call"
			};

			oData.push(array);

			this.getView().getModel().setData(oData);

			var u = new SpeechSynthesisUtterance();
			u.text = response;
			u.lang = 'en-US';
			u.rate = 1.0;
			// u.onend = function(event) { alert('Finished in ' + event.elapsedTime + ' seconds.'); }
			speechSynthesis.speak(u);
		},

		switchRecognition: function() {

			if (recognition) {
				this.stopRecognition();
			} else {
				this.startRecognition();
			}
		},

		startRecognition: function() {
			var that = this;
			recognition = new webkitSpeechRecognition();
			recognition.onresult = function(event) {
				var text = "";
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					text += event.results[i][0].transcript;
				}
				that.setInput(text);
				that.stopRecognition();
			};
			recognition.onend = function() {
				that.stopRecognition();
			};
			recognition.lang = "en-US";
			recognition.start();
		},

		stopRecognition: function() {

			if (recognition) {
				recognition.stop();
				recognition = null;
			}
		},

		setInput: function(text) {
			var stext = text;
			console.log(stext);
			this.addPostRequest(text);
			this.send(stext);
		},

		send: function(stext) {
			var that = this;
			var text = stext;
			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({
					q: text,
					lang: "en"
				}),
				success: function(data) {
					that.setResponse(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					that.setResponse("Internal Server Error");
				}
			});

		},

		setResponse: function(val) {
			this.addPostResponse(val);
			console.log(val);
		},
		handleSelectListCancel: function() {
			this._searchDialog.close();
		}

	});
});