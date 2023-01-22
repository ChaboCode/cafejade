odoo.define('aspl_pos_kitchen_combo.models', function (require) {
"use strict";

     var models = require('point_of_sale.models');
     var _super_Order = models.Order.prototype;
     var utils = require('web.utils');
    var session = require('web.session');
    const { Context } = owl;
    var rpc = require('web.rpc');
    var field_utils = require('web.field_utils');
    var exports = {};
    var round_pr = utils.round_precision;
    var round_di = utils.round_decimals;

    models.load_fields('res.users', ['kitchen_screen_user','pos_category_ids','is_delete_order_line','delete_order_line_reason']);
    models.load_fields('product.product', ['is_combo','product_combo_ids','only_in_combo']);

    models.PosModel.prototype.models.push({
        model:  'remove.product.reason',
        fields: ['name', 'description'],
        loaded: function(self,remove_product_reason){
            self.remove_product_reason = remove_product_reason;
        },
    },{
        model:  'product.combo',
        loaded: function(self,product_combo){
            self.product_combo = product_combo;
            self.combo_line_data = {};
            
            _.each(product_combo,function(line){
                var productos = rpc.query({
                        model:'pos.combo.line.line',

                        method: 'search_read',

                        domain:[['id','in',line.product_ids]],

                        fields: ['product_id']

                    });

                productos.then(function (records) {
                    var  products_line = [] 
                    records.forEach(function(elemento, indice, array) {
                            products_line.push(elemento['product_id'][0])

                        })
                    self.combo_line_data[line.id] = [line.id, products_line, line.require, line.no_of_items, line.display_name, line.product_tmpl_id, line.pos_category_id, line.replaceable, line.base_price,line.sequence]
                    self.db.add_combo_line(self.combo_line_data);

                });

                

                
            });
            
        },
    });

    var posmodel_super = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function(attr, options) {
            posmodel_super.initialize.call(this,attr,options);
            this.kitchenScreenData = [];
        },
        set_kitchen_screen_data: function(data){
            this.kitchenScreenData = data;
            this.trigger('change',this);
        },
        get_kitchen_screen_data: function(){
            return this.kitchenScreenData;
        },
        load_server_data:  function () {
            var self = this;
            return posmodel_super.load_server_data.apply(this, arguments).then(function () {
                var records = self.rpc({
                    model: 'pos.order',
                    method: 'broadcast_order_data',
                    args: [false]
                });
                return records.then(function (records) {
                    self.kitchenScreenData = records;
                });
            });
        },
    });

    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({

        initialize: function(attr, options){
          //console.log("Ingresa contador ============== 1")
            this.quantityLine = {};
            this.useQuantityLine = {};
            options  = options || {};
            this.selected_comboline   = undefined;
            this.select_comboproduct = undefined;
            this.combolines     = new CombolineCollection();
            this.combolines.comparator = function( model ) {
              return model.categoryId, model.p_id;
            }
            this.combolines.on('change',   function(){ this.save_to_db("comboline:change"); }, this);
            this.combolines.on('add',      function(){ this.save_to_db("comboline:add"); }, this);
            this.combolines.on('remove',   function(){ this.save_to_db("comboline:remove"); }, this);
            _super_order.initialize.call(this,attr,options);
            this.cancel_product_reason = [];
            this.delete_product = false;
            this.send_to_kitchen = this.send_to_kitchen || false;
            this.server_id = this.server_id || false;
            this.order_state = this.order_state || 'Done';
            this.send_to_kitchen = this.send_to_kitchen || false;
            this.is_from_sync_screen = this.is_from_sync_screen || false;
        },
        set_is_from_sync_screen: function(flag){
            this.is_from_sync_screen = flag;
            this.trigger('change',this);
        },
        get_is_from_sync_screen: function(){
            return this.is_from_sync_screen;
        },
        set_send_to_kitchen: function(flag){
            this.send_to_kitchen = flag;
            this.trigger('change',this);
        },
        get_send_to_kitchen: function(){
            return this.send_to_kitchen;
        },
        set_server_id: function(server_id){
            this.server_id = server_id;
        },
        get_server_id: function(server_id){
            return this.server_id;
        },
        set_order_status: function(status){
            this.order_state = status;
        },
        get_order_status: function(){
            return this.order_state;
        },
        set_send_to_kitchen: function(flag){
            this.send_to_kitchen = flag;
            this.trigger('change',this);
        },
        get_send_to_kitchen: function(){
            return this.send_to_kitchen;
        },
        set_cancel_product_reason:function(cancel_product_reason){
            this.cancel_product_reason = cancel_product_reason;
            this.trigger('change',this);
        },
        get_cancel_product_reason:function(){
            return this.cancel_product_reason;
        },
        set_delete_product:function(delete_product){
            this.delete_product = delete_product;
            this.trigger('change',this);
        },
        get_delete_product:function(){
            return this.delete_product;
        },
        get_comboline_by_server_id: function(id){
            var combolines = this.combolines.models;
            for(var i = 0; i < combolines.length; i++){
                if(combolines[i].combo_line === id){
                    return combolines[i];
                }
            }
            return null;
        },
        get_orderline_by_server_id: function(id){
            var orderlines = this.orderlines.models;
            for(var i = 0; i < orderlines.length; i++){
                if(orderlines[i].server_id === id){
                    return orderlines[i];
                }
            }
            return null;
        },
        add_product: function(product, options){
           _super_order.add_product.apply(this, [product, options]);
            if (options.combolines !== undefined){
                line.set_combolines(options.combolines);
            }
        },
        remove_all_comboline: function(){
            var self = this;
            var lines = this.get_combolines();
            _.each(lines, function (line) {
                self.remove_comboline(self.get_last_comboline());
            });
        },
        set_select_comboproduct: function(line){
            if(line){
                this.select_comboproduct = line;
            }else{
                this.select_comboproduct = undefined;
            }
        },
        get_select_comboproduct: function(){
            return this.select_comboproduct;
        },
        get_combo_products: function(){
            var combolines = this.combolines.models;
            var list = [];
            let length = combolines.length;
            let i = 0;
            for(i; i < length; i++){
                list.push(combolines[i].product);
            }
            return list;
        },
        add_combo_product: function(product, options){
            options = options || {};
            var attr = JSON.parse(JSON.stringify(product));
            attr.pos = this.pos;
            attr.order = this;
            var line = new exports.Comboline({}, {pos: this.pos, order: this, product: product});

            if(options.categoryId !== undefined){
                line.set_categoryId(options.categoryId);
            }
            if(options.require !== undefined){
                line.set_require(options.require);
            }
            if(options.categoryName !== undefined){
                line.set_categoryName(options.categoryName);
            }
            if(options.replaceable !== undefined){
                line.set_replaceable(options.replaceable);
            }
            if(options.basePrice !== undefined){
                line.set_basePrice(options.basePrice);
            }
            if(options.quantity !== undefined){
                line.set_quantity(options.quantity);
            }
            if(options.max !== undefined){
                line.set_max(options.max);
            }
            if(options.is_replaced !== undefined){
                line.set_is_replaced(options.is_replaced);
            }
            if(options.replaced_product_id !== undefined){
                line.set_replaced_product_id(options.replaced_product_id);
            }
            if (options.replacePrice !== undefined){
                line.set_replacePrice(options.replacePrice);
            }
            if (options.customisePrice !== undefined){
                line.set_customisePrice(options.customisePrice);
            }
            if (options.extraPriceProduct !== undefined){
                line.set_extraPriceProduct(options.extraPriceProduct);
            }
            if (options.quantityNewProduct !== undefined){
                line.set_quantityNewProduct(options.quantityNewProduct);
            }

            


            var to_merge_comboline;
            let length = this.combolines.length;
            let i = 0;
            for (i; i < length; i++) {
                if(this.combolines.at(i).can_be_merged_with(line) && options.merge !== false){
                    to_merge_comboline = this.combolines.at(i);
                }
            }
            if (to_merge_comboline){
                to_merge_comboline.merge(line);
                this.select_comboline(to_merge_comboline);
            } else {
                this.combolines.add(line);
                this.select_comboline(line);
            }
        },
        add_comboline: function(line){
            this.combolines.add(line);
            this.select_comboline(this.get_last_comboline());
        },
        //improve get_comboline because there is duplicate line present
        get_comboline: function(c_id,p_id){
            let i = 0;
            var combolines = this.combolines.models;
            console.log("Esto es combolines")
            console.log(combolines)
            let length = combolines.length;
            for(i ; i < length; i++){
                if(combolines[i].categoryId == c_id && combolines[i].p_id == p_id){
                    console.log("Esto es combolines[i]")
                    console.log(combolines[i])
                    return combolines[i];
                }
            }
            return null;
        },
        get_remaining_comboline: function(line){
            var combolines = this.combolines.models;
            console.log("Esto es combolines abajo")
            console.log(combolines)
            var list = [];
            let length = combolines.length;
            console.log(length)
            let i = 0;
            for(i; i < length; i++){
                if(combolines[i].categoryId == line.categoryId && combolines[i].p_id == line.p_id && combolines[i].cid != line.cid){
                    list.push(combolines[i]);
                }
            }
            return list;
        },
        get_combolines: function(){
            return this.combolines.models;
        },
        get_selected_comboline: function(){
            return this.selected_comboline;
        },
        get_last_comboline: function(){
            return this.combolines.at(this.combolines.length -1);
        },
        remove_comboline: function( line ){
            this.combolines.remove(line);
            this.select_comboline(this.get_last_comboline());
        },
        select_comboline: function(line){
            if(line){
                if(line !== this.selected_comboline){
                    if(this.selected_comboline){
                        this.selected_comboline.set_selected(false);
                    }
                    this.selected_comboline = line;
                    this.selected_comboline.set_selected(true);
                }
            }else{
                this.selected_comboline = undefined;
            }
        },
        deselect_comboline: function(){
            if(this.selected_comboline){
                this.selected_comboline.set_selected(false);
                this.selected_comboline = undefined;
            }
        },
        get_last_comboline: function(){
            return this.combolines.at(this.combolines.length -1);
        },
        get_replace_price_difference(difference){
            var rounding = this.pos.currency.rounding;
            return round_pr(difference, rounding);
        },
        c_get_total_without_tax: function() {
            //console.log("Esto es c_get_total_without_tax")
            //console.log(this)
            return round_pr(this.combolines.reduce((function(sum, comboline) {
                return sum + comboline.get_base_price();
            }), 0), this.pos.currency.rounding);
        },
        set_quantityLine: function(value){
            this.quantityLine = JSON.parse(JSON.stringify(value));
        },
        get_quantityLine: function(){
            return this.quantityLine;
        },
        set_useQuantityLine: function(value){
            this.useQuantityLine = JSON.parse(JSON.stringify(value));
        },
        get_useQuantityLine: function(){
            return this.useQuantityLine;
        },
        set_is_update_increnement_number: function (is_update_increnement_number) {
            this.is_update_increnement_number = is_update_increnement_number;
        },
        get_is_update_increnement_number: function () {
            return this.is_update_increnement_number;
        },
        set_temp_increment_number: function (temp_increment_number) {
            this.temp_increment_number = temp_increment_number;
        },
        get_temp_increment_number: function () {
            return this.temp_increment_number;
        },
        init_from_JSON: function(json) {
            _super_order.init_from_JSON.apply(this,arguments);
            this.cancel_product_reason = json.cancel_product_reason;
            this.send_to_kitchen     = json.send_to_kitchen;
            this.server_id     = json.server_id;
            this.order_state     = json.order_state;
            this.send_to_kitchen = json.send_to_kitchen;
            this.temp_increment_number = json.temp_increment_number;
            const orderlines = json.lines;
            const orderlines_length = orderlines.length;
            this.is_from_sync_screen = json.is_from_sync_screen;
            for (var i = 0; i < orderlines_length; i++) {
                var orderline = orderlines[i][2];
                if(orderline.combo_lines){
                    var combolines = orderline.combo_lines;
                    var combolines_length = combolines.length;
                    for (var j = 0; j < combolines_length; j++) {
                        var comboline = combolines[j];
                        this.add_comboline(new exports.Comboline({}, {pos: this.pos, order: this, json: comboline}))
                    }
                    this.get_orderline_by_server_id(orderline.server_id).set_combolines(this.get_combolines());
                    this.remove_all_comboline();
                    this.get_orderline_by_server_id(orderline.server_id).set_quantityLine(orderline.quantityLine);
                    this.get_orderline_by_server_id(orderline.server_id).set_useQuantityLine(orderline.useQuantityLine);
                }
                else if(orderline.combolines){
                    var combolines = orderline.combolines;
                    var combolines_length = orderline.combolines.length;
                    for (var j = 0; j < combolines_length; j++) {
                        var comboline = combolines[j];
                        this.add_comboline(new exports.Comboline({}, {pos: this.pos, order: this, json: comboline}));
                    }
                    this.get_orderline(orderline.id).set_combolines(this.get_combolines());
                    this.remove_all_comboline();
                    this.get_orderline(orderline.id).set_quantityLine(orderline.quantityLine);
                    this.get_orderline(orderline.id).set_useQuantityLine(orderline.useQuantityLine);
                }
            }
        },
        export_as_JSON: function() {
            var json = _super_order.export_as_JSON.call(this);
            json.cancel_product_reason = this.get_cancel_product_reason();
            json.delete_product = this.get_delete_product();
            json.send_to_kitchen = this.get_send_to_kitchen() ? this.send_to_kitchen : false;
            json.server_id = this.server_id;
            json.order_state = this.order_state;
            json.send_to_kitchen = this.send_to_kitchen;
            return json;
        },
    });

    var _super_orderline = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        initialize: function(attr, options){
            _super_orderline.initialize.call(this,attr,options);
            this.state = this.state || 'Waiting';
            this.server_id = this.server_id || false;
            this.line_cid = this.cid || false;
            this.combolines = this.combolines || [];
            this.quantityLine = {};
            this.useQuantityLine = {};
            this.combolines = this.combolines || [];
        },
        clone: function(){
            var orderline = _super_orderline.clone.call(this);
            orderline.state = this.state;
            orderline.server_id = this.server_id;
            orderline.line_cid = this.line_cid;
            orderline.useQuantityLine = this.useQuantityLine;
            orderline.quantityLine = this.quantityLine;
            orderline.combolines = this.combolines;
            return orderline;
        },
        can_be_merged_with: function(orderline) {
            if (this.state != orderline.state){
                return false
            }else{
                return _super_orderline.can_be_merged_with.apply(this,arguments);
            }
        },
        set_server_id: function(server_id){
            this.server_id = server_id;
        },
        get_server_id: function(server_id){
            return this.server_id;
        },
        set_combolines: function(combolines){
            if(combolines.length != 0){
                for(var i = 0; i < combolines.length; i++){
                    this.combolines.push(combolines[i].clone())
                }
            }else{
                this.combolines = [];
            }
        },
        get_combolines: function(){
            return this.combolines;
        },
        set_quantityLine: function(value){
            this.quantityLine = JSON.parse(JSON.stringify(value));
        },
        get_quantityLine: function(){
            return this.quantityLine;
        },
        set_useQuantityLine: function(value){
            this.useQuantityLine = JSON.parse(JSON.stringify(value));
        },
        get_useQuantityLine: function(){
            return this.useQuantityLine;
        },
        set_line_state:function(state){
            this.state = state;
            this.trigger('change',this);
        },
        get_line_state:function(){
            return this.state;
        },
        init_from_JSON: function(json) {
            _super_orderline.init_from_JSON.apply(this,arguments);
            this.server_id = json.server_id;
            this.line_cid = json.line_cid;
            this.state = json.state;
        },
        export_as_JSON: function() {
            var json = _super_orderline.export_as_JSON.call(this);
            json.state = this.get_line_state();
            json.server_id = this.server_id;
            json.line_cid = this.line_cid;
            var comboLines = [];
            for(let i = 0; i < this.combolines.length; i++){
                comboLines.push(this.combolines[i].export_as_JSON());
            }
            json.quantityLine = this.quantityLine;
            json.useQuantityLine = this.useQuantityLine;
            json.combolines = comboLines;
            return json;
        },
        export_for_printing: function(){
            var orderline = _super_orderline.export_for_printing.call(this);
            var comboLines = [];
            if(this.combolines && this.combolines.length){
                for(let i = 0; i < this.combolines.length; i++){
                    comboLines.push(this.combolines[i].export_for_printing());
                }
            }
            orderline['combolines'] = comboLines;
            return orderline;
        },
    });

    /* ****** Combo Line ****** */
    var comboline_id = 1;
    exports.Comboline = Backbone.Model.extend({
        initialize: function(attr,options){
            //console.log("Ingresa en initialize +++++++++++++++++++++++++++++++++++")
            //console.log(options)
            //console.log(attr)
            //console.log(this)
            this.pos   = options.pos;
            this.order = options.order;
            if (options.json) {
                try {
                    this.init_from_JSON(options.json);
                } catch(error) {
                    console.error('ERROR: attempting to recover product ID', options.json.product_id,
                        'not available in the point of sale. Correct the product or clean the browser cache.');
                }
                return;
            }
            this.combo_line = this.combo_line || false;
            this.product = options.product;
            this.selected = false;
            this.set_quantity(1);
            this.require = this.get_require();
            this.max = 0;
            this.p_id = options.product.id;
            this.categoryName = this.get_categoryName();
            this.categoryId = this.get_categoryId();
            this.replaceable = false;
            this.basePrice = 0;
            this.customisePrice = 0;
            this.extraPriceProduct = this.get_extraPrice();
            this.quantityNewProduct = 0;
            this.replacePrice = 0;
            this.is_replaced = false;
            this.replaced_product_id = null;
            this.id = comboline_id++;
        },
        init_from_JSON: function(json) {
            this.combo_line = json.server_id,
            this.product = this.pos.db.get_product_by_id(json.product_id);
            this.set_quantity(json.qty);
            this.p_id = this.product.id,
            this.id = json.id ? json.id : comboline_id++;
//            this.bom_id = json.bom_id;
            this.categoryName = json.categoryName;
            this.categoryId = json.categoryId;
            this.replaceable = json.replaceable;
            this.basePrice = json.basePrice;
            this.replacePrice = json.replacePrice;
            this.customisePrice = json.customisePrice;
            this.extraPriceProduct = json.extraPriceProduct;
            this.quantityNewProduct = json.quantityNewProduct;
            this.require = json.require;
            this.max = json.max;
            this.is_replaced = json.is_replaced;
            this.replaced_product_id = json.replaced_product_id;
            comboline_id = Math.max(this.id+1,comboline_id);
        },
        export_as_JSON: function() {
            return {
                combo_line: this.combo_line,
                qty: this.get_quantity(),
                product_id: this.get_product().id,
                bom_id: this.bom_id,
                id: this.id,
                categoryName: this.categoryName,
                categoryId: this.categoryId,
                replaceable: this.replaceable,
                basePrice: this.basePrice,
                replacePrice: this.replacePrice,
                customisePrice: this.customisePrice,
                extraPriceProduct: this.extraPriceProduct,
                quantityNewProduct: this.quantityNewProduct,
                require: this.require,
                max: this.max,
                is_replaced: this.is_replaced,
                replaced_product_id: this.replaced_product_id,
                full_product_name: this.get_full_product_name(),
            };
        },
        export_for_printing: function(){
            return {
                id1: this.id,
                quantity:           this.get_quantity(),
                max:                this.max,
                unit_name:          this.get_unit().name,
                price:              this.get_display_price(),
                product_name:       this.get_product().display_name,
                product_name_wrapped: this.generate_wrapped_product_name(),
                price_display :     this.get_display_price(),
                is_replaced:        this.is_replaced,
                replaced_product_name: this.get_replaced_product_name(),
            };
        },
        generate_wrapped_product_name: function() {
            var MAX_LENGTH = 30;// 40 * line ratio of .6
            var wrapped = [];
            var name = this.get_full_product_name();
            var current_line = "";

            while (name.length > 0) {
                var space_index = name.indexOf(" ");

                if (space_index === -1) {
                    space_index = name.length;
                }

                if (current_line.length + space_index > MAX_LENGTH) {
                    if (current_line.length) {
                        wrapped.push(current_line);
                    }
                    current_line = "";
                }

                current_line += name.slice(0, space_index + 1);
                name = name.slice(space_index + 1);
            }

            if (current_line.length) {
                wrapped.push(current_line);
            }

            return wrapped;
        },
        clone: function(){
            var comboline = new exports.Comboline({},{
                pos: this.pos,
                order: this.order,
                product: this.product,
            });
            comboline.combo_line = this.combo_line;
            comboline.quantity = this.quantity;
            comboline.quantityStr = this.quantityStr;
            comboline.p_id = this.p_id;
            comboline.categoryName = this.categoryName;
            comboline.categoryId = this.categoryId;
            comboline.replaceable = this.replaceable;
            comboline.basePrice = this.basePrice;
            comboline.replacePrice = this.replacePrice;
            comboline.customisePrice = this.customisePrice;
            comboline.extraPriceProduct = this.extraPriceProduct;
            comboline.quantityNewProduct = this.quantityNewProduct;
            comboline.require = this.require;
            comboline.max = this.max;
            comboline.is_replaced = this.is_replaced;
            comboline.replaced_product_id = this.replaced_product_id;
            return comboline;
        },

        can_be_merged_with: function(comboline){
            if( this.get_product().id !== comboline.get_product().id){    //only comboline of the same product can be merged
                return false;
            }else if (this.categoryId !== comboline.categoryId) {
                return false;
            }else{
                return true;
            }
        },
        merge: function(comboline){
            this.set_quantity(this.get_quantity() + comboline.get_quantity());
        },

        set_quantity: function(quantity, keep_price){
          //console.log("Ingresa en set_quantity +++++++++++++++++++++++++++++++++++++++++++++++")
            if(quantity === 'remove'){
                this.order.remove_comboline(this);
                return;
            }else{
                var quant = parseFloat(quantity) || 0;
                var unit = this.get_unit();
                if(unit){
                    if (unit.rounding) {
                        var decimals = this.pos.dp['Product Unit of Measure'];
                        var rounding = Math.max(unit.rounding, Math.pow(10, -decimals));
                        this.quantity    = round_pr(quant, rounding);
                        this.quantityStr = field_utils.format.float(this.quantity, {digits: [69, decimals]});
                    } else {
                        this.quantity    = round_pr(quant, 1);
                        this.quantityStr = this.quantity.toFixed(0);
                    }
                }else{
                    this.quantity    = quant;
                    this.quantityStr = '' + this.quantity;
                }
            }
            this.trigger('change', this);
        },
        get_full_product_name: function () {
            var full_name = this.is_replaced ? this.get_replaced_product_name() : this.product.display_name;;
            return full_name;
        },
        set_max: function(value){
            this.max = value;
            var decimals = this.pos.dp['Product Unit of Measure'];
            this.maxStr = field_utils.format.float(this.max, {digits: [69, decimals]});
        },
        get_max: function(){
            return this.max;
        },
        get_max_str: function(){
            return this.maxStr;
        },
        set_require: function(value){
            this.require = value;
        },
        get_require: function(){
            return this.require;
        },
        set_categoryName: function(value){
            this.categoryName = value;
        },
        get_categoryName: function(){
            return this.categoryName;
        },
        set_categoryId: function(value){
            this.categoryId = value;
        },
        get_categoryId: function(){
            return this.categoryId;
        },
        set_replaceable: function(value){
            this.replaceable = value;
        },
        get_replaceable: function(){
            return this.replaceable;
        },
        set_basePrice: function(value){
            this.basePrice = value;
        },
        get_basePrice: function(){
            return this.basePrice;
        },
        set_extraPrice: function(value){
            this.extraPrice = value;
        },
        set_extraPriceProduct: function(value){
            this.extraPriceProduct = value;
        },
        set_quantityNewProduct: function(value){
            this.quantityNewProduct = value;
        },
        get_extraPrice: function(value){
            //return this.get_customisePrice() + this.get_replacePrice();
            //console.log("Debe ingresar despues aqui")
            //console.log(this)
            return this.extraPriceProduct
        },
        set_customisePrice: function(value){
            this.customisePrice = value;
        },
        get_customisePrice: function(){
            return this.customisePrice;
        },
        set_replacePrice: function(value){
            this.replacePrice = value;
        },
        get_replacePrice: function(){
            return this.replacePrice;
        },
        get_quantity: function(){
            return this.quantity;
        },
        get_quantity_str: function(){
            return this.quantityStr;
        },
        get_quantity_new: function(){
            return this.quantityNewProduct * this.get_quantity();
        },
        get_quantity_str_with_unit: function(){
            var unit = this.get_unit();
            if(unit && !unit.is_pos_groupable){
                return this.quantityStr + ' ' + unit.name;
            }else{
                return this.quantityStr;
            }
        },
        set_selected: function(selected){
            this.selected = selected;
            this.trigger('change',this);
        },
        is_selected: function(){
            return this.selected;
        },
        set_is_replaced: function(value){
            this.is_replaced = value;
        },
        set_replaced_product_id(value){
            this.replaced_product_id = value;
        },
        get_replaced_product_id(){
            return this.replaced_product_id;
        },
        get_replaced_product_name(){
            if(this.is_replaced){
                return this.pos.db.get_product_by_id(this.replaced_product_id).display_name;
            }
        },
        get_unit: function(){
            var unit_id = this.product.uom_id;
            if(!unit_id){
                return undefined;
            }
            unit_id = unit_id[0];
            if(!this.pos){
                return undefined;
            }
            return this.pos.units_by_id[unit_id];
        },
        get_product: function(){
            return this.product;
        },
        get_base_price:    function(){
            var rounding = this.pos.currency.rounding;
            return round_pr(this.get_extraPrice() * this.get_quantity(), rounding);
        },
        get_display_price: function(){
            return this.get_base_price();
        },
    });
    var CombolineCollection = Backbone.Collection.extend({
        model: exports.Comboline,
        comparator: 'categoryId',
    });
});