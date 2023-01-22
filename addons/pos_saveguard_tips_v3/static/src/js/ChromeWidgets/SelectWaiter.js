odoo.define('pos_saveguard_tips.SelectWaiter', function(require) {
    'use strict';
       const { Gui } = require('point_of_sale.Gui');
       const PosComponent = require('point_of_sale.PosComponent');
       const { posbus } = require('point_of_sale.utils');
       const ProductScreen = require('point_of_sale.ProductScreen');
       const { useListener } = require('web.custom_hooks');
       const Registries = require('point_of_sale.Registries');
       const PaymentScreen = require('point_of_sale.PaymentScreen');
       class SelectWaiterProduct extends PosComponent {

       constructor() {
              
       super(...arguments);
        useListener('click', this.onClick);


        // --------------------------------------------- Codigo para revisión de salvaguarda ----------------------
        ////console.log("Ingresa en constructor")
        var rpc = require('web.rpc');
        let order = this.env.pos.get_order();
        let self = this;
        let user = self.env.pos.user;
        if (user.genera_salvaguarda) {
            try {
              const closingData = this.rpc({
                  model: 'pos.session',
                  method: 'get_closing_control_data',
                  args: [[this.env.pos.pos_session.id]]
              });

              const promise1 = Promise.resolve(closingData);
              promise1.then((value) =>{

              let ordersDetails = value.orders_details;
              let paymentsAmount = value.payments_amount;
              let payLaterAmount = value.pay_later_amount;
              let openingNotes = value.opening_notes;
              let defaultCashDetails = value.default_cash_details;
              let otherPaymentMethods = value.other_payment_methods;
              let isManager = value.is_manager;
              let amountAuthorizedDiff = value.amount_authorized_diff;
              const monto_apertura = parseFloat(this.env.pos.bank_statement.balance_start);
              const total_efectivo = parseFloat(defaultCashDetails['amount']);
              const total_propinas_efectivo = parseFloat(defaultCashDetails['tips_amount']);
              const disponible_salvaguarda =  total_efectivo - monto_apertura - total_propinas_efectivo
                
              var parametros_salvaguarda = rpc.query({
 
                model:'pos.config',
    
                method: 'search_read',
    
                domain:[['id','=',this.env.pos.config.id]],
    
                fields: ['monto_salvaguarda','salvaguardas_requerida','fecha_ultimo_recordatorio','recordatorio_salvaguarda']
    
              });
              let promise1 = Promise.resolve(parametros_salvaguarda).then(function(value){
                return value[0];       
              });  
              promise1.then((value) => {
                const monto_requerido_salvaguarda  = value['monto_salvaguarda']
                const salvaguarda_requerida = value['salvaguardas_requerida']
                var currentDateObj = new Date(value['fecha_ultimo_recordatorio'])
                var min =parseInt(value['recordatorio_salvaguarda'])

              if (disponible_salvaguarda>monto_requerido_salvaguarda && salvaguarda_requerida == false){
                this.showPopup('SaveguardAlertPopup');
              }
              
              var numberOfMlSeconds = currentDateObj.getTime();
              var restaMlSeconds = 6 * 60 * 60000;
              var addMlSeconds = min * 60000;
              const fecha_ultima_salvaguarda = new Date(numberOfMlSeconds - restaMlSeconds + addMlSeconds);              
              const fecha_actual = new Date();
              if (disponible_salvaguarda>monto_requerido_salvaguarda && salvaguarda_requerida == true && fecha_actual > fecha_ultima_salvaguarda){
                this.showPopup('SaveguardAlertPopup');
              }
              })
              
              });

          } catch (error) {
              this.error = error;
          }
          
          
    }
    }

       async willStart() {
        ////console.log("Ingresa en willStart dentro de SelectWaiter")
        try {
                   // --------------------------------------------- Codigo para asignar mesero en boton ----------------------
        var rpc = require('web.rpc');
        let order = this.env.pos.get_order();
        var mesero_relacionado = await rpc.query({

            model:'pos.order',

            method: 'search_read',

            domain:[['id','=',order.server_id]],

            fields: ['waiter_id']

        });

        let promise1 = Promise.resolve(mesero_relacionado).then(function(value){
            return value[0];       
        });


        promise1.then((value) => {

           if (value === undefined){
            this.env.pos.waitername = false
           }
           else{
           this.env.pos.waitername = value['waiter_id'][1]
          }
        })
        
        }
        catch (error) {
            this.error = error;
        }
       

       }
          
       onClick() {
                    let self = this;
                    var rpc = require('web.rpc');
                    let order = this.env.pos.get_order();
                    
                    if (order == null){
                      return
                    }
                    
                    var mesero_relacionado = rpc.query({
                        model:'pos.order',

                        method: 'search_read',

                        domain:[['id','=',order.server_id]],

                        fields: ['waiter_id']

                    });

                    let promise1 = Promise.resolve(mesero_relacionado).then(function(value){
                        return value[0];       
                    });  
                    promise1.then((value) => {
                      if (value === undefined){
                        this.showPopup('SelectWaiterPopup');
                       }
                       else{
                            if (value['waiter_id'] == false){
                              this.showPopup('SelectWaiterPopup');
                            }  
                            else{
                              self.showPopup('ErrorPopup', {

                                'title': this.env._t('El mesero ya fue asignado'),
                                'body': this.env._t('Ya fue asignado el mesero: "'+ value['waiter_id'][1] + '" puede generar una reasignación para cambiarlo.'),
                            });
                      }
                    }
                    });
               }
    
          }
          SelectWaiterProduct.template = 'SelectWaiterProduct';
          
       ProductScreen.addControlButton({
       component: SelectWaiterProduct,
       condition: function() {
       return this.env.pos.user.buttonwaiter;
       },
          });
          
          Registries.Component.add(SelectWaiterProduct);
          return SelectWaiterProduct;
    });