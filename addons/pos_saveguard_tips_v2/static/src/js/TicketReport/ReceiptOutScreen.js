odoo.define('pos_saveguard_tips.CashOutReceiptScreen', function(require) {
	'use strict';

	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const Registries = require('point_of_sale.Registries');
  const AbstractReceiptScreen = require('point_of_sale.AbstractReceiptScreen');

	const CashOutReceiptScreen = (ReceiptScreen) => {
		class CashOutReceiptScreen extends ReceiptScreen {
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
		CashOutReceiptScreen.template = 'CashOutReceiptScreen';
		return CashOutReceiptScreen;
	};

	Registries.Component.addByExtending(CashOutReceiptScreen, AbstractReceiptScreen);
	return CashOutReceiptScreen;

});