odoo.define('pos_saveguard_tips.models', function (require) {
"use strict";

	var models = require('point_of_sale.models');
    models.load_fields('res.users', ['genera_salvaguarda','ingresa_propinas']);
    models.load_fields('pos.config', ['recordatorio_salvaguarda','monto_salvaguarda','salvaguardas_requerida','fecha_ultimo_recordatorio']);
    models.load_fields('pos.order', ['waiter_id','waiter_old_id']);
});