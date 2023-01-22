# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime
class PosConfig(models.Model):
    _inherit = "pos.config"
    _description = "Punto de venta"
    
    recordatorio_salvaguarda = fields.Integer(string="Recordatorio salvaguardas (min)",default=5)
    monto_salvaguarda = fields.Float(string="Monto salvaguardas")
    salvaguardas_requerida = fields.Boolean(string="Salvaguarda requerida")
    fecha_ultimo_recordatorio = fields.Datetime(string="Fecha ultimo recordatorio")
    payment_method_id = fields.One2many('pos.payment.method','pos_id',string="Metodos de pago para propinas")
    
    def set_fecha_ultimo_recordatorio(self, fecha_ultimo_recordatorio):
        fecha_ultimo_recordatorio = fecha_ultimo_recordatorio[0:19]
        fecha = fecha_ultimo_recordatorio.replace("T"," ")
        self.fecha_ultimo_recordatorio=fecha
        self.salvaguardas_requerida = True
        return

