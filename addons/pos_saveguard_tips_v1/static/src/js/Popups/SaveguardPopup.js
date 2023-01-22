odoo.define('pos_saveguard_tips.SaveguardPopup', function(require){
    'use strict';

    const Popup = require('point_of_sale.ConfirmPopup');
    const Registries = require('point_of_sale.Registries');
    const PosComponent = require('point_of_sale.PosComponent');
    let redeem;
    let point_value = 0;
    let remove_line;
    let remove_true = false;
    let entered_code;

    class SaveguardPopup extends Popup {

        constructor() {
            super(...arguments);
        }

        async willStart() {
            try {
                const closingData = await this.rpc({
                    model: 'pos.session',
                    method: 'get_closing_control_data',
                    args: [[this.env.pos.pos_session.id]]
                });
                this.ordersDetails = closingData.orders_details;
                this.paymentsAmount = closingData.payments_amount;
                this.payLaterAmount = closingData.pay_later_amount;
                this.openingNotes = closingData.opening_notes;
                this.defaultCashDetails = closingData.default_cash_details;
                this.otherPaymentMethods = closingData.other_payment_methods;
                this.isManager = closingData.is_manager;
                this.amountAuthorizedDiff = closingData.amount_authorized_diff;

                const monto_apertura = parseFloat(this.env.pos.bank_statement.balance_start);
                const total_efectivo = parseFloat(this.defaultCashDetails['amount']);
                const total_propinas_efectivo = parseFloat(this.defaultCashDetails['tips_amount']);
                this.env.pos.disponible_salvaguarda =  parseFloat(total_efectivo - monto_apertura - total_propinas_efectivo)
            } catch (error) {
                this.error = error;
            }
        }

        cancelarSalvaguarda() {
            this.trigger('close-popup');
        }

        mounted(){
            $('#error1').hide();
        }

        save_summary_details(operation, entered_reason, entered_amount){
            let self = this;
            this.trigger('close-popup');
            self.showTempScreen('CashOutReceiptScreen',{ 
                operation:operation,
                purpose:entered_reason,
                amount:entered_amount
            });
        }

        generarSalvaguarda() {
            const monto_apertura = parseFloat(this.env.pos.bank_statement.balance_start);
            let self = this;
            let order = this.env.pos.get_order();
            let user = self.env.pos.user;
            let entered_amount = $("#amount").val();
            let entered_reason = "Salvaguarda";
            let session_id = self.env.pos.pos_session.id;

            const total_efectivo = parseFloat(this.defaultCashDetails['amount']);

            const total_propinas_efectivo = parseFloat(this.defaultCashDetails['tips_amount']);


            if(entered_amount == '')
            {
                $("#error1").text("Porfavor ingrese un monto.");
                $('#error1').show();
                setTimeout(function() {$('#error1').hide()},2000);
                return;
            }
            
            else{
                const disponible_salvaguarda =  total_efectivo - monto_apertura - total_propinas_efectivo
                if (entered_amount>disponible_salvaguarda) {
                    self.showPopup('ErrorPopup', {
                            'title': this.env._t('Cantidad mayor a monto disponible para salvaguarda'),
                            'body': this.env._t('Usted solo cuenta con $'+disponible_salvaguarda)+' para generar una salvaguarda',
                        });
                }

                else{
                    this.rpc({
                    model: 'cash.box.out',
                    method: 'create_cash_out',
                    args: [0,user.id, entered_reason, entered_amount, session_id],

                    }).then(function(output) {
                        if (output == true){
                            self.save_summary_details('Retiro de efectivo', entered_reason,entered_amount)
                        } else {
                            self.showPopup('ErrorPopup', {
                                'title': this.env._t('Error al registrar'),
                                'body': this.env._t('Ocurrio un error al registrar la salida'),
                            });
                        }                   
                    });   

                };



                  
            }
        }


    };
    
    SaveguardPopup.template = 'SaveguardPopup';

    Registries.Component.add(SaveguardPopup);

    return SaveguardPopup;

});