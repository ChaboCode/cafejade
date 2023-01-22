odoo.define('pos_saveguard_tips.MenuButtonCut', function(require) {
  
    'use strict';
       const PosComponent = require('point_of_sale.PosComponent');
       const { useListener } = require('web.custom_hooks');
       const { useState } = owl.hooks;
       const Registries = require('point_of_sale.Registries');
       const ProductScreen = require('point_of_sale.ProductScreen');
       class MenuButtonCut extends PosComponent {
       
       constructor() {
       super(...arguments);
       this.state = useState({});
       }
          
       onClick() {
        ////console.log("onClick button optiones");
        ////console.log(this.env.pos.user.genera_salvaguarda)   
        console.log("Ingresa a generar el corte de caja")
        this.showPopup('CashClosingPopup');

       
    }
   }
          MenuButtonCut.template = 'MenuButtonCut';
        
          Registries.Component.add(MenuButtonCut);
          return MenuButtonCut;
    });