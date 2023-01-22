odoo.define('pos_saveguard_tips.ReasingWaiterPopup', function(require){
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

    class ReasingWaiterPopup extends Popup {

        constructor() {
            super(...arguments);
        }

            async willStart() {
            console.log("Ingresa en willStart dentro de ReasingWaiterPopup")
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
            let order = this.env.pos.get_order();
            let selected_waiter = $('#waiter').val();
            let entered_reason = $("#reason").val();

            console.log(entered_reason)
            

            if(entered_reason === '')
            {
                this.showNotification('Por favor ingrese el motivo de reasignación.');
                return
            }
            
            if(selected_waiter === '0')
            {
                this.showNotification('Por favor seleccione un mesero.');
            }

            else {
                this.rpc({
                    model: 'pos.order',
                    method: 'reasing_waiter_in_order',
                    args: [order.server_id, selected_waiter,entered_reason],

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
    
    ReasingWaiterPopup.template = 'ReasingWaiterPopup';
    Registries.Component.add(ReasingWaiterPopup);
    return ReasingWaiterPopup;

});