odoo.define('pos_saveguard_tips.saveTipsButton', function(require) {
'use strict';
    const { Gui } = require('point_of_sale.Gui');
    const PosComponent = require('point_of_sale.PosComponent');
    const { posbus } = require('point_of_sale.utils');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const PaymentScreen = require('point_of_sale.PaymentScreen');
    class SaveTipsButtonProduct extends PosComponent {

    constructor() {
            
    super(...arguments);

    }

    
        async selectTipsNew() {
            console.log("Ingresa en 2")
            this.render();
            this.showPopup('SaveTipsPopup');
        }
        }
        SaveTipsButtonProduct.template = 'SaveTipsButtonProduct';
        Registries.Component.add(SaveTipsButtonProduct);
        return SaveTipsButtonProduct;
});