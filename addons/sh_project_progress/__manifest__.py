# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Project Progress Status",

    "author": "Softhealer Technologies",

    "website": "https://www.softhealer.com",

    "support": "support@softhealer.com",
    
    "license": "OPL-1",

    "version": "15.0.1",

    "category": "Project",

    "summary": "Project Status Report Module, See Project Task Progress App, Project With Progressbar, Project Stages With Percentage Progressbar, Project Management With Stages, Project Manage With Task, Project Analysis,Project Timeline Management Odoo",

    "description": """"Project Progress Status" module measures the project progress with project stages. Currently, in odoo, you can't measure the project progress from stages of different tasks progress. The progress of a project will help to make more timeline of your project. You can see the progress bar in the tree view, the form view & the kanban view. You can also see the progress bar of individual tasks also. Project Progress Status odoo, Project Status Report Module, See Project Task Progress, Project With Progressbar, Project Stages With Percentage Progressbar, Project Management With Stages, Project Manage With Task, Project Analysis,Project Timeline Management Odoo, Project Status Report Module, See Project Task Progress App, Project With Progressbar, Project Stages With Percentage Progressbar, Project Management With Stages, Project Manage With Task, Project Analysis,Project Timeline Management Odoo""",

    "depends": [
            'project'
    ],

    "data": [
        'security/project_progress_security.xml',
        'views/project_progress.xml',

    ],

    "installable": True,
    "auto_install": False,
    "application": True,
    "images": ["static/description/background.png", ],
    "price": "18",
    "currency": "EUR"
}
