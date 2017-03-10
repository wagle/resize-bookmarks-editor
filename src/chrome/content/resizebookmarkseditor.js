'use strict';

var resizeBookmarksEditor = {
    prefService: null,

    handleWindowLoad: function (evt) {
        window.removeEventListener('load', resizeBookmarksEditor.handleWindowLoad, false);
        window.setTimeout(function () {
            resizeBookmarksEditor.init();
        }, 500);
    },

    init: function () {
        this.prefService = Components.classes['@mozilla.org/preferences-service;1']
            .getService(Components.interfaces.nsIPrefService)
            .getBranch('extensions.resizebookmarkseditor.');
        Components.utils.import("resource://gre/modules/XPCOMUtils.jsm", this);

        var eBP = document.getElementById('editBookmarkPanel');
        if (eBP) {
            eBP.addEventListener('load',        this.handlePopupLoad,   false);
            eBP.addEventListener('popuphidden', this.handlePopupHidden, false);
        }


    },

    handlePopupLoad: function (evt) {
        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow');
        folderTreeRow.flex = 20;
        folderTreeRow.height = '';
        folderTreeRow.align = '';

        var tagsSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        tagsSelectorRow.flex = 20;
        tagsSelectorRow.height = '';
        tagsSelectorRow.align = '';

        var btnExpandFolder = document.getElementById('editBMPanel_foldersExpander');
        btnExpandFolder.addEventListener('command', resizeBookmarksEditor.handleExpandFolderButtonClick, false);

        var btnExpandTags = document.getElementById('editBMPanel_tagsSelectorExpander');
        btnExpandTags.addEventListener('command', resizeBookmarksEditor.handleExpandTagsButtonClick, false);

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

        var folderTree = document.getElementById('editBMPanel_folderTree');
        folderTree.flex = '1';
        folderTree.style.minHeight = '9.375em'; // Corresponds to 150px for base Size=16pt

        var tagsSelector = document.getElementById('editBMPanel_tagsSelector');
        tagsSelector.flex = '1';
        tagsSelector.style.minHeight = '9.375em'; // Corresponds to 150px for base Size=16pt
    },

    handlePopupHidden: function (evt) {
        var eBPC = document.getElementById('editBookmarkPanelContent'),
            prefService = resizeBookmarksEditor.prefService,
            prefAutoExpandTags = prefService.getBoolPref('autoExpandTags'),
            prefAutoExpandTree = prefService.getBoolPref('autoExpandTree');

        prefService.setIntPref('popupWidth', eBPC.width);

        if (prefAutoExpandTree || prefAutoExpandTags) {
            // Only save height if tree was
            prefService.setIntPref('popupHeight', eBPC.height);
        }
    },

    handleExpandFolderButtonClick: function (evt) {
        var eBP = document.getElementById('editBookmarkPanel');
        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow');
        if (folderTreeRow.collapsed) {
            if (eBP) {
                var folderTree = document.getElementById('editBMPanel_folderTree');
                eBP.height = eBP.height - folderTree.height;
            }
        }
        else {
            if (eBP) {
                eBP.height = '';
                eBP.flex = 1;
            }
        }

    },

    handleExpandTagsButtonClick: function (evt) {
        var eBP = document.getElementById('editBookmarkPanel');
        var tagsSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        if (tagsSelectorRow.collapsed) {
            if (eBP) {
                var tagsSelector = document.getElementById('editBMPanel_tagsSelector');
                eBP.height = eBP.height - tagsSelector.height;
            }
        }
        else {
            if (eBP) {
                eBP.height = '';
                eBP.flex = 1;
            }
        }
    },
};

window.addEventListener('load', resizeBookmarksEditor.handleWindowLoad, false);
