odoo.define('aspl_pos_kitchen_combo.ComboProductList', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useState } = owl.hooks;
    const { useListener } = require('web.custom_hooks');

    class ComboProductList extends PosComponent {
        constructor() {
            super(...arguments);
            this.state = useState({});
        }
        
        
        get productQuantityLine(){
            console.log("Ingresa en productQuantityLine ++++++++++++")
            console.log("this.props")
            console.log(this.props)
            //console.log(this)
            this.env.pos.defaultComboCategoryId = this.props.selected_id
            return this.props.quantityLine[this.props.selected_id]
        }

    }
    ComboProductList.template = 'ComboProductList';

    Registries.Component.add(ComboProductList);

    return ComboProductList;
});
