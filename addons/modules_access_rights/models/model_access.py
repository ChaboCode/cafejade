# -*- coding: utf-8 -*-
from odoo import models, fields, api, exceptions, _
from datetime import date, datetime, time, timedelta
from odoo.fields import Date, Datetime
from odoo.tools import float_compare
import odoo.addons.decimal_precision as dp
class ModelAccess(models.Model):
    _name = 'model.perm'
    _rec_name = 'model_id'
    model_id = fields.Many2one('ir.model','Model',ondelete='cascade')
    model = fields.Char(string="Model", related="model_id.model", store=True)

    groups_id = fields.Many2many("res.groups",'rel_access_groups','gid','aid')
    perm_edit = fields.Boolean(string='Edit')
    perm_create = fields.Boolean(string='Create Or Duplicate')
    perm_delete = fields.Boolean(string='Delete')
    perm_export = fields.Boolean(string='Export')
    perm_archive = fields.Boolean(string='Archive/UnArchive')
    model_has_active_field = fields.Boolean()

    @api.onchange('model_id')
    def onchange_model_id(self):
        self.model_has_active_field =  self.model_id.field_id.filtered(lambda x:x.name=='active')

    def check_access(self, model):
        if model:
            res = self.search([('perm_export', '=', True),('model_id.model', '=', model),('groups_id.users', 'in', self.env.user.id)], limit=1)
            if res:
                return True
            return False
        else:
            return False
