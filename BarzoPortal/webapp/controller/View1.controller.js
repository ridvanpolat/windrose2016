sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	
		var accessToken = "28dacdee4ff54524a7b7dfce37b63473";
		var baseUrl = "https://api.api.ai/v1/";
		var recognition;
		var oData = [];
		
	return Controller.extend("Barzo.controller.View1", {
		// formatter: formatter,

		onInit : function(){
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
		},
		
		addPostRequest : function(text){
			
			var array = 
				{
				"dateTime" : "1407359908949",
				"userName" : "Heinz",
				"title" : text,
				"icon" : "sap-icon://outgoing-call"
			};
			
			oData.push(array);
			
			this.getView().getModel().setData(oData);
		},
		
		addPostResponse : function(text){
			
			var response = JSON.parse(text).result.fulfillment.messages[0].speech;
			
			var array = 
				{
				"dateTime" : "1407359908949",
				"userName" : "AI Hana",
				"title" : response,
				"icon" : "sap-icon://incoming-call"
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
		
		
		switchRecognition : function () {
			
			if (recognition) {
				this.stopRecognition();
			} else {
				this.startRecognition();
			}
		},
		
		startRecognition : function () {
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
	
		stopRecognition : function () {
			
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
		},
		
		setInput : function (text) {
			var stext = text;
			console.log(stext);
			this.addPostRequest(text);
			this.send(stext);
		},
		
		
		send : function (stext) {
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
				data: JSON.stringify({ q: text, lang: "en" }),
				success: function(data) {
					that.setResponse(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					that.setResponse("Internal Server Error");
				}
			});
			
		},
		
		setResponse : function (val) {
			this.addPostResponse(val);
			console.log(val);
		}
		
		
	});

});