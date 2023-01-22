odoo.define('pos_saveguard_tips.MenuButtonlt', function(require) {
    'use strict';
       const PosComponent = require('point_of_sale.PosComponent');
       const { useListener } = require('web.custom_hooks');
       const Registries = require('point_of_sale.Registries');
       const ProductScreen = require('point_of_sale.ProductScreen');
       class MenuButtonlt extends PosComponent {
       
       constructor() {
       super(...arguments);
       }
          
          
       onClick() {
        let selected_menuitem = $('#menuitem').val();
        const $select = document.querySelector('#menuitem');

        if (selected_menuitem == 1) {
            $select.value = '0'
            this.showPopup('SaveguardPopup');
        }

        if (selected_menuitem == 2) {
            $select.value = '0'
            this.showPopup('CashInOutStatementPopup');
        }

        if (selected_menuitem == 3) {
            $select.value = '0'
            //this.showPopup('CashInOutStatementPopup');
        }
    }
   }
          MenuButtonlt.template = 'MenuButtonlt';
        
          Registries.Component.add(MenuButtonlt);
          return MenuButtonlt;
    });