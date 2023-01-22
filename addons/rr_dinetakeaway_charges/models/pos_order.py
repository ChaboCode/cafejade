# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
from odoo import api, fields, models,_


class PosConfig(models.Model):
    _inherit = 'pos.config'

    iface_takeaway_dine = fields.Boolean('Takeaway/Dine')
    takeaway_product_id = fields.Many2one('product.product', 'Takeaway Charges', help="This product is used for takeaway.")
    takeaway_charges = fields.Float('Charges')


    @api.onchange('iface_takeaway_dine')
    def _onchange_takeaway_dine(self):
        if self.iface_takeaway_dine:
            takeaway_product_id = self.env.ref('rr_dinetakeaway_charges.product_product_takeaway', False)
            self.takeaway_product_id = takeaway_product_id
            self.takeaway_charges = takeaway_product_id.list_price if takeaway_product_id else 0
        else:
            self.takeaway_product_id = False
            self.takeaway_charges = 0

class PosOrder(models.Model):
    _inherit = 'pos.order'

    dine_in = fields.Boolean("Dine-in" , default = False)
    takeaway = fields.Boolean("Take away" , default = False)
    
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        res['dine_in'] = ui_order['dine_in']
        res['takeaway'] = ui_order['takeaway']
        return res