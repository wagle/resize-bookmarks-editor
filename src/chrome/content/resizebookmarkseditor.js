'use strict';
var resizeBookmarksEditor = {
    prefService: null,
    isShownFirstTime: true,

    handleWindowLoad: function (evt) {
        window.removeEventListener('load', resizeBookmarksEditor.handleWindowLoad, false);
        window.setTimeout(function () {
            resizeBookmarksEditor.init();
        }, 500);
    },

    init: function () {
        // initialize prefService reference
        this.prefService = Components.classes['@mozilla.org/preferences-service;1']
            .getService(Components.interfaces.nsIPrefService)
            .getBranch('extensions.resizebookmarkseditor.');

        var eBP = document.getElementById('editBookmarkPanel');
        if (eBP) {
            eBP.addEventListener('load',        this.handlePopupLoad,   false);
            eBP.addEventListener('popuphidden', this.handlePopupHidden, false);
        }
        else {
            this.handlePopupLoad(null);
            this._processShown(null);
        }
    },

    handlePopupLoad: function (evt) {
        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow');
        folderTreeRow.flex = 10;
        folderTreeRow.height = '';
        folderTreeRow.align = '';

        var tagsSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        tagsSelectorRow.flex = 20;
        tagsSelectorRow.height = '';
        tagsSelectorRow.align = '';

        var btnExpandFolder = document.getElementById('editBMPanel_foldersExpander');
        btnExpandFolder.addEventListener('command', resizeBookmarksEditor.handleExpandFolderButtonClick, false);

        var btnExpandTags = document.getElementById('editBMPanel_tagsExpander');
        btnExpandTags.addEventListener('command', resizeBookmarksEditor.handleExpandTagsButtonClick, false);

        // the xul hbox with the resizer element
        var resizerHbox = document.getElementById('hboxResizeBookmarksEditor');
        alert('Hello, world 1!');
        if (resizerHbox) {
            alert('Hello, world 2!');
            // Skip for bm-props2.xul
            var editBookmarkPanelBottomButtons = resizerHbox.parentNode;
            editBookmarkPanelBottomButtons.removeChild(resizerHbox);
            // Sea Monkey: insert the 'Resizer Panel' as the first item in BottomButtonsPanel
            // editBookmarkPanelBottomButtons.insertBefore(resizerHbox, editBookmarkPanelBottomButtons.children.item(0));
            editBookmarkPanelBottomButtons.insertBefore(resizerHbox, null);

            var eBP = document.getElementById('editBookmarkPanel');
            eBP.removeEventListener('load', resizeBookmarksEditor.handlePopupLoad, false);
        }

    },

    handlePopupHidden: function (evt) {
        var target = document.getElementById('editBookmarkPanelContent'),
            prefService = resizeBookmarksEditor.prefService,
            prefAutoExpandTree = prefService.getBoolPref('autoExpandTree');

        prefService.setIntPref('popupWidth', target.width);

        if (prefAutoExpandTree) {
            // Only save height if tree was
            prefService.setIntPref('popupHeight', target.height);
        }
    },

    _processShown: function (evt) {

        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow'),
            btnExpandFolder, txtBookmarkName,
            prefService = resizeBookmarksEditor.prefService,
            prefAutoExpandTree = prefService.getBoolPref('autoExpandTree');

        folderTreeRow.flex = 10;
        folderTreeRow.align = '';

        if (prefService.getBoolPref('autoExpandTree')) {
            btnExpandFolder = document.getElementById('editBMPanel_foldersExpander');
            if (btnExpandFolder.className == 'expander-down') {
                btnExpandFolder.click();
                // Since click event handler is added AFTER popupshown event,
                // hence scroll tree to show the selected row

                if (this.isShownFirstTime) {
                    this.handleExpandFolderButtonClick(null);
                    this.isShownFirstTime = false;
                }
            }
        }
        if (prefService.getBoolPref('autoExpandTags')) {
            var btnExpandFolder = document.getElementById('editBMPanel_tagsSelectorExpander');
            if (btnExpandFolder.className == 'expander-down') {
                btnExpandFolder.click();
                // Since click event handler is added AFTER popupshown event,
                // hence scroll tree to show the selected row

                if (this.isShownFirstTime) {
                    this.handleExpandFolderButtonClick(null);
                    this.isShownFirstTime = false;
                }

                // clicking the button moves focus from name textbox, move the focus back
                txtBookmarkName = document.getElementById('editBMPanel_namePicker');
                txtBookmarkName.focus();
                txtBookmarkName.select();

            }
        }

        var eBPContent = document.getElementById('editBookmarkPanelContent');

        if (evt) {
            // prefrences key for popup

            // if width,height persisted, popup shows up in that size even after uninstalling addon
            // without the tree being expanded
            // p.persist='width height';
            var popupWidth = resizeBookmarksEditor.prefService.getIntPref('popupWidth');
            if (popupWidth > 0) {
                p.width = popupWidth;
            }

            if (autoExpandTree) {
                // Only restore height if the tree is auto expanded
                var popupHeight = resizeBookmarksEditor.prefService.getIntPref('popupHeight');
                if (popupHeight > 0) {
                    p.height = popupHeight;
                }
            }

        }

        p.style.minWidth = '30.75em'; // Corresponds to 492px for base Size=16pt
        p.flex = '1';
    },

    handleExpandFolderButtonClick: function (evt) {
        var eBP = document.getElementById('editBookmarkPanel');

        var folderSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        folderSelectorRow.flex = 20;
        folderSelectorRow.height = '';

        var folderTreeRow = document.getElementById('editBMPanel_folderTreeRow');

        if (folderTreeRow.collapsed) {
            var tree = document.getElementById('editBMPanel_folderTree');
            if (eBP) {
                // Skip for bm-props2.xul
                // collapse panel when collapse button is clicked
                eBP.height = eBP.height - tree.height;
            }
        }
        else {
            var tree = document.getElementById('editBMPanel_folderTree');
            if (tree.flex != '1') {
                tree.flex = '1';
                tree.style.minHeight = '9.375em'; // Corresponds to 150px for base Size=16pt
            }

            if (eBP) {
                // Skip for bm-props2.xul
                eBP.height = '';
                eBP.flex = 1;
            }
        }

    },

    handleExpandTagsButtonClick: function (evt) {
        var eBP = document.getElementById('editBookmarkPanel');

        var tagsSelectorRow = document.getElementById('editBMPanel_tagsSelectorRow');
        tagsSelectorRow.flex = 20;
        tagsSelectorRow.height = '';

        if (tagsSelectorRow.collapsed) {
            var tags = document.getElementById('editBMPanel_tagsSelector');
            if (eBP) {
                // Skip for bm-props2.xul
                // collapse panel when collapse button is clicked
                eBP.height = eBP.height - tags.height;
            }
        }
        else {
            var tags = document.getElementById('editBMPanel_tagsSelector');
            if (tags.flex != '1') {
                tags.flex = '1';
                tags.style.minHeight = '9.375em'; // Corresponds to 150px for base Size=16pt
            }

            if (eBP) {
                // Skip for bm-props2.xul
                eBP.height = '';
                eBP.flex = 1;
            }
        }
    },
};

window.addEventListener
(
    'load',
    resizeBookmarksEditor.handleWindowLoad,
    false
);
