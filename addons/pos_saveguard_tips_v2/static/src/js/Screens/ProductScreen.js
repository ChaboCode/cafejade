odoo.define('pos_saveguard_tips.ProductScreen', function(require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen')
    const PosComponent = require('point_of_sale.PosComponent');
    const ControlButtonsMixin = require('point_of_sale.ControlButtonsMixin');
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { onChangeOrder, useBarcodeReader } = require('point_of_sale.custom_hooks');
    const { useState } = owl.hooks;


    const ProductScreenOgum = ProductScreen =>
        class extends ProductScreen {
            constructor() {
                super(...arguments);
                useListener('set-order-type-mode', this._setOrderTypeMode);
            }
            _setOrderTypeMode(event) {
                const { mode } = event.detail;
                this.state.orderTypeMode = mode;
            }
            async _onClickPay() {
                let self = this;
                console.log('Se dio click en _onClickPay');
                console.log(this.env.pos.waitername)
                if (this.env.pos.waitername === undefined) {
                    self.showPopup('ErrorPopup', {
                        'title': this.env._t('Mesero no asignado en el pedido'),
                        'body': this.env._t('Debe asignar un mesero primero para generar el pago'),
                    });
                }
                if (this.env.pos.waitername === false) {
                    self.showPopup('ErrorPopup', {
                        'title': this.env._t('Mesero no asignado en el pedido'),
                        'body': this.env._t('Debe asignar un mesero primero para generar el pago'),
                    });
                }
                else{
                    if(this.env.pos.user.kitchen_screen_user === "manager"){
                        await super._onClickPay();
                    }else{
                        return;
                    }
                }
                
            }
        };

    Registries.Component.extend(ProductScreen, ProductScreenOgum);

    return ProductScreen;
});
