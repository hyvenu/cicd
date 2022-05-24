from django.db import transaction

import ast

from django.db.models.functions import Cast

from engine.app_setting_service import AppSettingService
from inventory.models import ProductStock, Store, ProductPriceMaster
from purchase.models import PurchaseRequisition, PurchaseRequisitionProductList, POOrderRequest, PoOrderDetails, \
    GRNMaster, GRNProductList, VendorPaymentMaster, VendorPaymentList
from sequences import get_next_value
from django.db.models import Q, Sum, F, DecimalField

from datetime import datetime

from sales.models import SalesOrderDetails


class PurchaseService:

    @classmethod
    def generate_pr_code(cls):
        prefix_code = 'PR/' + str(datetime.today().year) + '/'
        code = get_next_value(prefix_code)
        code = prefix_code + str(code).zfill(5)
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
            'product__product_price__purchase_price',
            'product_code',
            'product_name',
            'description',
            'store',
            'box_qty',
            'required_qty',
            'finished_qty',
            'unit',
            'unit__PrimaryUnit',
            'product__product_price__tax',
            'product__product_price__cess_percent',
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
            pr_list.box_qty = int(product['box_qty'])
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
            if item['delivery_date'] is not None and item['delivery_date'] != "":
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
            "product__hsn_code",
            "product__description",
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
            "order_qty",
            "finished_qty",
            "delivery_date",
            "unit_price",
            "gst",
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
            'vendor__branch_ofc_addr',
            'vendor__state_code',
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
        return list(po_data_list)

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

            #     if item['expiry_date'] == '':
            #         exp_date = None
            #     else:
            # exp_date = item['expiry_date']

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
            grn_product.batch_code = grn_data['batch_number']
            grn_product.sl_no = item['sl_no']

            if item['expiry_date'] != "":
                grn_product.expiry_date = item['expiry_date']

            grn_product.save()

            if grn_product.accepted_qty > 0:
                ps = ProductStock.objects.filter(grn_number=grn_req.grn_code, product_id=item['product_id']).all()
                if not ps.exists():
                    ps = ProductStock()
                else:
                    ps = ProductStock.objects.get(grn_number=grn_req.grn_code, product_id=item['product_id'])
                ps.grn_number = grn_req.grn_code
                ps.product_id = item['product_id']
                ps.store_id = grn_data['store_id']
                ps.unit_id = item['unit_id']
                # ps.batch_number = item['batch_code']
                ps.batch_number = grn_req.batch_num
                ps.batch_expiry = grn_product.expiry_date
                ps.quantity = item['accepted_qty']
                ps.save()

                app_setting = AppSettingService().get_app_setting_value('UPDATE_PURCHASE_PRICE')
                if app_setting is not None and app_setting == "1":
                    """
                    OB QTY UPDATE 
                    """
                    # price_obj = ProductPriceMaster.objects.get(product_id=item['product_id'])
                    # price_obj.ob_qty = float(price_obj.ob_qty) + float(item['accepted_qty'])
                    # price_obj.save()
                    """
                    WEIGHTED AVERAGE and OB QTY Update
                    weighted_avg = available_stock_value+new_grn_value/avilable_qty + grn_qty
                    """
                    purchase_stock = GRNProductList.objects.filter(product_id=item['product_id']).aggregate(
                        purchase_qty=Sum('accepted_qty'))
                    sold_stock = SalesOrderDetails.objects.filter(product_id=item['product_id']).aggregate(
                        sold_qty=Sum('qty'))
                    purchase_stock_value = GRNProductList.objects.filter(product_id=item['product_id']) \
                        .annotate(accepted_qty_decimal=Cast('accepted_qty', DecimalField(max_digits=10, decimal_places=2))) \
                        .aggregate(
                        purchase_price=Sum(F('unit_price') * F('accepted_qty_decimal')) / Sum(F('accepted_qty_decimal')))

                    product_price = ProductPriceMaster.objects.get(product_id=item['product_id'])
                    product_price.purchase_price = float(purchase_stock_value['purchase_price'])
                    if purchase_stock['purchase_qty'] is None:
                        purchase_stock['purchase_qty'] =0
                    if sold_stock['sold_qty'] is None:
                        sold_stock['sold_qty'] = 0
                    product_price.ob_qty = int(purchase_stock['purchase_qty']) - int(sold_stock['sold_qty'])  ## int(product_price.ob_qty) + int(item['accepted_qty'])
                    product_price.save()
                if app_setting is not None and app_setting == "2":
                    product_price = ProductPriceMaster.objects.get(product_id=item['product_id'])
                    product_price.purchase_price = float(item['unit_price'])
                    product_price.save()

        return grn_req.grn_code

    @classmethod
    @transaction.atomic
    def delete_grn_product(cls, prd_id):
        try:
            grn_prd_object = GRNProductList.objects.get(id=prd_id)
            grn_prd_object.delete()
            return "DELETED"
        except:
            print("An exception occurred")
            return "NOT DELETED"

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
            'product_id',
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
            'batch_code',
            'expiry_date',
            'sl_no',

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

    @classmethod
    def generate_vendor_payment_code(cls):
        perfix = 'VENP/' + str(datetime.today().year) + '/'
        code = get_next_value(perfix, 1)
        code = perfix + str(code).zfill(5)
        return code

    def save_vendor_payment(cls, v_data):
        
        v_list = ast.literal_eval(v_data['v_list'])

        #v_code = cls.generate_vendor_payment_code()

        if 'v_id' in v_data:
            vendor_payment = VendorPaymentMaster.objects.get(vendor_payment_code=v_data['v_id'])
            v_code = v_data['v_id']

            #delete childs first
            vendor_payment_list = VendorPaymentList.objects.filter(vendor_payment_code=v_data['v_id']).delete()

            for item in v_list:  
                vendor_payment_list = VendorPaymentList()  
                vendor_payment_list.vendor_payment = vendor_payment  
                vendor_payment_list.vendor_payment_code = v_code        
                vendor_payment_list.po_number = item['po_number']
                vendor_payment_list.po_date = item['po_date']
                vendor_payment_list.grn_code = item['grn_code']
                vendor_payment_list.grn_date = item['grn_date']
                vendor_payment_list.invoice_number = item['invoice_number']
                vendor_payment_list.invoice_date = item['invoice_date']
                vendor_payment_list.invoice_amount = item['invoice_amount']
                vendor_payment_list.payment_amount = item['payment_amount']
                vendor_payment_list.remaining_amount = item['remaining_amount']
                vendor_payment_list.payment_method = item['payment_method']
                vendor_payment_list.payment_details = item['payment_details']
                vendor_payment_list.save()
            
        else:
            vendor_payment = VendorPaymentMaster()
            v_code = cls.generate_vendor_payment_code()
        
            vendor_payment.vendor_payment_code = v_code
            vendor_payment.vendor_code = v_data['vendor_code']
            vendor_payment.vendor_name = v_data['vendor_name']
            vendor_payment.save()

            for item in v_list:  
                vendor_payment_list = VendorPaymentList()  
                vendor_payment_list.vendor_payment = vendor_payment
                vendor_payment_list.vendor_payment_code = v_code        
                vendor_payment_list.po_number = item['po_number']
                vendor_payment_list.po_date = item['po_date']
                vendor_payment_list.grn_code = item['grn_code']
                vendor_payment_list.grn_date = item['grn_date']
                vendor_payment_list.invoice_number = item['invoice_number']
                vendor_payment_list.invoice_date = item['invoice_date']
                vendor_payment_list.invoice_amount = item['invoice_amount']
                vendor_payment_list.payment_amount = item['payment_amount']
                vendor_payment_list.remaining_amount = item['remaining_amount']
                vendor_payment_list.payment_method = item['payment_method']
                vendor_payment_list.payment_details = item['payment_details']
                vendor_payment_list.save()

        return v_code

    @classmethod
    def get_vendor_payment_list(cls):
        v_list = VendorPaymentMaster.objects.all().values(
            'id',
            'vendor_payment_code',
            'vendor_code',
            'vendor_name'
        )
        return list(v_list)

    @classmethod
    def get_vendor_payment_list_by_id(cls, v_p_code):
        vendor_payment_data = VendorPaymentMaster.objects.filter(vendor_payment_code = v_p_code).all().values(
            'id',
            'vendor_payment_code',
            'vendor_code',
            'vendor_name'
        )[0]

        vendor_payment_data['v_list'] = list(VendorPaymentList.objects.filter(vendor_payment_code = v_p_code).all().values(
            'id',
            'vendor_payment_code',
            'po_number',
            'po_date',
            'grn_code',
            'grn_date',
            'invoice_number',
            'invoice_date',
            'invoice_amount',
            'payment_amount',
            'remaining_amount',
            'payment_method',
            'payment_details'

        ))

        return vendor_payment_data  

    @classmethod
    def get_vendor_po_list(cls, vendor_id):
        po_data_list = POOrderRequest.objects.filter(vendor_id=vendor_id).all().values(
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

        )

        return list(po_data_list)

    @classmethod
    def get_vendor_grn_list(cls, po_id):
        grn_list = GRNMaster.objects.filter(po_id=po_id).all().values(
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

    @classmethod
    def get_vendor_grn_amount(cls, v_id):
        grn_list = VendorPaymentList.objects.filter(vendor_payment__vendor_code = v_id).all().values(
            'id',
            'grn_code',
            'invoice_amount',
            'payment_amount',
            'remaining_amount',

        )
        return list(grn_list)