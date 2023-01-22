# Copyright 2018 Tecnativa - David Vidal
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from odoo import models
from odoo.http import request


class Http(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        res = super(Http, self).session_info()
        user = request.env.user
        none_export_model_ids = self.env['model.perm'].search([('perm_export', '=', True),'|',('groups_id.users', 'in', self.env.user.id),('groups_id', '=', False)])
        none_archivable_model_ids = self.env['model.perm'].search([('perm_archive', '=', True),'|',('groups_id.users', 'in', self.env.user.id),('groups_id', '=', False)])
        none_export_models = []
        none_archivable_models = []
        for model in none_export_model_ids:
            none_export_models.append(model.model_id.model)
        for model in none_archivable_model_ids:
            none_archivable_models.append(model.model_id.model)

        res.update({
            'none_export_models':none_export_models,
            'none_archivable_models':none_archivable_models,
        })
        return res
