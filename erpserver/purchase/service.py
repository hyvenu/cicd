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
            'dept__id',
            'status',
            'approved_by',
            'approved_date',
        )[0]

        product_list = PurchaseRequisitionProductList.objects. \
            filter(pr_no_rf=pr_obj['id'], active=True).all().values(
            'id',
            'pr_no_rf',
            'product',
            'product_code',
            'product_name',
            'description',
            'store',
            'required_qty',
            'unit',
            'expected_date',
            'active',
        )

        pr_obj['selected_product_list'] = list(product_list)

        return pr_obj

    @classmethod
    @transaction.atomic
    def save_pr(cls, pr_data):
        if 'id' in pr_data:
            pr_object = PurchaseRequisition.objects.get(id=pr_data['id'])
        else:
            pr_object = PurchaseRequisition()
            pr_code = cls.generate_pr_code()
            pr_object.pr_no = pr_code

        pr_object.status = 'WAITING_FOR_APPROVAL'

        cls.save_pr_details(pr_data, pr_object)
        pr_code = pr_object.pr_no

        return pr_code

    @classmethod
    def save_pr_details(cls, pr_data, pr_object):
        pr_object.pr_date = pr_data['pr_date']
        pr_object.created_user = pr_data['created_user']
        pr_object.dept_id = pr_data['dept']

        pr_object.save()
        product_list = ast.literal_eval(pr_data['product_list'])
        for product in product_list:
            if 'pr_no_rf' in product:
                pr_list = PurchaseRequisitionProductList.objects.get(id=product['id'])
                pr_list.product_id = product['product']
            else:
                pr_list = PurchaseRequisitionProductList()
                pr_list.product_id = product['id']
            pr_list.pr_no_rf = pr_object

            pr_list.product_code = product['product_code']
            pr_list.product_name = product['product_name']
            pr_list.description = product['description']
            pr_list.store = product['store']
            pr_list.required_qty = int(product['required_qty'])
            pr_list.unit_id = product['unit']
            pr_list.expected_date = product['expected_date']
            pr_list.save()

    @classmethod
    @transaction.atomic
    def approve_pr(cls, pr_data):
        # pr_object = PurchaseRequisition()
        pr_object = PurchaseRequisition.objects.get(id=pr_data['id'])
        pr_object.approved_by = pr_data['approved_by']
        pr_object.approved_date = pr_data['approved_date']
        pr_object.status = "APPROVED"

        cls.update_pr_details(pr_data, pr_object)

        return pr_object.pr_no

    @classmethod
    @transaction.atomic
    def delete_product(cls, prpl_id):
        prpl_object = PurchaseRequisitionProductList.objects.get(id=prpl_id)
        prpl_object.active = False
        prpl_object.save()
        return prpl_object.product_code

    @classmethod
    @transaction.atomic
    def reject_pr(cls, pr_data):
        pr_object = PurchaseRequisition.objects.get(id=pr_data['id'])
        pr_object.approved_by = pr_data['approved_by']
        pr_object.approved_date = pr_data['approved_date']
        pr_object.status = "REJECTED"

        cls.update_pr_details(pr_data, pr_object)

        return pr_object.pr_no

    @classmethod
    def update_pr_details(cls, pr_data, pr_object):
        pr_object.pr_date = pr_data['pr_date']
        pr_object.created_user = pr_data['created_user']
        pr_object.dept_id = pr_data['dept']

        pr_object.save()
        product_list = ast.literal_eval(pr_data['product_list'])
        for product in product_list:
            pr_list = PurchaseRequisitionProductList.objects.get(id=product['id'])
            pr_list.pr_no_rf = pr_object

            pr_list.product_code = product['product_code']
            pr_list.product_name = product['product_name']
            pr_list.description = product['description']
            pr_list.store = product['store']
            pr_list.required_qty = int(product['required_qty'])
            pr_list.unit_id = product['unit']
            pr_list.expected_date = product['expected_date']
            pr_list.save()
