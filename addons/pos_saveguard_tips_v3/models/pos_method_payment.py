# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime
class PosPaymentMethod(models.Model):
    _inherit = "pos.payment.method"

    pos_id = fields.Many2one('pos.config')