#-*- coding: utf-8 -*-

from odoo import models, fields, api,_
from odoo.exceptions import UserError

class Mian_list_wait(models.Model):

	_name="list.wait"

	_rec_name='cliente_id'


	cliente_id = fields.Char(	   
	    string='Clientes',
	)

	telefono = fields.Char(
	    string='Teléfono',
	)

	no_clientes = fields.Integer(
	    string='No. personas',
	)

	tiempo_espera = fields.Float(
	    string='Tiempo espera',
	)

	piso_id = fields.Many2one(
	    'restaurant.floor',
	    string='Piso',
	)

	mesa_sugerida_id = fields.Text(
	    string='Mesa sugerida',
	)

	mesa_asignada_ids = fields.Char(
	    string='Mesa Asignada',
	)

	status = fields.Selection([('Espera', 'Espera'),
		('Asignado', 'Asignado'),('Cancelado', 'Cancelado')]
		,string='Estado')

	#@api.model
	def get_tables_free(self,client):
		list_table=self.env['restaurant.table'].search([('seats','>=',client)])
		list_table_use=self.env['pos.order'].search([]).table_id
		list_no_user=""		
		for table in list_table:
			if not table in list_table_use:
				list_no_user+=table.floor_id.name+"/"+table.name+" => "+str(table.seats)+"(C) \n"

		return  list_no_user
		

	@api.model
	def create_from_ui(self,data):

		self.env['list.wait'].create({
			'cliente_id':data['cliente'],
			'telefono':data['telefono'],
			'no_clientes':data['no_clientes'],
			'tiempo_espera':float(data['tiempo_espera']),
			'piso_id':1,
			'mesa_sugerida_id':self.get_tables_free(data['no_clientes']),
			})








