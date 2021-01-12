from django.db import transaction

from purchase.models import PurchaseRequisition
from sequences import get_next_value


class PurchaseService:

    @classmethod
    def generate_pr_code(cls):
        prefix_code = 'PR/'
        code = get_next_value(prefix_code)
        code = prefix_code + '/' + str(code)
        return code
