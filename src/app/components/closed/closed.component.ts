import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.scss'],
})
export class ClosedComponent implements OnInit {

  constructor(
    public util: UtilService
  ) { }

  ngOnInit() { }

}
