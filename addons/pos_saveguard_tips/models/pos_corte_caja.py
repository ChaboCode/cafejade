# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import date, time, datetime
class PosCorteCaja(models.Model):
	_name = 'pos.corte.caja'
	_rec_name = 'user_id'
	_description = "Cortes de caja"
	_order = 'create_date desc, name desc, id desc'

	name = fields.Char(string = "Sequencia corte de caja" , required=True, copy=False)
	user_id  = fields.Many2one('res.users','Cajero')
	user_name  = fields.Char(related='user_id.name',store=True,string='Nombre del usuario')
	session_id  = fields.Many2one('pos.session','Sessión')
	initial_date  =  fields.Datetime('Fecha inicio')
	create_date  =  fields.Datetime('Fecha generación corte', default = datetime.now(),)
	cash_in = fields.Float(string="Efectivo ingresado")
	cash_calculate = fields.Float(string="Efectivo calculado")
	cash_diference = fields.Float(string="Diferencia")
	moves_ids = fields.One2many('pos.corte.caja.line','section_id',string="Movimientos")


class PosCorteCaja(models.Model):
	_name = 'pos.corte.caja.line'
	_order = 'name asc'

	name = fields.Char("Movimiento")
	section_id = fields.Many2one('pos.corte.caja', string="Corte caja relacionado")
	amount = fields.Float("Monto")	