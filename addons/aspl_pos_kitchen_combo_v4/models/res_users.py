# -*- coding: utf-8 -*-
#################################################################################
# Author      : Acespritech Solutions Pvt. Ltd. (<www.acespritech.com>)
# Copyright(c): 2012-Present Acespritech Solutions Pvt. Ltd.
# All Rights Reserved.
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#################################################################################
from odoo import fields, models


class ResUsers(models.Model):
    _inherit = 'res.users'

    kitchen_screen_user = fields.Selection([('cook', 'Cocinero'), ('chef', 'Chef'), ('waiter', 'Mesero'), ('manager', 'Manager'), ('cashier', 'Cajero'), ('hostess', 'Hostess')],
                                           string="Kitchen Screen User")
    pos_category_ids = fields.Many2many('pos.category', string="POS Categories")
    default_pos = fields.Many2one('pos.config', string="POS Config")
    is_delete_order_line = fields.Boolean(string="Can Delete Order Line")
    delete_order_line_reason = fields.Boolean(string="Reason For Delete Order Line")
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
