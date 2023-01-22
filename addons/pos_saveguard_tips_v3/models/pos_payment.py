# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime
class PosPayment(models.Model):
    _inherit = "pos.payment"
    _description = "Pagos Punto de venta"

    pos_order_id = fields.Many2one('pos.order', string='Order',required=False)
    session_id = fields.Many2one('pos.session', string='Session', store=True, related=False, index=True)
    company_id = fields.Many2one('res.company', string='Company', related='session_id.company_id', store=True)


    @api.constrains('payment_method_id')
    def _check_payment_method_id(self):
        for payment in self:
            print ("Esto es session_id",payment.session_id)
            if not payment.session_id:
              if payment.pos_order_id:
                payment.sudo().write({'session_id':payment.pos_order_id.session_id.id})
            print ("Esto es session_id abajo",payment.session_id)  
            if payment.payment_method_id not in payment.session_id.config_id.payment_method_ids:
                raise ValidationError(_('The payment method selected is not allowed in the config of the POS session.'))

    @api.constrains('session_id')
    def _check_session_id_id(self):
        for session in self:
           if not session.session_id:
           	if session.pos_order_id:
           		session.session_id = session.pos_order_id.id