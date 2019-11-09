import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms'
import { AppService } from 'src/app/app.service';
import{formatDate} from '@angular/common'
import{Router,ActivatedRoute} from '@angular/router'
import {ToastrService} from 'ngx-toastr'
import {DatePipe} from '@angular/common'
import * as io from 'socket.io-client'
@Component({
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.css']
})
export class ViewIssueComponent implements OnInit {
private url='http://localhost:3000'
//private url="http://api.my-app-dev.tk"

public socket
  issueForm=new FormGroup({
    title:new FormControl('',Validators.required),
    reporter:new FormControl(''),
    date:new FormControl(''),
    description:new FormControl('',Validators.required),
    status:new FormControl('')
  })
  commentForm=new FormGroup({
    comment:new FormControl('',Validators.required)
  })
  statusItems:String[]=[
    "In-Backlog","In-Test","In-Process","Done"
  ]
 isInWatchList:String="Remove From Watch List"
  issueTitle:String
  commentArray:any
  isEmpty:boolean
  @ViewChild('watchlist',{static:true}) input:ElementRef
  constructor(private appService:AppService,private datePipe:DatePipe,private activatedRoute:ActivatedRoute,private router:Router,private toastr:ToastrService) { 
    let todayDate=formatDate(new Date(),'yyyy-MM-dd','en-US')
      this.issueForm.get('date').setValue(todayDate)
      this.issueForm.get('status').setValue(this.statusItems[0])
      this.activatedRoute.queryParams.subscribe(
        data=>{
          this.socket=io(this.url)   
          this.issueTitle=data["title"]   
          this.fetchIssueData(this.issueTitle)
          this.fetchComments()
        }
      )

  }
  onSubmit=()=>{

  }

  ngOnInit() {   
  }

  fetchIssueData=(title)=>{
    let data={
      title:title
    }
    this.appService.fetchIssueData(data).subscribe(
      data=>{
        if(data.message=='Issue doesnot exist'){
          this.toastr.error("Issue does not exist")
          this.router.navigate(['/home'])
        }
        else{
        this.issueForm.get('date').setValue('2019-01-18')
        this.issueForm.get('title').setValue(data.data.title)
        this.issueForm.get('reporter').setValue(window.sessionStorage.name)
        this.issueForm.get('date').setValue(this.datePipe.transform(data.data.date),'dd/mm/yyyy')
        this.issueForm.get('description').setValue(data.data.description)
        this.issueForm.get('status').setValue(data.data.status)
        let watchListData={
          title:this.issueForm.get('title').value,
          userId:window.sessionStorage.getItem('userId')
        }
        this.appService.isInWatchList(watchListData).subscribe(
          data=>{
            if(data.data==false){
              this.isInWatchList="Add to WatchList"
            }
            else{
              this.isInWatchList="Remove from WatchList"
            }
          }
        )
        window.sessionStorage.setItem('title',<string>this.issueTitle)
      }
    }
    )
    
  }


  addToWatchList=()=>{
    let data={
      title:this.issueForm.get('title').value,
      userId:window.sessionStorage.getItem('userId')
    }
    this.appService.addToWatchList(data).subscribe(
      data=>{
        this.toastr.success(data.message)
        if(data.message=="Added to WatchList"){
          this.isInWatchList="Remove from WatchList"
        }
        else{
          this.isInWatchList="Add to WatchList"
        }
      }
    )
  }

  edit=()=>{
    this.router.navigate(['/edit-issue'],{queryParams:{"title":this.issueTitle}})
  }

  logout=()=>{
    this.appService.logout().subscribe(
      data=>{
        if(data.message="Logged Out Successfully"){
          window.sessionStorage.clear()
          this.toastr.success(data.message)
          this.router.navigate(['/login'])
      }
      else{
        this.toastr.error(data.message)
      }
  })
  }

  delete=()=>{
    let data={
      title:this.issueTitle
    }
    this.appService.deleteIssue(data).subscribe(
      data=>{
        if(data.message=="Issue Deleted Successfully"){
          this.appService.getWatchList(this.issueForm.get('title').value).subscribe(
            data=>{
              this.socket.emit('delete-issue',data.data)
            }
          )
          // location.reload(true)
          // this.ngOnInit()
          this.router.navigate(['/home'])
          this.toastr.success(data.message)
          
        }else{
          this.toastr.error(data.message)
        }
      }
    )
  }


  fetchComments=()=>{
    let data={
      title:window.sessionStorage.getItem('title')
    }
    this.appService.fetchComments(data).subscribe(
      data=>{
        this.commentArray=data.data
        if(this.commentArray.length==0){
          this.isEmpty=true
        }

      }
    )
  }

  postComment=()=>{
    let data={
      title:window.sessionStorage.getItem('title'),
      comment:this.commentForm.get('comment').value,
      userName:window.sessionStorage.getItem('name')      
    }
    this.appService.postComment(data).subscribe(
      data=>{
        this.appService.getWatchList(window.sessionStorage.getItem('title')).subscribe(
          data=>{
            this.socket.emit('comment-issue',data.data)
          }
        )
        this.toastr.success(data.message)
        this.fetchComments()
      }
    )
  }

}
