import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import * as io from 'socket.io-client'
import{ToastrService} from 'ngx-toastr'
@Injectable({
  providedIn: 'root'
})
export class SocketService {
private url='http://localhost:3000'
private socket
  constructor(private http:HttpClient,private toastr:ToastrService) {
    // this.socket=io(this.url)
   }

   
}



