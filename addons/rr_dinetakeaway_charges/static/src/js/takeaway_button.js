odoo.define('rr_dinetakeaway_charges.TakeAwayButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { useState, useRef, useContext } = owl.hooks;

    class TakeAwayButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.click_check_takeaway);
            useListener('click', this.click_uncheck_dine);
            this.state = useState({
                takeinstatus: false,
            });
        }
        get takeawaystatus() {
            var order = this.env.pos.get_order();
            return order ? order.get_takeaway_status() : false;
        }
        async product_takeaway(){
            var order = this.env.pos.get_order();
            var lines    = order.get_orderlines();
            var product  = this.env.pos.db.get_product_by_id(this.env.pos.config.takeaway_product_id[0]);
            var pc = this.env.pos.config.takeaway_charges;
            if (product === undefined) {
                await this.showPopup('ErrorPopup', {
                    title : this.env._t("No TakeAway Product Found"),
                    body  : this.env._t("The Takeaway Product Configuration can be found on Pos Configuration. Make sure it is filled with Takeaway Product and charges."),
                });
                return;
            }

            // Remove existing takeaways
            this.remove_product_takeaway();
            // add new takeaway
            if( pc > 0 ){
                order.add_product(product, {
                    price: pc,
                    lst_price: pc,
                    extras: {
                        price_manually_set: true,
                    },
                });
            }

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
        async click_check_takeaway() {
            var order = this.env.pos.get_order();
              order.set_takeaway_status(!order.get_takeaway_status());
              if (order.get_takeaway_status()) {
                $('.js_check_takeaway').addClass('highlight');
                this.state.takeinstatus = true;
                this.product_takeaway();
              } else {
                $('.js_check_takeaway').removeClass('highlight');
                this.state.takeinstatus = false;
                this.remove_product_takeaway();
              }
        
        }
        async click_uncheck_dine() {
                var order = this.env.pos.get_order();
                order.set_dine_in_status(false);
                $('.js_check_dine').removeClass('highlight');
            }
    }
    TakeAwayButton.template = 'TakeAwayButton';
    
    ProductScreen.addControlButton({
        component: TakeAwayButton,
        condition: function() {
            return this.env.pos.config.module_pos_restaurant && this.env.pos.config.iface_takeaway_dine;
        },
    });

    Registries.Component.add(TakeAwayButton);

    return TakeAwayButton;
});
