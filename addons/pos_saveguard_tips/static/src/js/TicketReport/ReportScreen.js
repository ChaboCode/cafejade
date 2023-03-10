odoo.define('pos_saveguard_tips.StatementReportScreen', function(require) {
	'use strict';

	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const Registries = require('point_of_sale.Registries');
  const AbstractReceiptScreen = require('point_of_sale.AbstractReceiptScreen');

	const StatementReportScreen = (ReceiptScreen) => {
		class StatementReportScreen extends ReceiptScreen {
			constructor() {
				super(...arguments);
			}

			back() {
				this.trigger('close-temp-screen');
			}

			async handleAutoPrint() {
				if (this._shouldAutoPrint()) {
					const isPrinted = await this._printReceipt();
					if (isPrinted) {
						const { name, props } = this.nextScreen;
						this.showScreen(name, props);
					}
				}
			}

			orderDone() {
				const { name, props } = this.nextScreen;
				this.showScreen(name, props);
			}

		}
		StatementReportScreen.template = 'StatementReportScreen';
		return StatementReportScreen;
	};

	Registries.Component.addByExtending(StatementReportScreen, AbstractReceiptScreen);
	return StatementReportScreen;

});