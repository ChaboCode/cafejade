odoo.define('listadeespera.models',function(require){
	'use strict';
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

    models.PosModel.prototype.models.push({
    	model: 'list.wait',
    	fields: ['cliente_id','telefono','no_clientes','tiempo_espera','piso_id','mesa_sugerida_id','mesa_asignada_ids','status'],
    	loaded: function(self,list_wait){
          self.list_wait=list_wait;     
    	},

    });

    // load_new_cliente: function() {
    //   var self = this;

    // }

});