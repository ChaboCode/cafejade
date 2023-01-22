odoo.define('pos_saveguard_tips.SaveTipsPopup', function(require){
    'use strict';

    const Popup = require('point_of_sale.ConfirmPopup');
    const Registries = require('point_of_sale.Registries');
    const PosComponent = require('point_of_sale.PosComponent');
    let redeem;
    let point_value = 0;
    let remove_line;
    let remove_true = false;
    let entered_code;
    var rpc = require('web.rpc');

    class SaveTipsPopup extends Popup {

        constructor() {
            super(...arguments);
        }

           async willStart() {
              try {
                  console.log("Ingresa en willStart dentro de savetipspopup");
                  this.get_data = await this.rpc({
                      model: 'pos.session',
                      method: 'get_method_tips',
                      args: [[this.env.pos.pos_session.id]]
                  });

              } catch (error) {
                  this.error = error;
              }
          }

        cancelar() {
            this.trigger('close-popup');
        }

        mounted(){
            $('#error1').hide();
        }

        save_summary_details(operation, entered_reason, entered_amount, selected_method,nombre_usuario){
            let self = this;
            this.trigger('close-popup');
            self.showTempScreen('CashInReceiptScreen',{ 
                operation:operation,
                purpose:entered_reason,
                amount:entered_amount,
                method:selected_method,
                nombre_usuario:nombre_usuario
            });
        }

        async ingresar_propinas()
        {   
         
          console.log("Ingresa en INGRESAR PROPINAS")
          console.log()
            let self = this;
            let order = this.env.pos.get_order();
            let user = self.env.pos.user;
            let entered_amount = $("#amount").val();
            let selected_waiter = $('#waiter').val();
            let selected_method = $('#tips').val();
            let entered_reason = "Propinas";
            let session_id = self.env.pos.pos_session.id;
            

            if(entered_amount == '')
            {
                $("#error1").text("Please enter amount.");
                $('#error1').show();
                setTimeout(function() {$('#error1').hide()},2000);
                return;
            }
            else{

                var mesero_relacionado = rpc.query({
                    model:'pos.order',

                    method: 'search_read',

                    domain:[['id','=',order.server_id]],

                    fields: ['waiter_id']

                });

                let promise1 = Promise.resolve(mesero_relacionado).then(function(value){
                    return value[0]['waiter_id'];       
                });  
                promise1.then((value) => {
                    this.rpc({
                        model: 'cash.box.in',
                        method: 'create_cash_in',
                        args: [0, value[0], entered_reason, entered_amount, session_id, selected_method,order.server_id],
    
                    }).then(function(output) {
                        if (output == true){
                            //pass
                        } else {
                            self.showPopup('ErrorPopup', {
                                'title': this.env._t('Error al registrar'),
                                'body': this.env._t('Ocurrio un error al registrar la propina'),
                            });
                        }
                    });
                    var metodo_de_pago = rpc.query({

                        model:'pos.payment.method',
        
                        method: 'search_read',
        
                        domain:[['id','=',value[0]]],
        
                        fields: ['name']
        
                    });
                    
                    this.trigger('close-popup');
                });

                

                
            }



            


            //Promise.resolve(metodo_de_pago).then(function(value1){
            //Promise.resolve(mesero_relacionado).then(function(value){

            //self.save_summary_details('Ingreso de efectivo', entered_reason,entered_amount,value1[0]['name'],value[0]['name'])           
            //})
        //});    

            

            
        }
        
    };
    
    SaveTipsPopup.template = 'SaveTipsPopup';
    Registries.Component.add(SaveTipsPopup);
    return SaveTipsPopup;

});