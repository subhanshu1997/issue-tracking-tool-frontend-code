import { Component, OnInit } from '@angular/core';
import{AppService} from '../../app.service'
import {Router,ActivatedRoute} from '@angular/router' 
import{ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
isEmpty:boolean=false
  constructor(private appService:AppService,private activatedRoute:ActivatedRoute,private router:Router,private toastr:ToastrService) { }
notifications:any
  ngOnInit() {
    let data={
      userId:window.sessionStorage.getItem('userId')
    }
    this.appService.fetchNotifications(data).subscribe(
      data=>{
        console.log(data)
        console.log(data.data)
        this.notifications=data.data
        if(this.notifications.length==0){
          this.isEmpty=true
        }

      }
    )
  }
  viewIssue=(data)=>{
    if(data.action=='Edit' || data.action=='Comment'){
            this.router.navigate(['/view-issue'],{queryParams:{"title":data.title}})
    }
    else{
      this.toastr.error("This issue has been deleted")
    }

  }

  logout=()=>{
    this.appService.logout().subscribe(
      data=>{
        console.log(data)
        if(data.message="Logged Out Successfully"){
          window.sessionStorage.clear()
          this.toastr.success(data.message)
          this.router.navigate(['/login'])
        }
        else{
          this.toastr.error(data.message)
        }
      }
    )
  }


}
