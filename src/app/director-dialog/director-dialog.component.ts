import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-dialog',
  templateUrl: './director-dialog.component.html',
  styleUrl: './director-dialog.component.scss'
})
export class DirectorDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA)
    public data: {
        Name: string;
        Bio: string;
        Birthdate: string;
      }
    ) {}

    ngOnInit(): void {
    }
}
