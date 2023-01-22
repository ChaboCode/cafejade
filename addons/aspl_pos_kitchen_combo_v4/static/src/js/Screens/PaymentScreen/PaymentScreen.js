odoo.define('aspl_pos_kitchen_combo.PaymentScreen', function(require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen')
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useState } = owl.hooks;
    var rpc = require('web.rpc');
    const { posbus } = require('point_of_sale.utils');
    var core = require('web.core');
    var _t = core._t;


    const PosCustPaymentScreen = PaymentScreen =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
            }
            async payment_back()  {
                var order = this.env.pos.get_order();
                if(order.get_orderlines().length != 0){
                    if(order && order.is_from_sync_screen){
                        const { confirmed } = await this.showPopup('ConfirmPopup', {
                            title: this.env._t('Remove Order'),
                            body: this.env._t(
                                'Would you like to remove current order?'
                            ),
                        });
                        if (confirmed) {
                            await order.destroy({ reason: 'abandon' });
                            await posbus.trigger('order-deleted');
                            this.showScreen('ProductScreen');
                        }
                    }else{
                        this.showScreen('ProductScreen');
                    }
                }else{
                    this.showScreen('ProductScreen');
                }
            }
            async _finalizeValidation() {
                if(this.env.pos.config.restaurant_mode == 'quick_service'){
                    this.currentOrder.set_send_to_kitchen(true);
                }
                await super._finalizeValidation()
            }
        };

    Registries.Component.extend(PaymentScreen, PosCustPaymentScreen);

    return PaymentScreen;
});
