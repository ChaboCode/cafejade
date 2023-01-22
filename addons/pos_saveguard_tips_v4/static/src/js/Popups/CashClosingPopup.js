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




        async generarCorteCaja() {
            let entered_amount = $("#amount").val();
            let response;
            response = await this.rpc({
                   model: 'pos.session',
                   method: 'closing_cash_unseeing',
                   args: [this.env.pos.pos_session.id,this.env.pos.user.id,entered_amount]})

               if (!response.successful) {
                   return this.handleClosingError(response);
               }
           
            this.trigger('close-popup');
            
        }

        async handleClosingError(response) {
            await this.showPopup('ErrorPopup', {title: 'Error', body: response.message});
        }


    };
    
    CashClosingPopup.template = 'CashClosingPopup';

    Registries.Component.add(CashClosingPopup);

    return CashClosingPopup;

});