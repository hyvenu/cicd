# Generated by Django 3.1.1 on 2021-01-29 17:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('purchase', '0001_initial'),
        ('store', '0001_initial'),
        ('vendor', '0001_initial'),
        # ('inventory', '0002_auto_20210129_1757'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchaserequisitionproductlist',
            name='store_obj',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='store_pr', to='store.store'),
        ),
        migrations.AddField(
            model_name='purchaserequisitionproductlist',
            name='unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchase_requisition_unit', to='inventory.unitmaster'),
        ),
        migrations.AddField(
            model_name='purchaserequisition',
            name='dept',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='department', to='store.department'),
        ),
        migrations.AddField(
            model_name='purchaserequisition',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='store_pur_req', to='store.store'),
        ),
        migrations.AddField(
            model_name='poorderrequest',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='store_po_req', to='store.store'),
        ),
        migrations.AddField(
            model_name='poorderrequest',
            name='vendor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vendor.vendormaster'),
        ),
        migrations.AddField(
            model_name='poorderdetails',
            name='po_order',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='purchase.poorderrequest'),
        ),
        migrations.AddField(
            model_name='poorderdetails',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.productmaster'),
        ),
        migrations.AddField(
            model_name='poorderdetails',
            name='unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.unitmaster'),
        ),
        migrations.AddField(
            model_name='grnproductlist',
            name='grn',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grn_product_list', to='purchase.grnmaster'),
        ),
        migrations.AddField(
            model_name='grnproductlist',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grn_product', to='inventory.productmaster'),
        ),
        migrations.AddField(
            model_name='grnproductlist',
            name='unit_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grn_unit', to='inventory.unitmaster'),
        ),
        migrations.AddField(
            model_name='grnmaster',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='grn_store', to='store.store'),
        ),
    ]
