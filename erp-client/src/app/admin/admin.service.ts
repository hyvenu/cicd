import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  public saveStore(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/`, data)
  }
  public getStore(data){
    if(data == ""){
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/`)
    }else{
      return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/${data}/`)
    }
  }

  public getStoreDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_store_details?id=${id}`)
  }

  public getStoreList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_store_list`)
  }
  public updateStore(id, data){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Store/${id}/`, data)
  }
  public getStoreShipLocations(data){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip?store_id=${data}`)
  }
  public saveStoreShipLocations(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip/`, data)
  }
  public updateStoreShipLocations(id,data){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip/${id}/`, data)
  }
  public deleteStoreShipLocations(id){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreShip/${id}/`)
  }
  public getProductCampaigns(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/ProductCampaign`)
  }
  public AddSiteSettings(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/SiteSettings/`, data)
  }

  public getServiceList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_store_service_list`, {})
  }

  public saveService(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreService/`, data)
  }

  public removeFromService(data){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreService/`, data)
  }

  public updateService(id,data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/StoreService/` + id + '/', data)
  }

  public saveBooking(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/save_appointment`, data)
  }

  public removeFromBooking(data){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Appointment/`, data)
  }

  public updateBooking(data) {
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/save_appointment` , data)
  }

  public updateIsPaid(data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/update_is_paid` , data)
  }
 

  public updateAdvanceAmount(data) {
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/update_advance_amount` , data)
  }

  public getAppointmentListOfCalendar(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Appointment`,{})
  }

  public getAppointmentList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_appointment_details`, {})
  }

  public getViewbookingList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_viewbooking_details`, {})
  }

  public getAllViewbookingList(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_all_viewbooking_details`, {})
  }

  public getDashboardbookingDetails(){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_dashboard_booking_details`, {})
  }
  // public getAppointmentLists(id){
  //   return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_appointment_list/` + id + '/')
  // }


  public getAppointmentDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_appointments/` + id + '/')
  }

  public getAppointmentDetailsById(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_appointment_details_by_id?id= ${id}`)
  }

  public getEmployeeList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_employee_list`, {})
  }

  public getEnquiryList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_enquiry_list`, {})

  }
  public getCustomerList() {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Customer/`, {})
  }
  public SaveEmployee(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Employee/`,data)
  }

  public SaveEnquiry(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Enquiry/`,data)
  }

  public SaveMember(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/MembersDetails/`,data)
  }

  public updateMember(data,id){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/MembersDetails/`+ id + '/', data)
  }

  public SaveCustomer(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Customer/`,data)
  }

  public getCustomerDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Customer/` + id + '/')
  }

  public updateCustomer(data,id){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Customer/`+ id + '/', data)
  }

  public deleteCustomer(id){
    return this.http.delete<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Customer/`+ id + '/')
  }

  public getBookinHistory(id){
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_booking_history?customer_id=`+ id )
  }

  // public getBookingHistoryList(){
  //   return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/get_appointment_list`,{})
  // }

  public updateEmployee(data,id){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Employee/`+ id + '/', data)
  }

  

  public updateEnquiry(data,id){
    return this.http.put<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Enquiry/`+ id + '/', data)
  }

  public getEmployeeDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Employee/` + id + '/')
  }

  public getEnquiryDetails(id) {
    return this.http.get<any>(`${environment.BASE_SERVICE_URL}/manage_store/api/v1/Enquiry/` + id + '/')
  }

  public saveInvoice(data){
    return this.http.post<any>(`${environment.BASE_SERVICE_URL}/manage_sales/api/v1/save_po`,data)
  }

}
