SELECT  
(select store_name from store_store where id=orq.store_id) as branch_name,
Date(orq.po_date) as transaction_date,
(select customer_name from store_customer where id=orq.customer_id) as customer_name,
orq.invoice_no,
(select phone_number from store_customer where id=orq.customer_id) as phone_number,
ord_details.qty,
ord_details.unit_price,
ord_details.gst,
ord_details.gst_amount,
ord_details.subtotal_amount ,
prd.product_name,
'Product' as sales_type,
ifnull(orq.credit_type,'') as credit_type,
ifnull(orq.transport_type,'') as transport_type,
ifnull(orq.upi_type,'') as upi_type,
ifnull(orq.transaction_id,0) as transaction_id

FROM sales_salesorderrequest orq
JOIN sales_salesorderdetails ord_details on ord_details.po_order_id=orq.id
JOIN inventory_productmaster prd on prd.id = ord_details.product_id
where date(orq.po_date) between {from_date} and {to_date}
and orq.store_id={branch_id}
UNION ALL 

SELECT  
(select store_name from store_store where id=orq.store_id) as branch_name,
Date(orq.po_date) as transaction_date,
(select customer_name from store_customer where id=orq.customer_id) as customer_name,
orq.invoice_no,
(select phone_number from store_customer where id=orq.customer_id) as phone_number,
ord_details.qty,
ord_details.unit_price,
ord_details.gst,
ord_details.gst_amount,
ord_details.subtotal_amount ,
prd.service_name,
'Service' as sales_type,
ifnull(orq.credit_type,'') as credit_type,
ifnull(orq.transport_type,'') as transport_type,
ifnull(orq.upi_type,'') as upi_type,
ifnull(orq.transaction_id,0) as transaction_id
 

FROM sales_salesorderrequest orq
JOIN sales_salesorderdetails ord_details on ord_details.po_order_id=orq.id
JOIN store_storeservices prd on prd.id = ord_details.service_id
where date(orq.po_date) between {from_date} and {to_date}
and orq.store_id={branch_id}