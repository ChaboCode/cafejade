odoo.define('pos_saveguard_tips.SelectWaiterPopup', function(require){
    'use strict';

    const Popup = require('point_of_sale.ConfirmPopup');
    const Registries = require('point_of_sale.Registries');
    const PosComponent = require('point_of_sale.PosComponent');
    var core = require('web.core');
    let redeem;
    let point_value = 0;
    let remove_line;
    let remove_true = false;
    let entered_code;
    var rpc = require('web.rpc');

    class SelectWaiterPopup extends Popup {

        constructor() {
            super(...arguments);
        }

           async willStart() {
              try {
                  this.get_data_waiters = await this.rpc({
                      model: 'pos.session',
                      method: 'get_data_waiters',
                      args: [[this.env.pos.pos_session.id]]
                  });
                  
              } catch (error) {
                  this.error = error;
              }
          }

        cancelar() {
            this.trigger('close-popup');
        }

   

        async ingresar_mesero()
        {
            let self = this;
            let order = this.env.pos.get_order()
            let user = self.env.pos.user;
            let selected_waiter = $('#waiter').val();
            
            if(order.server_id === false)
            {
            if(order.is_empty()){
                self.showPopup('ErrorPopup', {
                            'title': this.env._t('No se han agregado productos al pedido'),
                            'body': this.env._t('Por favor primero añada productos al pedido'),
                        });

                return
              }
            }

            if(order.server_id === false)
            {
              var orderId = await this.env.pos.push_orders(order);
              order.set_server_id(orderId[0]);
            }
            
            if(selected_waiter === '0')
            {
                this.showNotification('Por favor seleccione un mesero!!');
            }

            else {
                this.rpc({
                    model: 'pos.order',
                    method: 'update_waiter_in_order',
                    args: [order.server_id, selected_waiter],

                }).then(function(output) {
                    if (output == true){
                        //pass

                    } else {
                        self.showPopup('ErrorPopup', {
                            'title': self.env._t('Error al registrar'),
                            'body': self.env._t('Ocurrio un error al registrar el mesero'),
                        });
                    }

                    var rpc = require('web.rpc');            
                    var mesero_relacionado = rpc.query({

                        model:'res.users',

                        method: 'search_read',

                        domain:[['id','=',selected_waiter]],

                        fields: ['name']

                    });
                    let promise1 = Promise.resolve(mesero_relacionado).then(function(value){
                        return value[0];       
                    });  
                    promise1.then((value) => {
                        self.env.pos.waitername = value['name']
                        self.trigger('close-popup');

                    })

                        });
                    }
            

            //this.env.qweb.renderElement()
            //core.qweb.render('pos_saveguard_tips.SelectWaiterProduct')
            //core.qweb.render(this.Template, {widget: this});
            
        }
        
    };
    
    SelectWaiterPopup.template = 'SelectWaiterPopup';
    Registries.Component.add(SelectWaiterPopup);
    return SelectWaiterPopup;

});