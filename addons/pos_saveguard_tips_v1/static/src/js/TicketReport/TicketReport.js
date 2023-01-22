odoo.define('pos_saveguard_tips.CashInOutStatementButton', function(require) {
	"use strict";

	const { Gui } = require('point_of_sale.Gui');
	const PosComponent = require('point_of_sale.PosComponent');
	const { posbus } = require('point_of_sale.utils');
	const ProductScreen = require('point_of_sale.ProductScreen');
	const { useListener } = require('web.custom_hooks');
	const Registries = require('point_of_sale.Registries');
	const PaymentScreen = require('point_of_sale.PaymentScreen');



	class CashInOutStatementButton extends PosComponent {
		constructor() {
          
   super(...arguments);
          
   useListener('click', this.onClick);
      
   }
      
   is_available() {
          
   const order = this.env.pos.get_order();
          
   return order
      
   }
      
   onClick() {
               this.showPopup('CashInOutStatementPopup');
           }

      }
      CashInOutStatementButton.template = 'CashInOutStatementButton';
      //ProductScreen.addControlButton({
     //component: CashInOutStatementButton,
      //condition: function() {
       //  return this.env.pos; //tolayomods
      //},
   //});
      Registries.Component.add(CashInOutStatementButton);
      return CashInOutStatementButton;
});