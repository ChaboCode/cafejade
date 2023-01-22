odoo.define('pos_saveguard_tips.saveguardButton', function(require) {
'use strict';
   const PosComponent = require('point_of_sale.PosComponent');
   const { useListener } = require('web.custom_hooks');
   const Registries = require('point_of_sale.Registries');
   class SaveguardButtonProduct extends PosComponent {
   
   constructor() {
      
   super(...arguments);
   }
      
      onClick() {
               this.showPopup('SaveguardPopup');
         }

      }
      SaveguardButtonProduct.template = 'SaveguardButtonProduct';

      Registries.Component.add(SaveguardButtonProduct);
      return SaveguardButtonProduct;
});