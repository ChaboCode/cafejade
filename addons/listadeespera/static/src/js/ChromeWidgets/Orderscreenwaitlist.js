odoo.define('listadeespera.OrderscreenwaitlistButton',function(require){
'use strict';

  const { useState } = owl;
  const PosComponent = require('point_of_sale.PosComponent');
  const Registries = require('point_of_sale.Registries');
 
  class OrderwaitControlButton extends PosComponent {     
         constructor() {
            super(...arguments);
        }
        onClick() {
            this.trigger('click-wait-screen');
        } 
       
      

  }
  OrderwaitControlButton.template = 'OrderwaitControlButton';

  Registries.Component.add(OrderwaitControlButton);

  return OrderwaitControlButton;
 
});