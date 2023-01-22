odoo.define('pos_saveguard_tips.CashInReceipt', function(require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');

	class CashInReceipt extends PosComponent {
		constructor() {
			super(...arguments);
		}
	}
	
	CashInReceipt.template = 'CashInReceipt';
	Registries.Component.add(CashInReceipt);
	return CashInReceipt;
});