odoo.define("rr_dinetakeaway_charges.dine_takeaway", function (require) {
  "use strict";

    const models = require("point_of_sale.models");
    models.load_fields("pos.order", ["dine_in", "takeaway"]);
    
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
    initialize: function(attr,options) {
        _super_order.initialize.apply(this,arguments);
        this.dine_in = false;
        this.takeaway = false;
        this.save_to_db();
    },
    export_as_JSON: function() {
        var json = _super_order.export_as_JSON.call(this);
          json['dine_in'] = this.dine_in;
          json['takeaway'] = this.takeaway;
          return json;
    },
    init_from_JSON: function(json) {
        this.dine_in = json.dine_in;
        this.takeaway = json.takeaway;
        return _super_order.init_from_JSON.apply(this, arguments);
    },
    export_for_printing: function() {
        var json = _super_order.export_for_printing.apply(this,arguments);
        json.dine_in = this.dine_in;
        json.takeaway = this.takeaway;
        return json;
    },
    set_dine_in_status: function(dine_in) {
          this.dine_in = dine_in;
          this.trigger('change', this);
        },
    get_dine_in_status: function() {
          return this.dine_in;
        },
    set_takeaway_status: function(takeaway) {
          this.takeaway = takeaway;
          this.trigger('change', this);
        },
    get_takeaway_status: function() {
          return this.takeaway;
        },
});

});