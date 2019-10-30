import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http'
import{CookieService} from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AppService {
private url='http://localhost:3000/api/v1/issue-tracking-tool'
//private url='http://api.my-app-dev.tk/api/v1/issue-tracking-tool'
auth='';
name=''
firstName:String
lastName:String
  constructor(private http:HttpClient,private cookie:CookieService) { }
  public signup=(data):any =>{
    return this.http.post(`${this.url}/signup`,data)
  }


  public signin=(data):any=>{
    let response:any=this.http.post(`${this.url}/login`,data)
    return response
  }


  public reportIssue=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    data.name=window.sessionStorage.getItem('name')
    return this.http.post(`${this.url}/reportIssue`,data)
  }


  public fetchIssues=():any=>{
    let data={
    authToken:window.sessionStorage.getItem('authToken'),
    userId:window.sessionStorage.getItem('userId')}
    return this.http.post(`${this.url}/fetchIssues`,data)
  }


  public fetchAllIssues=():any=>{
    let data={
    authToken:window.sessionStorage.getItem('authToken'),
    }
    return this.http.post(`${this.url}/fetchAllIssues`,data)
  }


  public search=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/searchIssue`,data)
  }

  addToWatchList=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    console.log(data.authToken)
    return this.http.post(`${this.url}/addToWatchList`,data)
  }


  public fetchIssuesInit=():any=>{
    let data={
      authToken:window.sessionStorage.getItem('authToken'),
      userId:window.sessionStorage.getItem('userId')
    }
    let response:any=this.http.post(`${this.url}/fetchIssuesInit`,data)    
    return response
  }

  
  public logout=():any=>{
    let data={
    authToken:window.sessionStorage.getItem('authToken')}
    return this.http.post(`${this.url}/logout`,data)
  }


  public getWatchList=(title):any=>{
    let data={
      title:title,
      authToken:window.sessionStorage.getItem('authToken')
    }
    return this.http.post(`${this.url}/getWatchList`,data)
  }

  public isInWatchList=(data):any=>{
    console.log("data is"+data.title)
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/isInWatchList`,data)
  }

  public fetchComments=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/fetchComments`,data)
  }


  public postComment=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/postComment`,data)
  }


  public editIssue=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/editIssue`,data)
  }


  public fetchNotifications=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/fetchNotifications`,data)
  }


  public deleteIssue=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    return this.http.post(`${this.url}/deleteIssue`,data)
  }


  public fetchIssueData=(data):any=>{
    data.authToken=window.sessionStorage.getItem('authToken')
    console.log("data in appservice"+data.title)
    return this.http.post(`${this.url}/fetchIssuedata`,data)
  }
}
