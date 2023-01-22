# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
from odoo import api, fields, models, _
from odoo.exceptions import ValidationError

# For project stage customization


class ProjectStage(models.Model):
    _inherit = 'project.task.type'

    stage_progress = fields.Float('Progress(%)')
    exclude = fields.Boolean(
        'Exclude From Progress Calculation', default=False)

    @api.constrains('stage_progress')
    def _check_task_progress(self):
        if self.stage_progress > 100:
            raise ValidationError(_('Progress must be 100% OR under 100%.'))

# For project progress


class ProjectsProgress(models.Model):
    _inherit = 'project.project'

    progress = fields.Float('Progress(%)', compute='_compute_progressbar')
    total = fields.Integer(compute="_compute_progressbar")

    @api.depends('tasks')
    def _compute_progressbar(self):
        for rec in self:
            sums = 0.0
            rec.total = 100
            total_task = 0
            rec.progress = 0
            for task in rec.tasks:
                if not task.stage_id.exclude:
                    sums += task.stage_id.stage_progress
                    total_task += 1
                    rec.progress = sums / total_task

#For Task Progress


class TaskProgress(models.Model):
    _inherit = 'project.task'

    task_progress = fields.Float(
        'Progress(%)', compute="_compute_task_progressbar")
    task_total = fields.Integer(
        'Task total', compute="_compute_task_progressbar")

    @api.depends('stage_id')
    def _compute_task_progressbar(self):
        for task in self:
            task.task_total = 100
            task.task_progress = task.stage_id.stage_progress
