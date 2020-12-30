from ecommerce.models import Cart
from inventory.models import ProductMaster, ProductCategory, ProductSubCategory, ProductImages, ProductPriceMaster
from store.models import Store


class EcomService:

    def get_product_list(self, kwargs):
        final_list = []
        if 'category_name' in kwargs:
            category_name = kwargs['category_name']
            product_object = ProductMaster.objects.filter(category__category_name=category_name).all()
        elif 'brand_name' in kwargs.keys():
            brand_name =  kwargs['brand_name']
            product_object = ProductMaster.objects.filter(brand__brand_name=brand_name).all()
        elif 'sub_category_name' in kwargs:
            sub_category_name = kwargs['sub_category_name']
            product_object = ProductMaster.objects.filter(sub_category__sub_category_name=sub_category_name).all()
        elif 'product_code' in kwargs:
            product_code = kwargs['product_code']
            product_object = ProductMaster.objects.filter(product_code=product_code).all()
        else:

            product_object = ProductMaster.objects.all()

        product_list = product_object.values(
                                                'id',
                                                'product_code',
                                                'product_name',
                                                'product_image',
                                                'category',
                                                'sub_category',
                                                'brand',
                                                'category__category_code',
                                                'category__category_name',
                                                'category__description',
                                                'sub_category__sub_category_name',
                                                'sub_category__sub_category_code',
                                                'brand__brand_name',
                                                'brand__brand_image',
                                                'product_attributes',

                                            )

        for prod in product_list:
            prod['images'] = list(ProductImages.objects.filter(product_id=prod['id']).all().values(
                'product_id',
                'image'
            ))
            prod['price'] = list(ProductPriceMaster.objects.filter(product_id=prod['id']).all().values(
                'sell_price',
                'unit__PrimaryUnit',
                'qty',

            ))
            final_list.append(prod)
        return list(final_list)


    def get_locations(self):
        location_list = list(Store.objects.all().values('city_name','pin_code'))
        return list(location_list)


    def get_product_category(self):
        category_list = ProductCategory.objects.all().values()
        return list(category_list)

    def get_sub_category(self):
        sub_category_list = ProductSubCategory.objects.all().values(
            "id",
            "sub_category_name",
            "sub_category_code",
            "sub_category_image",
            "category__id",
            "category__category_name",
            "category__category_code",
        )
        return list(sub_category_list)

    def get_cart_detail(self, user_id):
        cart_list = Cart.objects.filter(user_id=user_id).all().values(
            'product__product_name',
            'product__id',
            'product__product_code',
            'product__description',
            'qty',
            'sub_total',
            'id',
        )
        return list(cart_list)

    def add_cart(self,data, user_id):
        if "id" in data:
            Cart.objects.filter(id=data["id"]).delete()
        cart = Cart(user_id=user_id, product_id=data['product_id'],pack_unit_id=data["pack_unit_id"],unit_price=data["unit_price"],qty=data['qty'],sub_total=int(data['qty']) * float(data["unit_price"]) )
        cart.save()
        return True



