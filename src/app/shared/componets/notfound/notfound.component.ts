import { LocalStorageService } from './../../../auth/service/storage/localstorage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'octt-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  btnname: string;
  path: string;
  constructor(private LocalService: LocalStorageService) { }

  ngOnInit(): void {
    const token = this.LocalService.get('token');
    const userRole: any = this.LocalService.get('role');
    if(token) {
      if(JSON.parse(userRole) === 'Mumin') {
        this.btnname = 'Back To Dashboard';
        this.path = '/mumin-dashboard';
      } else {
        this.btnname = 'Back To Dashboard';
        this.path = '/admin/dashboard';
      }
    } else {
      if(JSON.parse(userRole) === 'Mumin') {
        this.path = '/login';
      } else {
        this.path = '/admin/login';
      }
      this.btnname = 'Back To Login';
    }
  }


}
