from io import BytesIO

from django.core.files import File
from django.db import transaction

from inventory.models import ProductMaster, ProductSubCategory, ProductPriceMaster, ProductImages, ProductStock
from sequences import get_next_value
import ast
import barcode
from barcode.writer import ImageWriter


class InventoryService:

    @classmethod
    def generate_product_code(cls, category, sub_category, brand):
        prefix_code = category[:3] + '/' + sub_category[:3] + '/' + brand[:3]
        code = get_next_value(prefix_code)
        code = prefix_code + '/' + str(code)
        return code

    @classmethod
    def save_sub_category(cls, serializer):
        sub_category = ProductSubCategory()
        sub_category.category_id = serializer.initial_data['category_id']
        sub_category.sub_category_name = serializer.initial_data['sub_category_name']
        sub_category.sub_category_code = serializer.initial_data['sub_category_code']
        for image in serializer.initial_data.getlist('sub_category_image'):
            sub_category.sub_category_image = image
        sub_category.save()
        return serializer

    @classmethod
    @transaction.atomic
    def save_product(cls, serializer):

        if 'id' in serializer.initial_data:
            product_obj = ProductMaster.objects.get(id=serializer.initial_data['id'])
        else:
            product_obj = ProductMaster()
        product_obj.product_code = serializer.initial_data['product_code']
        product_obj.product_name = serializer.initial_data['product_name']
        product_obj.description = serializer.initial_data['description']
        product_obj.hsn_code = serializer.initial_data['hsn_code']
        product_obj.category_id = serializer.initial_data['category']
        product_obj.sub_category_id = serializer.initial_data['sub_category']
        product_obj.brand_id = serializer.initial_data['brand']
        product_obj.product_attributes = serializer.initial_data['product_attributes']
        product_obj.save()

        if 'product_pack_types' in serializer.initial_data:
            pack_types = serializer.initial_data['product_pack_types']
            pack_types = ast.literal_eval(pack_types)
            for packs in pack_types:
                if 'id' in packs:
                    price_obj = ProductPriceMaster.objects.get(id=packs['id'])
                else:
                    price_obj = ProductPriceMaster()
                    price_obj.product_identifier = str(get_next_value('product_identifier')).zfill(12)
                    file_name = price_obj.product_identifier + '.png'
                    price_obj.bar_code.save(file_name, File(cls.generate_bar_code(price_obj.product_identifier)), save=False)
                price_obj.sell_price = packs['sell_price']
                price_obj.unit_id = packs['unit_id']
                price_obj.qty = packs['qty']
                price_obj.product = product_obj
                price_obj.save()

        if len(serializer.initial_data.getlist('files[]')) > 0:
            for image in serializer.initial_data.getlist('files[]'):
                product_image = ProductImages(product_id=product_obj.id, image=image)
                product_image.save()

        return serializer

    def get_product_list(self):
        product_list = []
        product_dict = ProductMaster.objects.all().values(
            'product_code',
            'product_name',
            'description',
            'hsn_code',
            'category__id',
            'category__category_name',
            'category__category_code',
            'sub_category__id',
            'sub_category__sub_category_name',
            'sub_category__sub_category_code',
            'brand__id',
            'brand_brand_name',
            'product_attributes',
        )

        for prd in product_dict:
            pass

    @classmethod
    def check_stock(cls, store_id, product_id):

        prod_stock = ProductStock.objects.filter(product_id=product_id, store_id=store_id).all()
        if prod_stock.exits():
            return prod_stock
        else:
            return None

    @classmethod
    def generate_bar_code(cls, product_identifier):

        EAN = barcode.get_barcode_class('ean13')
        ean = EAN(f'{product_identifier}', writer=ImageWriter())
        buffer = BytesIO()
        ean.write(buffer)
        return buffer

