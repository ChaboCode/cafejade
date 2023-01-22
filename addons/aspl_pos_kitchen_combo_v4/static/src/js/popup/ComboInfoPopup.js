odoo.define('aspl_pos_kitchen_combo.ComboInfoPopup', function (require) {
    'use strict';

    const { useState, useExternalListener } = owl.hooks;
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');


    class ComboInfoPopup extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
        }
    }
    ComboInfoPopup.template = 'ComboInfoPopup';

    Registries.Component.add(ComboInfoPopup);

    return ComboInfoPopup;
});
