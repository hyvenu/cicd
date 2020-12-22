from inventory.models import ProductMaster
from sequences import get_next_value


class InventoryService:

    @classmethod
    def generate_product_code(cls, category, sub_category, brand):
        prefix_code = category + '/' + sub_category + '/' + brand
        code = get_next_value(prefix_code)
        return code
