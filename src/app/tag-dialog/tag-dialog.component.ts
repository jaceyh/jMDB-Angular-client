import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrl: './tag-dialog.component.scss'
})
export class TagDialogComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA)
    public data: [{
        Name: string;
        Description: string;
    },
    { 
        Name: string;
        Description: string;
    }]
    ) {}

    ngOnInit(): void {    
    }
}
