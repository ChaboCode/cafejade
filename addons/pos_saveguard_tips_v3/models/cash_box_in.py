# -*- coding: utf-8 -*-
from odoo import fields, models, api, _
from datetime import date, time, datetime


class CashBoxIn(models.TransientModel):
	_name = 'cash.box.in'
	_description = "POS entrada"

	def create_cash_in(self, user, reason, amount, session_id,selected_method,order_id):

		cash_in_obj = self.env['pos.entrada.salida'].sudo()
		account_in_obj = self.env['account.bank.statement.line'].sudo()

		vals = {
				'cash_type': 'credit',
				'user_id': user,
				'session_id' : session_id,
				'amount' : float(amount),
				'create_date': datetime.now().date(),
				'reason': reason,
				'method_id':selected_method,
    			'order_id' : order_id
			}
		cash_create = cash_in_obj.create(vals)
		
		metodo_pago = self.env['pos.payment.method'].search([('id','=',selected_method)])

		if metodo_pago.journal_id.type == 'cash':
			stmt_id = self.env['pos.session'].browse(session_id).cash_register_id
			
			print ("Esto es stmt_id",stmt_id)

			if not stmt_id:
				return False

			if stmt_id.difference < 0.0:
				account = stmt_id.journal_id.loss_account_id
				name = _('Loss')
			else:
				account = stmt_id.journal_id.profit_account_id
				name = _('Profit')

			values = {
				'statement_id': stmt_id.id,
				'name': stmt_id.name+'/'+cash_create.name+'/'+reason,
				'counterpart_account_id': account.id,
				'payment_ref' : stmt_id.name+"/"+reason,
				'amount' : float(amount),
				'is_cash_in_out_entry':True,
				'date': datetime.now().date(),
			}
			account_create = account_in_obj.create(values)
			return True
		
		else:
			print ("Ingresa a crear pos.payment",metodo_pago)
			print ("Esto es la companya del usuario",self.env.user.company_id.id)
			vals = {
			'name': 'Propinas',
			'pos_order_id': False,
			'session_id' : session_id,
			'amount' : float(amount),
			'create_date': datetime.now().date(),
			'payment_method_id': metodo_pago.id,
			'company_id':self.env.user.company_id.id,
			}
			self.env['pos.payment'].sudo().create(vals)
			return True
