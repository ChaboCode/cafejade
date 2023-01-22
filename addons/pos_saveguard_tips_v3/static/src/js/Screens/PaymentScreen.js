odoo.define('pos_saveguard_tips.PaymentScreenOgum', function (require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen')
    const { parse } = require('web.field_utils');
    const PosComponent = require('point_of_sale.PosComponent');
    const { useErrorHandlers, useAsyncLockedMethod } = require('point_of_sale.custom_hooks');
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { onChangeOrder } = require('point_of_sale.custom_hooks');
    const { isConnectionError } = require('point_of_sale.utils');

    const PaymentScreenOgum = PaymentScreen =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
            }

            async willStart() {
    
                ////console.log("Ingresa en willStart dentro de payment")
                ////console.log(this.env.pos.get_order().server_id)
                    this.get_tips = await this.rpc({
                        model: 'pos.order',
                        method: 'get_tips',
                        args: [[this.env.pos.get_order().server_id]]
                    });
                    ////console.log("Esto es get tips")
                    ////console.log(this.get_tips)
            }     
        };

    Registries.Component.extend(PaymentScreen,PaymentScreenOgum);

    return PaymentScreenOgum;
});