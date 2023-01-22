odoo.define('modules_access_rights.list_controller', function (require){
"use strict";
var ListController = require('web.ListController');
var FormController = require('web.FormController');
var session = require('web.session');
var core = require("web.core");
    var _t = core._t;
ListController.include({
_getActionMenuItems: function (state) {
        const { isM2MGrouped } = state;
        if (!this.hasActionMenus || !this.selectedRecords.length) {
            return null;
        }
        const props = this._super(...arguments);
        const otherActionItems = [];
        if (this.isExportEnable && ! session.none_export_models.includes(this.modelName)) {

            otherActionItems.push({
                description: _t("Export"),
                callback: () => this._onExportData()
            });
        }
        if (this.archiveEnabled && !isM2MGrouped && ! session.none_archivable_models.includes(this.modelName)) {
            otherActionItems.push({
                description: _t("Archive"),
                callback: () => {
                    const dialog = Dialog.confirm(this, _t("Are you sure that you want to archive all the selected records?"), {
                        confirm_callback: () => {
                            this._toggleArchiveState(true);
                            dialog.close();
                        },
                    });
                }
            }, {
                description: _t("Unarchive"),
                callback: () => this._toggleArchiveState(false)
            });
        }
        if (this.activeActions.delete && !isM2MGrouped) {
            otherActionItems.push({
                description: _t("Delete"),
                callback: () => this._onDeleteSelectedRecords()
            });
        }
        return Object.assign(props, {
            items: Object.assign({}, this.toolbarActions, { other: otherActionItems }),
            context: state.getContext(),
            domain: state.getDomain(),
            isDomainSelected: this.isDomainSelected,
        });
    },

});
FormController.include({
    _getActionMenuItems: function (state) {
        if (!this.hasActionMenus || this.mode === 'edit') {
            return null;
        }
        const props = this._super(...arguments);
        const activeField = this.model.getActiveField(state);
        const otherActionItems = [];
        if (this.archiveEnabled && activeField in state.data && ! session.none_archivable_models.includes(this.modelName)) {
            if (state.data[activeField]) {
                otherActionItems.push({
                    description: _t("Archive"),
                    callback: () => {
                        Dialog.confirm(this, _t("Are you sure that you want to archive this record?"), {
                            confirm_callback: () => this._toggleArchiveState(true),
                        });
                    },
                });
            } else {
                otherActionItems.push({
                    description: _t("Unarchive"),
                    callback: () => this._toggleArchiveState(false),
                });
            }
        }
        if (this.activeActions.create && this.activeActions.duplicate) {
            otherActionItems.push({
                description: _t("Duplicate"),
                callback: () => this._onDuplicateRecord(this),
            });
        }
        if (this.activeActions.delete) {
            otherActionItems.push({
                description: _t("Delete"),
                callback: () => this._onDeleteRecord(this),
            });
        }
        return Object.assign(props, {
            items: Object.assign(this.toolbarActions, { other: otherActionItems }),
        });
    },
});


});