from inventory.models import ProductMaster, ProductSubCategory
from sequences import get_next_value


class InventoryService:

    @classmethod
    def generate_product_code(cls, category, sub_category, brand):
        prefix_code = category + '/' + sub_category + '/' + brand
        code = get_next_value(prefix_code)
        return code

    @classmethod
    def save_sub_category(cls,serializer):
        sub_category = ProductSubCategory(**serializer.initial_data)
        sub_category.save()
        return serializer
