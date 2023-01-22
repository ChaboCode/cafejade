# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import date, time, datetime
class PosEntradaSalida(models.Model):
	_name = 'pos.entrada.salida'
	_rec_name = 'user_id'
	_description = "Entradas o salidas de efectivo"
	_order = 'create_date desc, name desc, id desc'

	name = fields.Char(string = "Sequencia salidas/entradas efectivo" , required=True, copy=False)
	user_id  = fields.Many2one('res.users','Usuario')
	user_name  = fields.Char(related='user_id.name',store=True,string='Nombre del usuario')
	session_id  = fields.Many2one('pos.session','Sessión')
	amount  =  fields.Float('Monto')
	create_date  =  fields.Datetime('Fecha creación', default = datetime.now(), )
	cash_type = fields.Selection([
		('credit', 'Entrada'),
		('debit', 'Salida')
		], string='Tipo', default='credit')
	reason = fields.Char("Motivo")
	method_id = fields.Many2one('pos.payment.method',string="Metodo de pago")
	order_id = fields.Many2one('pos.order',string="Pedido relacionado")

	@api.model
	def create(self, values):
		values['name'] = self.env['ir.sequence'].next_by_code('pos.entrada.salida')
		res = super(PosEntradaSalida,self).create(values)
		return res

	def get_statement_data(self,selected_cashier,session_id):
		cash_in_data = []
		credit_total = 0.0
		final_data = []
		if selected_cashier == 'General':
			statements = self.env['pos.entrada.salida'].search([
				('session_id', '=', session_id),
				('cash_type', '=', 'credit'),
				('reason', '=', 'Propinas')
			], order="create_date asc" )
		else:
			statements = self.env['pos.entrada.salida'].search([
				('session_id', '=',session_id ),
				('user_id', '=', int(selected_cashier)),
				('cash_type', '=', 'credit'),
                ('reason', '=', 'Propinas')
			])
		print("Esto es statements",statements) 
		for line in statements:
			print("Esto es line nombre",line.user_name)
			data = {}
			if line.amount > 0 :
				credit_total += line.amount
				data.update({'credit': line.amount,'waiter':line.user_id.name,'payment_method':line.method_id.name,'date':line.create_date})
				cash_in_data.append(data)
    
			final_data.append(data)


		cash_in_data_new = []
		final_data_new = []
		if selected_cashier == 'General':
			statements = self.env['pos.entrada.salida'].search([
				('session_id', '=', session_id),
				('cash_type', '=', 'credit'),
				('reason', '=', 'Propinas')
			], order="user_name asc" )
		else:
			statements = self.env['pos.entrada.salida'].search([
				('session_id', '=',session_id ),
				('user_id', '=', int(selected_cashier)),
				('cash_type', '=', 'credit'),
				('reason', '=', 'Propinas')
			])
		print("Esto es statements",statements)
		contador = 1
		nombre_mesero = ""
		for line in statements:
			if nombre_mesero == line.user_id.name:
				continue
			else:
				registros = self.env['pos.entrada.salida'].search([('session_id', '=',session_id ),('user_id', '=', line.user_id.id),('cash_type', '=', 'credit'),('reason', '=', 'Propinas')])
				monto = 0
				for registro in registros:
					monto = monto + registro.amount
				data_new = {}
				data_new.update({'orders_no': len(registros),'waiter':line.user_id.name,'tips_total':monto})
				cash_in_data_new.append(data_new)
			nombre_mesero = line.user_id.name
			final_data_new.append(data_new)


		return[cash_in_data,final_data,credit_total,final_data_new]