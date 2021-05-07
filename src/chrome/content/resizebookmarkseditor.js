'use strict';

var resizeBookmarksEditor = {
    prefService: null,

    handleWindowLoad: function (evt) {
        console.info("handleWindowLoad evt", evt);
        window.removeEventListener('load', resizeBookmarksEditor.handleWindowLoad, false);
        window.setTimeout(function () {
            resizeBookmarksEditor.init();
        }, 500);
    },

    init: function () {
        console.info("init");
        this.prefService = Components.classes['@mozilla.org/preferences-service;1']
            .getService(Components.interfaces.nsIPrefService)
            .getBranch('extensions.resizebookmarkseditor.');
        Components.utils.import("resource://gre/modules/XPCOMUtils.jsm", this);

        var eBP = document.getElementById('editBookmarkPanel');
        if (eBP) {
            eBP.addEventListener('load',         this.handlePopupLoad,   false);
            eBP.addEventListener('popupshowing', this.handlePopupShowing, false);
            eBP.addEventListener('popuphidden',  this.handlePopupHidden, false);
        }
    },

    handlePopupLoad: function (evt) {
        console.info("handleExpandFolderButtonClick evt", evt);
        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow');
        folderTreeRow.flex = 20;
        folderTreeRow.height = '';
        folderTreeRow.align = '';

        var tagsSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        tagsSelectorRow.flex = 20;
        tagsSelectorRow.height = '';
        tagsSelectorRow.align = '';

        var resizerHbox = document.getElementById('hboxResizeBookmarksEditor');
        if (resizerHbox) {
            var editBookmarkPanelBottomButtons = resizerHbox.parentNode;
            editBookmarkPanelBottomButtons.removeChild(resizerHbox);
            editBookmarkPanelBottomButtons.insertBefore(resizerHbox, editBookmarkPanelBottomButtons.children.item(0));

            var eBP = document.getElementById('editBookmarkPanel');
            eBP.removeEventListener('load', resizeBookmarksEditor.handlePopupLoad, false);
        }

        var rows = document.getElementById('editBMPanel_rows');
        rows.flex = 1;

        var eBPC = document.getElementById('editBookmarkPanelContent');
        eBPC.style.minWidth = '30.75em'; // Corresponds to 492px for base Size=16pt
        eBPC.flex = '1';
    },

    handlePopupShowing: function (evt) {
        console.info("handlePopupShowing evt", evt);

        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow');
        console.info("handlePopupShowing folderTreeRow", folderTreeRow);
        var toggleCollapsedFolderTree = resizeBookmarksEditor.prefService.getBoolPref('toggleCollapsedFolderTree');
        if (toggleCollapsedFolderTree != folderTreeRow.collapsed) {
            var btnExpandFolder = document.getElementById('editBMPanel_foldersExpander');
            console.info("handlePopupShowing editBMPanel_foldersExpander", btnExpandFolder); //.className == 'expander-down') {
            btnExpandFolder.click();
        }

        var tagsSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        console.info("handlePopupShowing tagsSelectorRow", tagsSelectorRow);
        var toggleCollapsedTagsSelector = resizeBookmarksEditor.prefService.getBoolPref('toggleCollapsedTagsSelector');
        if (toggleCollapsedTagsSelector != tagsSelectorRow.collapsed) {
            var btnExpandTags = document.getElementById('editBMPanel_tagsSelectorExpander');
            console.info("handlePopupShowing editBMPanel_tagsSelectorExpander", btnExpandTags); //.className == 'expander-down') {
            btnExpandTags.click();
        }
    },

    handlePopupHidden: function (evt) {
        console.info("handlePopupHidden evt", evt);
        var eBPC = document.getElementById('editBookmarkPanelContent');

        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow');
        resizeBookmarksEditor.prefService.setBoolPref('toggleCollapsedFolderTree', folderTreeRow.collapsed);

        var tagsSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        resizeBookmarksEditor.prefService.setBoolPref('toggleCollapsedTagsSelector', tagsSelectorRow.collapsed);

        resizeBookmarksEditor.prefService.setIntPref('popupWidth', eBPC.width);

        if (! folderTreeRow.collapsed || ! tagsSelectorRow.collapsed) {
            // Only save height if tree was
            resizeBookmarksEditor.prefService.setIntPref('popupHeight', eBPC.height);
        }
    },
};

window.addEventListener('load', resizeBookmarksEditor.handleWindowLoad, false);
