odoo.define('rr_dinetakeaway_charges.DineInButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { useState, useRef, useContext } = owl.hooks;

    class DineInButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.click_check_dine);
            useListener('click', this.click_uncheck_takeaway);
            this.state = useState({
                dineinstatus: false,
            });

        }
        get dineinstatus() {
            var order = this.env.pos.get_order();
            return order ? order.get_dine_in_status() : false;
        }
        async remove_product_takeaway(){
            var order = this.env.pos.get_order();
            var lines    = order.get_orderlines();
            var product  = this.env.pos.db.get_product_by_id(this.env.pos.config.takeaway_product_id[0]);
            var i = 0;
            while ( i < lines.length ) {
                if (lines[i].get_product() === product) {
                    order.remove_orderline(lines[i]);
                } else {
                    i++;
                }
            }
        }
        async click_check_dine() {
           var order = this.env.pos.get_order();
           order.set_dine_in_status(!order.get_dine_in_status());
           if (order.get_dine_in_status()) {
                $('.js_check_dine').addClass('highlight');
                this.state.dineinstatus = true;
                this.remove_product_takeaway();
              } else {
                $('.js_check_dine').removeClass('highlight');
                this.state.dineinstatus = false;
              }

        }
        async click_uncheck_takeaway() {
                var order = this.env.pos.get_order();
                order.set_takeaway_status(false);
                $('.js_check_takeaway').removeClass('highlight');
            }
    }
    DineInButton.template = 'DineInButton';

    ProductScreen.addControlButton({
        component: DineInButton,
        condition: function() {
            return this.env.pos.config.module_pos_restaurant;
        },
    });

    Registries.Component.add(DineInButton);

    return DineInButton;
});
