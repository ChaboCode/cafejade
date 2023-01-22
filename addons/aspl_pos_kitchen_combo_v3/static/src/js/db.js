odoo.define('aspl_pos_kitchen_combo.db', function (require) {
"use strict";

    var core = require('web.core');
    var utils = require('web.utils');
    var DB = require('point_of_sale.DB');

    DB.include({
        init: function(options){
            this._super.apply(this, arguments);
            this.combo_line_by_id = {};
            
        },
        add_combo_line: function(combo_line_data){
            this.combo_line_by_id = combo_line_data;
        },
        get_combo_line_by_id: function(id){
            return this.combo_line_by_id[id];
        },
        get_quantity_line_structure: function(){

        },
        get_combo_product_by_category: function(category_id){
            var product_ids  = this.combo_line_by_id[category_id][1];
            var list = [];
            if (product_ids) {
                for (var i = 0, len = Math.min(product_ids.length, this.limit); i < len; i++) {
                    list.push(this.product_by_id[product_ids[i]]);
                }
            }
            return list;
        }
    });
});