# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
#################################################################################
# Author      : Luigi Tolayo Ogum (<https://www.ogum.com.mx/>)
# Copyright(c): 2021-Present Ogum
# All Rights Reserved.
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
#################################################################################
{
    # Application Information
    'name': 'Pos ',
    'version': '14.0.0',
    'category': 'Technical',
    'license': 'LGPL-3',
    
    'summary': """
        This app allow you to create Product Brands and set to all product.
    """,
    'description': """ 
        This app allow you to create Product Brands and set to all product.
    """,
    
    # Author Information
    'author': 'Luigi Tolayo',
    
    # Application Price Information
    'price': 0,
    'currency': 'EUR',

    # Dependencies
    'depends': ['base', 'point_of_sale','aspl_pos_kitchen_combo','pos_restaurant'],
    
    # Views
    'data': [
        "security/ir.model.access.csv",
        "views/pos_config_views.xml",
        'views/pos_entrada_salida_views.xml',
        'views/res_users_views.xml',
        'views/pos_order_views.xml'
    ],
    
    'assets': {
        'point_of_sale.assets': 
        [   
            'pos_saveguard_tips/static/src/css/pos.css',
            'pos_saveguard_tips/static/src/js/models.js',
            'pos_saveguard_tips/static/src/js/ChromeWidgets/MenuButton.js',
            'pos_saveguard_tips/static/src/js/ChromeWidgets/SaveguardButton.js',
            'pos_saveguard_tips/static/src/js/ChromeWidgets/SaveTipsButton.js',
            'pos_saveguard_tips/static/src/js/ChromeWidgets/SelectWaiter.js',
            'pos_saveguard_tips/static/src/js/ChromeWidgets/ReasingWaiter.js',
            'pos_saveguard_tips/static/src/js/Popups/SaveguardPopup.js',
            'pos_saveguard_tips/static/src/js/Popups/SaveguardAlertPopup.js',
            'pos_saveguard_tips/static/src/js/Popups/SaveTipsPopup.js',
            'pos_saveguard_tips/static/src/js/Popups/SelectWaiterPopup.js',
            'pos_saveguard_tips/static/src/js/Popups/ReasingWaiterPopup.js',
            'pos_saveguard_tips/static/src/js/TicketReport/TicketReport.js',
            'pos_saveguard_tips/static/src/js/TicketReport/ReportScreen.js',
            'pos_saveguard_tips/static/src/js/TicketReport/ReceiptInScreen.js',
            'pos_saveguard_tips/static/src/js/TicketReport/ReceiptOutScreen.js',
            'pos_saveguard_tips/static/src/js/TicketReport/ReceiptSummary.js',
            'pos_saveguard_tips/static/src/js/TicketReport/ReceiptSaveguard.js',
            'pos_saveguard_tips/static/src/js/TicketReport/ReceiptTips.js',
            'pos_saveguard_tips/static/src/js/Popups/PrintTicketPopup.js',
            'pos_saveguard_tips/static/src/js/Screens/ProductScreen.js',
            'pos_saveguard_tips/static/src/js/Screens/PaymentScreen.js',
        ],

        'web.assets_qweb': [
            'pos_saveguard_tips/static/src/xml/**/*',
        ],

         },


    # Application Main Image    
    #'images': ['static/description/app_profile_image.png'],

    # Technical
    'installable': True,
    'application' : True,
    'auto_install': False,
    'active': False,
}
