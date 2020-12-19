import django_tables2 as tables
from .models import ProductMaster
from django_tables2.utils import A

class ProductTable(tables.Table):
    delete = tables.LinkColumn(viewname='inventory_ProductMaster_detail', args=[A('id')], attrs={
        'a': {'class': 'btn btn-outline-primary'}
    })
    class Meta:
        model = ProductMaster
        template_name = "django_tables2/bootstrap-responsive.html"
        fields = ("product_name","product_code","hsn_code","description","category","sub_category", "brand" )
        sequence = ('delete', "product_name","product_code","hsn_code","description","category","sub_category", "brand" )
        attrs = {
            "th": {
                "_ordering": {
                    "orderable": "sortable",  # Instead of `orderable`
                    "ascending": "ascend",  # Instead of `asc`
                    "descending": "descend"  # Instead of `desc`
                }
            }
        }