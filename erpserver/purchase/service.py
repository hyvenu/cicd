from django.db import transaction

import ast

from inventory.models import ProductStock, Store
from purchase.models import PurchaseRequisition, PurchaseRequisitionProductList, POOrderRequest, PoOrderDetails, \
    GRNMaster, GRNProductList
from sequences import get_next_value
from django.db.models import Q

from datetime import datetime


class PurchaseService:

    @classmethod
    def generate_pr_code(cls):
        prefix_code = 'PR/' + str(datetime.today().year) + '/'
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
            'dept__id',
            'status',
            'approved_by',
            'approved_date',
        )

        for item in list(pr_list):
            item['pr_list'] = list(PurchaseRequisitionProductList.objects. \
            filter(pr_no_rf=item['id'],).all().values(
                'id',
                'pr_no_rf',
                'description',
                'product_code',
                'product_name',
                'store',
                'store_obj',
                'required_qty',
                'finished_qty',
                'unit',
                'expected_date',
                'active',
                'product',
            ))

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
            'dept__department_name',
            'status',
            'approved_by',
            'approved_date',
            'store_id',
        )[0]

        product_list = PurchaseRequisitionProductList.objects. \
            filter(pr_no_rf=pr_obj['id'], active=True).all().values(
            'id',
            'pr_no_rf',
            'product',
            'product__product_price__unit_price',
            'product_code',
            'product_name',
            'description',
            'store',
            'required_qty',
            'finished_qty',
            'unit',
            'unit__PrimaryUnit',
            'product__product_price__tax',
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
        pr_object.store_id = pr_data['store_id']
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
            store = Store.objects.filter(store_name=product['store']).all().values(
                'id'
            )[0]
            pr_list.store_obj_id = store['id']
            pr_list.required_qty = int(product['required_qty'])
            pr_list.finished_qty = int(product['finished_qty'])
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
        try:
            prpl_object = PurchaseRequisitionProductList.objects.get(id=prpl_id)
            prpl_object.active = False
            prpl_object.save()
            return prpl_object.product_code
        except:
            print("An exception occurred")
            return True;

        # print( prpl_object)
        # if  prpl_object :
        #
        # else:

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

    @classmethod
    def generate_po_number(cls):
        perfix = 'PO/' + str(datetime.today().year) + '/'
        code = get_next_value(perfix, 1)
        code = perfix + str(code).zfill(5)
        return code

    @classmethod
    def generate_grn_code(cls):
        perfix = 'GRN/' + str(datetime.today().year) + '/'
        code = get_next_value(perfix, 1)
        code = perfix + str(code).zfill(5)
        return code

    @classmethod
    @transaction.atomic()
    def save_po(cls, po_data):
        if 'id' in po_data:
            po_order_req = POOrderRequest.objects.get(id=po_data['id'])
        else:
            po_order_req = POOrderRequest()
            po_order_req.po_number = cls.generate_po_number()

        po_order_req.po_type = po_data['po_type']
        po_order_req.shipping_address = po_data['shipping_address']
        po_order_req.transport_type = po_data['transport_type']
        po_order_req.po_date = po_data['po_date']
        po_order_req.po_raised_by = po_data['po_raised_by']
        po_order_req.pr_number = po_data['pr_number']
        po_order_req.vendor_id = po_data['vendor_id']
        po_order_req.payment_terms = po_data['payment_terms']
        po_order_req.other_reference = po_data['other_reference']
        po_order_req.terms_of_delivery = po_data['terms_of_delivery']
        po_order_req.note = po_data['note']
        po_order_req.sub_total = po_data['sub_total']
        po_order_req.packing_perct = po_data['packing_perct']
        po_order_req.packing_amount = po_data['packing_amount']
        # po_order_req.total_amount = po_data['total_amount']
        po_order_req.sgst = po_data['sgst']
        po_order_req.cgst = po_data['cgst']
        po_order_req.igst = po_data['igst']
        po_order_req.invoice_amount = po_data['invoice_amount']
        po_order_req.terms_conditions = po_data['terms_conditions']
        po_order_req.store_id = po_data['store_id']
        po_order_req.po_status = "FINISHED"
        po_order_req.save()

        product_list = ast.literal_eval(po_data['po_products'])
        for item in product_list:
            if 'id' in item and len(item['id']) > 0:
                po_product = PoOrderDetails.objects.get(id=item['id'])
            else:
                po_product = PoOrderDetails()

            po_product.po_order = po_order_req
            po_product.product_id = item['product_id']
            po_product.product_code = item['product_code']
            po_product.product_name = item['product_name']
            po_product.unit_id = item['unit_id']
            po_product.qty = item['qty']
            po_product.order_qty = item['order_qty']
            po_product.finished_qty = item['finished_qty']
            po_product.delivery_date = str(item['delivery_date'])[0:10]
            po_product.unit_price = item['unit_price']
            po_product.gst = item['gst']
            po_product.amount = item['amount']
            po_product.disc_percent = item['disc_percent']
            po_product.disc_amount = item['disc_amount']
            po_product.gst_amount = item['gst_amount']
            po_product.total_amount = item['total_amount']
            po_product.accepted_qty = item['accepted_qty']
            po_product.rejected_qty = item['rejected_qty']
            if item["status"] == "true":
                po_product.status = True
            else:
                po_product.status = False

            po_product.save()
        return po_order_req.po_number

    @classmethod
    def get_po_details(cls, po_id):
        final_list = []
        po_data_list = POOrderRequest.objects.filter(id=po_id).all().values(
            'id',
            'po_type',
            'po_number',
            'pr_number',
            'po_raised_by',
            'po_date',
            'po_status',
            'shipping_address',
            'transport_type',
            'vendor_id',

            'vendor__vendor_name',
            'vendor__vendor_code',
            'payment_terms',
            'other_reference',
            'terms_of_delivery',
            'note',
            'sub_total',
            'packing_perct',
            'packing_amount',
            'sgst',
            'cgst',
            'igst',
            'invoice_amount',
            'terms_conditions',
            'store_id',

        )[0]

        po_data_list['order_details'] = list(PoOrderDetails.objects.filter(po_order_id=po_id).all().values(
            "id",
            "product_id",
            "product_name",
            "product_code",
            "unit_id",
            "unit__PrimaryUnit",
            "qty",
            "finished_qty",
            "delivery_date",
            "unit_price",
            "gst",
            "amount",
            "disc_percent",
            "disc_amount",
            "gst_amount",
            "total_amount",
            "status",
            'order_qty',
            "accepted_qty",
            "rejected_qty",
        ))
        return po_data_list

    @classmethod
    def get_po_details_invoice(cls, po_id):
        final_list = []
        po_data_list = POOrderRequest.objects.filter(po_number=po_id).all().values(
            'id',
            'po_type',
            'po_number',
            'pr_number',
            'po_raised_by',
            'po_date',
            'shipping_address',
            'transport_type',
            'vendor_id',
            'vendor__vendor_name',
            'vendor__vendor_code',
            'payment_terms',
            'other_reference',
            'terms_of_delivery',
            'note',
            'sub_total',
            'packing_perct',
            'packing_amount',
            'sgst',
            'cgst',
            'igst',
            'invoice_amount',
            'terms_conditions',
            'store_id',
        )[0]

        po_data_list['order_details'] = list(PoOrderDetails.objects.filter(po_order__po_number=po_id).all().values(
            "id",
            "product_id",
            "product__product_name",
            "product_code",
            "unit_id",
            "unit__PrimaryUnit",
            "qty",
            "finished_qty",
            "delivery_date",
            "unit_price",
            "gst",
            "order_qty",
            "amount",
            "disc_percent",
            "disc_amount",
            "gst_amount",
            "total_amount",
        ))
        return po_data_list

    @classmethod
    def get_po_list(cls):
        po_data_list = POOrderRequest.objects.all().values(
            'id',
            'po_type',
            'po_date',
            'po_number',
            'pr_number',
            'shipping_address',
            'transport_type',
            'vendor_id',
            'vendor__vendor_code',
            'vendor__vendor_name',
            'vendor__mobile_no',
            'payment_terms',
            'other_reference',
            'terms_of_delivery',
            'note',
            'sub_total',
            'po_raised_by',
            'packing_perct',
            'packing_amount',
            'sgst',
            'cgst',
            'igst',
            'invoice_amount',
            'terms_conditions',
            'store_id',
        )
        
        po_list = list(po_data_list)
        
        # for po_item in po_list:
        #     print("po item", po_item['id'])
        #     po_items = PoOrderDetails.objects.filter(po_order_id=po_item['id']).all().values(
        #         'order_qty',
        #         'accepted_qty'
        #     )

        #     print("items list", po_items)

        #     to_satisfy = False
        #     for item in list(po_items):
        #         if (item['order_qty'] != item['accepted_qty']):
        #             to_satisfy = False
        #         else:
        #             to_satisfy = True

        #     po_item['items_to_satisfy'] = to_satisfy

        return po_list

    @classmethod
    @transaction.atomic
    def delete_po_product(cls, po_prd_id):
        try:
            po_prd_object = PoOrderDetails.objects.get(id=po_prd_id)
            po_prd_object.delete()
            return True
        except:
            print("An exception occurred")
            return True

    @transaction.atomic()
    def save_grn(cls, grn_data, file):
        if 'id' in grn_data:
            grn_req = GRNMaster.objects.get(id=grn_data['id'])
        else:
            grn_req = GRNMaster()
            grn_req.grn_code = cls.generate_grn_code()

        grn_req.po_id = grn_data['po']
        grn_req.grn_date = grn_data['grn_date']
        grn_req.po_number = grn_data['po_number']
        grn_req.batch_num = grn_data['batch_number']
        grn_req.packing_amount = grn_data['packing_amount']
        grn_req.invoice_number = grn_data['invoice_number']
        grn_req.invoice_date = grn_data['invoice_date']
        grn_req.grn_status = grn_data['grn_status']
        grn_req.vendor = grn_data['vendor']
        grn_req.vendor_code = grn_data['vendor_code']
        grn_req.vendor_name = grn_data['vendor_name']
        grn_req.vendor_address = grn_data['vendor_address']
        grn_req.vehicle_number = grn_data['vehicle_number']
        grn_req.time_in = grn_data['time_in']
        grn_req.time_out = grn_data['time_out']
        grn_req.transporter_name = grn_data['transporter_name']
        grn_req.statutory_details = grn_data['statutory_details']
        grn_req.note = grn_data['note']
        grn_req.sub_total = grn_data['sub_total']
        grn_req.grand_total = grn_data['grand_total']
        grn_req.sgst = grn_data['sgst']
        grn_req.cgst = grn_data['cgst']
        grn_req.igst = grn_data['igst']
        grn_req.rejected_total = grn_data['rejected_total']
        grn_req.store_id = grn_data['store_id']

        if len(file.getlist('invoiceDoc[]')) > 0:
            for image in file.getlist('invoiceDoc[]'):
                grn_req.invoice_doc = image

        grn_req.save()

        product_list = ast.literal_eval(grn_data['product_list'])
        for item in product_list:
            if 'id' in item:
                grn_product = GRNProductList.objects.get(id=item['id'])
            else:
                grn_product = GRNProductList()
            grn_product.grn = grn_req
            grn_product.product_id = item['product_id']
            grn_product.product_code = item['product_code']
            grn_product.product_name = item['product_name']
            grn_product.description = item['description']
            grn_product.hsn_code = item['hsn_code']
            grn_product.amount = item['amount']
            grn_product.po_qty = item['po_qty']
            grn_product.received_qty = item['received_qty']
            grn_product.rejected_qty = item['rejected_qty']
            grn_product.accepted_qty = item['accepted_qty']
            grn_product.unit_id_id = item['unit_id']
            grn_product.unit_price = item['unit_price']
            grn_product.gst = item['gst']
            grn_product.gst_amount = item['gst_amount']
            grn_product.total = item['total']
            #grn_product.batch_code = item['batch_code']
            grn_product.expiry_date = item['expiry_date']
            grn_product.save()

            if grn_product.accepted_qty > 0:
                ps = ProductStock()
                ps.grn_number = grn_req.grn_code
                ps.product_id = item['product_id']
                ps.store_id = grn_data['store_id']
                ps.unit_id = item['unit_id']
                #ps.batch_number = item['batch_code']
                ps.batch_number = grn_req.batch_num
                ps.batch_expiry = grn_product.expiry_date
                ps.quantity = item['accepted_qty']
                ps.save()
        return grn_req.grn_code

    @classmethod
    def get_grn_details(cls, grn_id):
        final_list = []
        grn_data_list = GRNMaster.objects.filter(id=grn_id).all().values(
            'id',
            'po',
            'grn_code',
            'grn_date',
            'grn_status',
            'po_number',
            'batch_num',
            'invoice_number',
            'invoice_date',
            'vendor',
            'vendor_code',
            'vendor_name',
            'vendor_address',
            'vehicle_number',
            'time_in',
            'time_out',
            'transporter_name',
            'statutory_details',
            'note',
            'sub_total',
            'grand_total',
            'sgst',
            'cgst',
            'igst',
            'store_id',
            'invoice_doc',
            'packing_amount'

        )[0]

        grn_data_list['product_list'] = list(GRNProductList.objects.filter(grn=grn_id).all().values(
            'id',
            'grn',
            'product',
            'product_code',
            'product_name',
            'description',
            'hsn_code',
            'amount',
            'po_qty',
            'received_qty',
            'rejected_qty',
            'accepted_qty',
            'unit_id',
            'unit_price',
            'gst',
            'amount',
            'gst_amount',
            'total',
            #'batch_code',
            'expiry_date',

        ))
        return grn_data_list

    @classmethod
    def get_grn_list(cls):
        grn_list = GRNMaster.objects.all().values(
            'id',
            'grn_code',
            'grn_date',
            'grn_status',
            'po_number',
            'invoice_number',
            'invoice_date',
            'vendor',
            'vendor_code',
            'vendor_name',
            'vendor_address',
            'vehicle_number',
            'time_in',
            'time_out',
            'transporter_name',
            'statutory_details',
            'note',
            'sub_total',
            'grand_total',
            'invoice_doc',
        )
        return list(grn_list)