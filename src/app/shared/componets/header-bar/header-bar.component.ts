import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  @Input('hideButton') hideButton =  false;

  @Input('title') title!: string;  

  @Input('path') path!: string;  

  @Input('buttonName') buttonName!: string;  

  @Input('applyPipe') applyPipe = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  route() {
    this.router.navigate([this.path]);
  }

}
