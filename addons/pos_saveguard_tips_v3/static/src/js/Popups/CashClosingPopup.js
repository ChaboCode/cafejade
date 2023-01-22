odoo.define('pos_saveguard_tips.CashClosingPopup', function(require){
    'use strict';

    const Popup = require('point_of_sale.ConfirmPopup');
    const Registries = require('point_of_sale.Registries');
    const PosComponent = require('point_of_sale.PosComponent');
    let redeem;
    let point_value = 0;
    let remove_line;
    let remove_true = false;
    let entered_code;

    class CashClosingPopup extends Popup {

        constructor() {
            super(...arguments);
        }

        async willStart() {

        }

        cancelarCorteCaja() {
            this.trigger('close-popup');
        }




        generarCorteCaja() {
            
        }


    };
    
    CashClosingPopup.template = 'CashClosingPopup';

    Registries.Component.add(CashClosingPopup);

    return CashClosingPopup;

});