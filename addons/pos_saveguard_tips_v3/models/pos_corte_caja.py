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
	create_date  =  fields.Datetime('Fecha creación', default = datetime.now(), )

