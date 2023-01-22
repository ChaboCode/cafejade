# -*- coding: utf-8 -*-

from odoo import fields, models,tools,api

class pos_config(models.Model):
    _inherit = 'pos.config' 

    allow_merge_split_table = fields.Boolean('Allow Table Merge Split', default=True)

class pos_order(models.Model):
    _inherit = 'pos.order'

    merge_tables = fields.Char("Merge Tables")

    @api.model
    def _order_fields(self, ui_order):
        res = super(pos_order, self)._order_fields(ui_order)
        res['merge_tables'] = ui_order['merge_tables'] if 'merge_tables' in ui_order else ""
        return res

