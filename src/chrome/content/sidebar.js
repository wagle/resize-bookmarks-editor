'use strict';
var resizeBookmarksEditorSidebar = {
	onload: function(evt) {

		var placesContext = document.getElementById('placesContext');
		if (placesContext) {
			placesContext.addEventListener('popupshowing', resizeBookmarksEditorSidebar.handleContextMenuShowing, false);
		}

	},

	handleContextMenuShowing: function(evt) {

		var context = {
			menuSeparator: {
				id: 'ebmp-sidebar-placesContext-separator',
			},
			menuTitle: {
				id:'ebmp-sidebar-placesContext-updatetitle-menuitem',
				command: 'window.top.window.resizeBookmarksEditor.updateFromSidebar(event, \'title\');',
				prefkey: 'updateTitleOnSidebar',
			},
			menuUrl: {
				id: 'ebmp-sidebar-placesContext-updateurl-menuitem',
				command: 'window.top.window.resizeBookmarksEditor.updateFromSidebar(event, \'url\');',
				prefkey: 'updateUrlOnSidebar',				
			}
		};
		
		return window.top.window.resizeBookmarksEditor.handleContextMenuShowingCore(evt, context);
	},

	onunload: function(evt) {
		var placesContext = document.getElementById('placesContext');
		if (placesContext)
			placesContext.removeEventListener('popupshowing', resizeBookmarksEditorSidebar.handleContextMenuShowing, false);
		window.removeEventListener('load',   resizeBookmarksEditorSidebar.onload, false);
		window.removeEventListener('unload', resizeBookmarksEditorSidebar.onunload, false);
	},

	delayLoadEvent: function() {
		window.removeEventListener('DOMContentLoaded', resizeBookmarksEditorSidebar.delayLoadEvent, false);
		window.addEventListener('load',   resizeBookmarksEditorSidebar.onload, false);
		window.addEventListener('unload', resizeBookmarksEditorSidebar.onunload, false);
	}
}

window.addEventListener('DOMContentLoaded', resizeBookmarksEditorSidebar.delayLoadEvent, false);