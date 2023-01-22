odoo.define('pos_table_merge_split', function (require) {
"use strict";

    var models = require('point_of_sale.models');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const FloorScreen = require('pos_restaurant.FloorScreen');
    const { useListener } = require('web.custom_hooks');
    const { useState } = owl.hooks;

    class EditBar2 extends PosComponent {
        constructor() {
            super(...arguments);
            this.state = useState({ isColorPicker: false })
        }
    }
    EditBar2.template = 'EditBar2';

    Registries.Component.add(EditBar2);

    const PosResFloorScreen = FloorScreen =>
        class extends FloorScreen {
            constructor() {
                super(...arguments);
                useListener('merge-table', this._mergeTable);
                useListener('split-table', this._splitTable);

                this.selectedTableIds = []
            }
            _mergeTable(){
                if(this.state.selectedTableId){
                    self.table_list = [];
                    var table_list = [];
                    var tables = this.activeFloor.tables;
                    var updated_table = [];
                    var index;
                    var merge_table = [];
                    var t_name = "";
                    for (var i = 0; i < tables.length; ++i) {
                        if(this.selectedTableIds.indexOf(tables[i].id) < 0){
                            updated_table.push(tables[i])
                        }
                        else if(tables[i].id == this.state.selectedTableId){
                            index = i;
                            t_name += " "+tables[i].name;
                        }
                        else{
                            merge_table.push(tables[i]);
                            t_name += " "+tables[i].name;
                        }
                        if(tables[i].merge_table){
                            for (var j = 0; j < tables[i].merge_table.length; ++j) {
                                merge_table.push(tables[i].merge_table[j]);
                                t_name += " "+tables[i].merge_table[j].name;
                            }
                            tables[i].merge_table = false;
                            tables[i].t_name = false;
                        }
                    }
                    tables[index].merge_table = merge_table;
                    tables[index].t_name = t_name;
                    updated_table.push(tables[index])
                    this.activeFloor.tables = updated_table;
                    this.toggleSplitMerge();
                }
                else{
                    alert("Please select the table first.");
                }
            }
            _splitTable(){
                if(this.state.selectedTableId){
                    var tables = this.activeFloor.tables;
                    for (var i = 0; i < tables.length; ++i) {
                        if(tables[i].id == this.state.selectedTableId){
                            if(tables[i].merge_table){
                                for(var j=0;j<tables[i].merge_table.length;j++){
                                    this.activeFloor.tables.push(tables[i].merge_table[j]);
                                }
                                tables[i].merge_table = false;
                                tables[i].t_name = false;
                            }
                        }
                    }
                    this.toggleSplitMerge();
                }
                else{
                    alert("Please select the table first.");
                }
            }
            toggleSplitMerge() {
                this.state.isEditMode2 = !this.state.isEditMode2;
                this.state.selectedTableId = null;
                this.selectedTableIds = [];
            }
            _onSelectTable(event) {

                const table = event.detail;
                if (this.state.isEditMode) {
                    this.state.selectedTableId = table.id;
                }
                else if (this.state.isEditMode2) {
                    if(this.selectedTableIds){
                        this.selectedTableIds.push(table.id)
                    }else{
                        this.selectedTableIds = [table.id]
                    }
                    this.state.selectedTableId = table.id;
                } else {
                    this.env.pos.set_table(table);
                }
            }
            _onDeselectTable() {
                this.state.selectedTableId = null;
                const table = event.detail;
                if(this.state.selectedTableId){
                    _.without(this.state.selectedTableId, table.id);
                }

            }
            check_table(table_id){
                var selectedTableIds = this.selectedTableIds;
                for(var i=0;i<selectedTableIds.length;i++){
                    if(selectedTableIds[i] == table_id){
                        return false;
                    }
                }
                if(this.state.selectedTableId == table_id){
                    return false;
                }
                return true;
            }
        };

    Registries.Component.extend(FloorScreen, PosResFloorScreen);

    var OrderSuper = models.Order;
    models.Order = models.Order.extend({
        export_as_JSON: function() {
            var json = OrderSuper.prototype.export_as_JSON.apply(this,arguments);
            json.merge_tables = this.table ? this.table.t_name : '';
            return json;
        },
    });

});

