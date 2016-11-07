sap.ui.core.mvc.Controller.extend("Barzo.controller.Result", {
	onInit : function() {	
		var height = jQuery(window).height();
		height = height + "px";
		var panel = this.getView().byId("idPanel");
		panel.setHeight(height);
		setTimeout(function () { window.close();}, 3000);
	}
});