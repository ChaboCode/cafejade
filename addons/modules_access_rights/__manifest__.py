{
    'name': 'Hide buttons from views',
    'summary': """ 
    Hide edit/create/delete/export/archive buttons From Views in any selected module :\n
    Hide edit button with group security\n
    Hide create button with group security\n
    Hide import button with group security\n
    Hide delete button with group security\n
    Hide export button with group security \n
    Hide archive button with group security \n
   Hide buttons From View :\n
    \nIn this app:
    \n1- Make edit button on form/tree/kanban views hidden with group security for specific users [with group security].\n
    \n2- Make create button on form/tree/kanban views hidden with group security for specific users [with group security].\n
    \n3- Make import button on form/tree/kanban views hidden with group security for specific users [with group security].\n
    \n4- Make export button on form/tree/kanban views hidden with group security for specific users [with group security].\n
    \n5- Make archive button on form/tree/kanban views hidden with group security for specific users [with group security].\n
    \n5- Make delete button on form/tree/kanban views hidden with group security for specific users [with group security].\n
         """,
    'description': """ 
    Hide edit/create/delete/export/archive/import buttons From Views in any selected module 
      """,
    'author': 'DevSoft',
    'depends': ['base', 'web'],
    'images': ['static/description/banner.jpg'],
    'version': '15.0',
    'price': 15,
    'currency': 'EUR',
    'data': [
        'security/security_group.xml',
        'security/ir.model.access.csv',
        'views/model_access.xml',

    ],
'assets': {
        'web.assets_backend': [
            'modules_access_rights/static/src/js/**/*',
        ],

    },
}
