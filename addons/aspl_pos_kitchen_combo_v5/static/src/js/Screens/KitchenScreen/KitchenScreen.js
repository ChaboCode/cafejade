odoo.define('aspl_pos_kitchen_combo.KitchenScreen', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { onChangeOrder, useBarcodeReader } = require('point_of_sale.custom_hooks');
    const { useState, useRef } = owl.hooks;


    class KitchenScreen extends PosComponent {
        constructor() {
            super(...arguments);
            this.orderContent = useRef('order-content');
            this.kitchenScreen = useRef('kitchen-screen');
            this._loadOrderData();
        }
        clickLeft(){
            this.orderContent.el.scrollLeft -= 330;
        }
        clickRight(){
            this.orderContent.el.scrollLeft += 330;
        }
        clickDoubleLeft(){
            this.orderContent.el.scrollLeft -= 1200;
        }
        clickDoubleRight(){
            this.orderContent.el.scrollLeft += 1200;
        }
        clickTopLeft(){
            this.kitchenScreen.el.scrollTop = 0;
            this.orderContent.el.scrollLeft = 0;
        }
        clickTopRight(){
            this.orderContent.el.scrollLeft = this.orderContent.el.scrollWidth;
            this.kitchenScreen.el.scrollTop = this.kitchenScreen.el.scrollTop;
        }
        async _loadOrderData(){
            await this.rpc({
                model: 'pos.order',
                method: 'broadcast_order_data',
                args: [[]],
            });
        }
    }
    KitchenScreen.template = 'KitchenScreen';

    Registries.Component.add(KitchenScreen);

    return KitchenScreen;
});