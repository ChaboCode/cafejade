# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime
class PosSession(models.Model):
	_inherit = "pos.session"
    

	def get_method_tips(self):
		return {'methods_tips': [{'name': pm.name,'id': pm.id} for pm in self.config_id.payment_method_id]}

	def get_data_waiters(self):
		meseros = self.env['res.users'].search([('company_ids','in',self.env.user.company_id.id),('kitchen_screen_user','=','waiter')])
		return {'data_waiters': [{'name': pm.name,'id': pm.id} for pm in meseros]}


	def get_closing_control_data(self):
		self.ensure_one()
		orders = self.order_ids.filtered(lambda o: o.state == 'paid' or o.state == 'invoiced')
		payments = orders.payment_ids.filtered(lambda p: p.payment_method_id.type != "pay_later")
		pay_later_payments = orders.payment_ids - payments
		cash_payment_method_ids = self.payment_method_ids.filtered(lambda pm: pm.type == 'cash')
		default_cash_payment_method_id = cash_payment_method_ids[0] if cash_payment_method_ids else None
		total_default_cash_payment_amount = sum(payments.filtered(lambda p: p.payment_method_id == default_cash_payment_method_id).mapped('amount')) if default_cash_payment_method_id else 0
		other_payment_method_ids = self.payment_method_ids - default_cash_payment_method_id if default_cash_payment_method_id else self.payment_method_ids
		cash_in_count = 0
		cash_out_count = 0
		cash_in_out_list = []
		other_payment_methods = []
		total_tips_efect = 0
		entradas_salidas = self.env['pos.entrada.salida'].search([('session_id','=',self.id),('cash_type','=','credit'),('reason','=','Propinas')])
		print ("Esto son registros de propinas",entradas_salidas)
		for entrada_salida in entradas_salidas:
			if entrada_salida.amount > 0:
				total_tips_efect = total_tips_efect + entrada_salida.amount


		for pm in other_payment_method_ids:
			monto_propinas = 0
			print ("Esto es self.id",self.id)
			print ("Esto es payment_method_id",pm)
			print ("Esto es self.env.user.company_id.id",self.env.user.company_id.id)

			payments_tips = self.env['pos.payment'].search([('session_id','=',self.id),('payment_method_id','=',pm.id),('pos_order_id','=',False),('company_id','=',self.env.user.company_id.id)])
			print ("Esto es payments_tips",payments_tips)
			if payments_tips:
				for payment_tip in payments_tips:
					monto_propinas = monto_propinas + payment_tip.amount
			vals={
    			'name': pm.name,
    			'amount': sum(orders.payment_ids.filtered(lambda p: p.payment_method_id == pm).mapped('amount')) + monto_propinas,
    			'number': len(orders.payment_ids.filtered(lambda p: p.payment_method_id == pm)),
    			'id': pm.id,
    			'type': pm.type,
    			}
			other_payment_methods.append(vals)


		print ("other_payment_methods",other_payment_methods)
		print ("other_payment_methods abajo",[{
                'name': pm.name,
                'amount': sum(orders.payment_ids.filtered(lambda p: p.payment_method_id == pm).mapped('amount')),
                'number': len(orders.payment_ids.filtered(lambda p: p.payment_method_id == pm)),
                'id': pm.id,
                'type': pm.type,
            } for pm in other_payment_method_ids])
  
		contador = 1
		if self.cash_register_id.line_ids:
			for cash_move in self.cash_register_id.line_ids.sorted('payment_ref'):
				print ("cash_move",cash_move)
				if contador == 1:
					if cash_move.amount > 0:
						cash_in_count += 1
						name = f'Cash in {cash_in_count}'
					else:
						cash_out_count += 1
						name = f'Cash out {cash_out_count}'
					nombre = cash_move.payment_ref
					monto = cash_move.amount
		
				else:
					if nombre == cash_move.payment_ref:
						monto = monto + cash_move.amount
					else:
						if "Propinas" in nombre:
							nombre = "Pago de propinas en efectivo"
						elif "Salvaguarda" in cash_move.payment_ref:
							nombre = "Retiro de Salvaguarda"
						else:
							nombre = cash_move.payment_ref
						cash_in_out_list.append({
							'name': nombre if nombre else name,
							'amount': monto
						})
						if cash_move.amount > 0:
							cash_in_count += 1
							name = f'Cash in {cash_in_count}'
						else:
							cash_out_count += 1
							name = f'Cash out {cash_out_count}'
						nombre = cash_move.payment_ref
						monto = cash_move.amount
				contador = contador + 1
			if "Propinas" in nombre:
				nombre = "Pago de propinas en efectivo"
			elif "Salvaguarda" in cash_move.payment_ref:
				nombre = "Retiro de Salvaguarda"
			else:
				nombre = cash_move.payment_ref
			cash_in_out_list.append({
				'name': nombre if nombre else name,
				'amount': monto
				})

		return {
		'orders_details': {
		'quantity': len(orders),
		'amount': sum(orders.mapped('amount_total'))
		},
		'payments_amount': sum(payments.mapped('amount')),
		'pay_later_amount': sum(pay_later_payments.mapped('amount')),
		'opening_notes': self.opening_notes,
		'default_cash_details': {
		'name': default_cash_payment_method_id.name,
		'amount': self.cash_register_id.balance_start + total_default_cash_payment_amount + sum(self.cash_register_id.line_ids.mapped('amount')),
		'opening': self.cash_register_id.balance_start,
		'payment_amount': total_default_cash_payment_amount,
		'tips_amount':total_tips_efect,
		'moves': cash_in_out_list,
		'id': default_cash_payment_method_id.id} if default_cash_payment_method_id else None,
		'other_payment_methods': other_payment_methods,
		'is_manager': self.user_has_groups("point_of_sale.group_pos_manager"),
		'amount_authorized_diff': self.config_id.amount_authorized_diff if self.config_id.set_maximum_difference else None
		}