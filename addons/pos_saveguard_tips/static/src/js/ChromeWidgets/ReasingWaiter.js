odoo.define('pos_saveguard_tips.ReasingWaiter', function(require) {
    'use strict';
       const { Gui } = require('point_of_sale.Gui');
       const PosComponent = require('point_of_sale.PosComponent');
       const { posbus } = require('point_of_sale.utils');
       const ProductScreen = require('point_of_sale.ProductScreen');
       const { useListener } = require('web.custom_hooks');
       const Registries = require('point_of_sale.Registries');
       const PaymentScreen = require('point_of_sale.PaymentScreen');
       class ReasingWaiterProduct extends PosComponent {

       constructor() {
              
       super(...arguments);
        useListener('click', this.onClick);
    }
          
       onClick() {
                    let self = this;
                    var rpc = require('web.rpc');
                    let order = this.env.pos.get_order();
                    
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
                        self.showPopup('ErrorPopup', {

                            'title': this.env._t('Sin mesero asignado'),
                            'body': this.env._t('Debe tener un mesero asignado para hacer una reasignación.'),
                        });
                       }
                       else{
                            if (value['waiter_id'] == false){
                                self.showPopup('ErrorPopup', {

                                    'title': this.env._t('Sin mesero asignado'),
                                    'body': this.env._t('Debe tener un mesero asignado para hacer una reasignación.'),
                                });
                              
                            }  
                            else{
                                this.showPopup('ReasingWaiterPopup');
                             
                      }
                    }
                    });
               }
    
          }
          ReasingWaiterProduct.template = 'ReasingWaiterProduct';
          
       ProductScreen.addControlButton({
       component: ReasingWaiterProduct,
       condition: function() {
       return this.env.pos.user; 
       },
          });
          
          Registries.Component.add(ReasingWaiterProduct);
          return ReasingWaiterProduct;
    });