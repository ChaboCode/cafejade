# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime
class PosSession(models.Model):
    _inherit = "pos.session"
    

    def get_method_tips(self):    
        return {'methods_tips': [{'name': pm.name,'id': pm.id} for pm in self.config_id.payment_method_id]}


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

    	for cash_move in self.cash_register_id.line_ids.sorted('create_date'):
    		if cash_move.amount > 0:
    			cash_in_count += 1
    			name = f'Cash in {cash_in_count}'
    		else:
    			cash_out_count += 1
    			name = f'Cash out {cash_out_count}'
    		cash_in_out_list.append({
    			'name': cash_move.payment_ref if cash_move.payment_ref else name,
    			'amount': cash_move.amount
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
		'moves': cash_in_out_list,
		'id': default_cash_payment_method_id.id} if default_cash_payment_method_id else None,
		'other_payment_methods': other_payment_methods,
		'is_manager': self.user_has_groups("point_of_sale.group_pos_manager"),
		'amount_authorized_diff': self.config_id.amount_authorized_diff if self.config_id.set_maximum_difference else None
		}