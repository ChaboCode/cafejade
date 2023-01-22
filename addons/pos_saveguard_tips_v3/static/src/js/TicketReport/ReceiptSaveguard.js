odoo.define('pos_saveguard_tips.CashOutReceipt', function(require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');

	class CashOutReceipt extends PosComponent {
		constructor() {
			super(...arguments);
		}
	}
	
	CashOutReceipt.template = 'CashOutReceipt';
	Registries.Component.add(CashOutReceipt);
	return CashOutReceipt;
});