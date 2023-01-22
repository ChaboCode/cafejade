# -*- coding: utf-8 -*-


from odoo import fields, models, api, _
from datetime import date, time, datetime

class PosBoxOut(models.TransientModel):
	_inherit = 'cash.box.out'

	def create_cash_out(self, user, reason, amount, session_id):

		cash_out_obj = self.env['pos.entrada.salida'].sudo()
		account_in_obj = self.env['account.bank.statement.line'].sudo()

		vals = {
			'cash_type': 'debit',
			'user_id': user,
			'session_id' : session_id,
			'amount' : float(amount),
			'create_date': datetime.now().date(),
			'reason': reason,
		}
		cash_create = cash_out_obj.create(vals)

		stmt_id = self.env['pos.session'].browse(session_id).cash_register_id
		
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
			'payment_ref' : stmt_id.name+'/'+reason,
			'amount' : -float(amount),
			'counterpart_account_id': account.id,
			'is_cash_in_out_entry':True,
			'date': datetime.now().date(),
		}
		account_create = account_in_obj.create(values)
		return True

class ABSLInherit(models.Model):
	_inherit = 'account.bank.statement.line'

	is_cash_in_out_entry = fields.Boolean('Is Cash In Out Entry')

