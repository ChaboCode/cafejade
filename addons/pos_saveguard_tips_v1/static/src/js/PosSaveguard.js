odoo.define('point_of_sale.PosSaveguard', function (require) {
"use strict";

var core = require('web.core');
console.log("Ingresa en mi js")
/**
 * Implementación para salvaguarda:
 */
var PosSaveguard = core.Class.extend({
    init: function (pos) {
        this.pos = pos;
        console.log("Se encuentra aquí en init")
    },

    close: function () {},
});

return PosSaveguard;
});
