from django.db import transaction

from vendor.models import VendorMaster
from sequences import get_next_value

class VendorService:

    @classmethod
    def generate_vendor_code(cls, vendor_type):
        if vendor_type == "FARMER":
            v_type = 'F'
        elif vendor_type == "WHOLESELLER":
            v_type = 'WS'
        else:
            v_type = 'S'

        prefix_code = 'V/' + v_type
        code = get_next_value(prefix_code)
        code = prefix_code + '/' + str(code)
        return code

    @classmethod
    @transaction.atomic
    def save_vendor(cls, serializer):

        if 'id' in serializer.initial_data:
            vendor_obj = VendorMaster.objects.get(id=serializer.initial_data['id'])
        else:
            vendor_obj = VendorMaster()

        vendor_obj.vendor_code = serializer.initial_data['vendor_code']
        vendor_obj.vendor_name = serializer.initial_data['vendor_name']
        vendor_obj.vendor_type = serializer.initial_data['vendor_type']
        vendor_obj.state_code = serializer.initial_data['state_code']
        vendor_obj.state_name = serializer.initial_data['state_name']
        vendor_obj.region = serializer.initial_data['region']
        vendor_obj.vendor_email = serializer.initial_data['vendor_email']
        vendor_obj.corp_ofc_addr = serializer.initial_data['corp_ofc_addr']
        vendor_obj.branch_ofc_addr = serializer.initial_data['branch_ofc_addr']
        vendor_obj.postal_code = serializer.initial_data['postal_code']
        vendor_obj.pan_no = serializer.initial_data['pan_no']
        vendor_obj.aadhar_no = serializer.initial_data['aadhar_no']
        vendor_obj.gst_no = serializer.initial_data['gst_no']
        vendor_obj.poc_name = serializer.initial_data['poc_name']
        vendor_obj.designation = serializer.initial_data['designation']
        vendor_obj.mobile_no = serializer.initial_data['mobile_no']
        vendor_obj.mobile_num = serializer.initial_data['mobile_num']
        vendor_obj.land_line_no = serializer.initial_data['land_line_no']
        vendor_obj.email_id = serializer.initial_data['email_id']
        vendor_obj.alternative = serializer.initial_data['alternative']
        vendor_obj.payment_terms = serializer.initial_data['payment_terms']
        vendor_obj.credit_days = serializer.initial_data['credit_days']
        vendor_obj.approved_transporter = serializer.initial_data['approved_transporter']
        vendor_obj.tds_applicable = serializer.initial_data['tds_applicable']
        vendor_obj.account_type = serializer.initial_data['account_type']
        vendor_obj.dedcutee_type = serializer.initial_data['dedcutee_type']
        vendor_obj.bank_name = serializer.initial_data['bank_name']
        vendor_obj.ifsc_code = serializer.initial_data['ifsc_code']
        vendor_obj.micr_code = serializer.initial_data['micr_code']
        vendor_obj.account_no = serializer.initial_data['account_no']
        vendor_obj.beneficiary_name = serializer.initial_data['beneficiary_name']

        if len(serializer.initial_data.getlist('panDoc[]')) > 0:
            for image in serializer.initial_data.getlist('panDoc[]'):
                vendor_obj.pan_doc = image

        if len(serializer.initial_data.getlist('adharDoc[]')) > 0:
            for image in serializer.initial_data.getlist('adharDoc[]'):
                vendor_obj.adhar_doc = image

        if len(serializer.initial_data.getlist('gstDoc[]')) > 0:
            for image in serializer.initial_data.getlist('gstDoc[]'):
                vendor_obj.gst_doc = image

        vendor_obj.save()

    @classmethod
    def get_vendor_by_code(cls, v_code):
        vendor_data = VendorMaster.objects.filter(vendor_code = v_code).all().values(
            'id',
            'gst_no',
            'state_name',
            'state_code',
            'mobile_no',
            'branch_ofc_addr'
        )[0]

        return vendor_data          

