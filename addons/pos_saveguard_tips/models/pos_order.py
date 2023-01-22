# -*- coding: utf-8 -*-
from odoo import models, fields, api
from datetime import datetime
class PosOrder(models.Model):
    _inherit = "pos.order"
    
    waiter_id = fields.Many2one('res.users',string="Mesero")
    waiter_old_id = fields.Many2one('res.users',string="Mesero anterior")
    motive_reasing = fields.Char(string="Motivo de reasignación")
    tips_ids = fields.One2many('pos.entrada.salida','order_id',string="Pagos de propinas")
    
    def get_tips(self):
        return {'tips': [{'metodo': pm.method_id.name,'monto': pm.amount} for pm in self.tips_ids]}

    
    def update_waiter_in_order(self,waiter):
        
        print ("Esto es self in update_waiter_in_order",self)
        print ("Esto es waiter in update_waiter_in_order ",waiter)
        self.waiter_id = waiter
        return True
    
    def reasing_waiter_in_order(self,waiter,motive):
        
        print ("Esto es self in update_waiter_in_order",self)
        print ("Esto es waiter in update_waiter_in_order ",waiter)
        self.waiter_old_id = self.waiter_id
        self.waiter_id = waiter
        self.motive_reasing = motive
        return True