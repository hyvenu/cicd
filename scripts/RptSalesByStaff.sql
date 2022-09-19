select distinct 
store.store_name as branch_name,
app.booking_date,
req.invoice_no,
emp.employee_name,
service.service_name,
sales.unit_price,
sales.discount_price,
sales.gst_amount,

sales.subtotal_amount as grand_total
from sales_salesorderrequest as req
inner join sales_salesorderdetails as sales on sales.po_order_id=req.id
inner join store_storeservices as service on service.id = sales.service_id
inner join store_appointmentschedule as app on app.id = sales.booking_id
inner join store_appointmentformultipleservice as appm on appm.appointment_id=sales.booking_id and appm.service_id = sales.service_id
inner join store_employee as emp on emp.id= appm.assigned_staff_id
inner join store_store as store on store.id=app.store_id
where app.is_paid = 1 
and app.booking_date = req.po_date
and app.booking_date between  {from_date} and {to_date}
and sales.service_id is not null
 
order by app.booking_date, service.service_name, emp.employee_name asc;


select * from  sales_salesorderrequest where invoice_no ='INV/2022/01568';

Select * from store_appointmentschedule where customer_id='e3c89e25cc05458eaa7768736677681e';

select * from store_appointmentformultipleservice where appointment_id='826c3ee56cb24061a51e5bda2b0784a1'