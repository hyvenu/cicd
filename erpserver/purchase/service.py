from django.db import transaction

import ast
from purchase.models import PurchaseRequisition, PurchaseRequisitionProductList
from sequences import get_next_value
from datetime import datetime


class PurchaseService:

    @classmethod
    def generate_pr_code(cls):
        prefix_code = 'PR'
        code = get_next_value(prefix_code)
        code = prefix_code + '-' + str(code)
        return code

    @classmethod
    def get_pr_list(cls):
        pr_list = PurchaseRequisition.objects.all().values(
            'id',
            'pr_no',
            'pr_date',
            'created_user',
            'dept__department_name',
        )
        return list(pr_list)

    @classmethod
    def get_pr_details(cls, pr_id):
        pr_obj = PurchaseRequisition.objects.filter(id=pr_id) \
            .all().values(
            'id',
            'pr_no',
            'pr_date',
            'created_user',
            'dept__department_name',
        )[0]

        product_list = PurchaseRequisitionProductList.objects. \
            filter(pr_no_rf=pr_obj['id']).all().values(
                'pr_no_rf',
                'product',
                'product_code',
                'product_name',
                'description',
                'store',
                'required_qty',
                'unit',
                'expected_date',
        )

        pr_obj['selected_product_list'] = list(product_list)

        return pr_obj

    @classmethod
    @transaction.atomic
    def save_pr(cls, pr_data):
        pr_object = PurchaseRequisition()
        pr_code = cls.generate_pr_code()
        pr_object.pr_no = pr_code
        # date_time_obj = datetime.strptime(pr_data['pr_date'], '%yyyy-%mm-%d').strftime()

        pr_object.pr_date = pr_data['pr_date']
        pr_object.created_user = pr_data['created_user']
        pr_object.dept_id = pr_data['dept']
        pr_object.status = 'WAITING_FOR_APPROVAL'
        pr_object.save()

        product_list = ast.literal_eval(pr_data['product_list'])

        for product in product_list:
            pr_list = PurchaseRequisitionProductList()
            pr_list.pr_no_rf = pr_object
            pr_list.product_id = product['id']
            pr_list.product_code = product['product_code']
            pr_list.product_name = product['product_name']
            pr_list.description = product['description']
            pr_list.store = product['store_name']
            pr_list.required_qty = product['required_qty']
            pr_list.unit_id = product['unit']
            pr_list.expected_date = product['expected_date']
            pr_list.save()

        return pr_code

    @classmethod
    @transaction.atomic
    def approve_pr(cls, pr_id, pr_approved_by, pr_approved_date):
        # pr_object = PurchaseRequisition()
        pr_object = PurchaseRequisition.objects.get(id=pr_id)
        pr_object.approved_by = pr_approved_by
        pr_object.approved_date = pr_approved_date
        pr_object.status = "APPROVED"
        pr_object.save()

        return pr_object
