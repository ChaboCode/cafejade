# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime
class ResUsers(models.Model):
	_inherit = "res.users"

	genera_salvaguarda = fields.Boolean(string="Generación de salvaguardas")
	ingresa_propinas = fields.Boolean(string="Ingresa propinas")

