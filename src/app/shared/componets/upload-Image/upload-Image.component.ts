import { ChangeDetectorRef, EventEmitter, Input } from "@angular/core";
import { Component, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SmartDialogDeleteComponent } from "../smart-dialog/smart-dialog-delete.component";

@Component({
  selector: "app-upload-Image",
  templateUrl: "./upload-Image.component.html",
  styleUrls: ["./upload-Image.component.scss"],
})
export class UploadImageComponent implements OnInit {
  @Output() sendImageEvent = new EventEmitter<any>();

  @Input("imageUpload") imageUpload!: Observable<any>;

  private destroy$ = new Subject();
  imagePath: string;

  imageUploadList$ = new BehaviorSubject<any>('');
  imageUploadList = this.imageUploadList$.asObservable();

  constructor(public dialog: MatDialog,    private toastservice: ToastrService,
    ) {}

  ngOnInit() {
    this.getImagePathData();
  }
  ngOnDestroy(): void {
    this.destroy$.next(); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief imageUpload list
   * @param none
   * return none
   *
   ******************************************************************************/

  getImagePathData() {
    if (this.imageUpload !== undefined) {
      this.imageUpload.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.imagePath = data ? data : "../assets/images/add_photo.svg";
      });
    }
  }

  /******************************************************************************
   *
   * @brief Emit the Card Details to component using input
   * @param none
   * return card details
   *
   ******************************************************************************/

  onSelectFile(event: any) {
    if (event.target.files[0].type!=="image/jpeg" && event.target.files[0].type!=="image/png" && event.target.files[0].type!=="image/jpg") {
      this.toastservice.error("Please upload jpg/png/jpeg file .");
      return
    }

    if (event.target.files[0].size > 5000000) {/* checking size here - 5MB */
      this.toastservice.error("Image size cannot be greater than 5 MB .");
      return
    }
    this.imagePath = "";

      if (event.target.files && event.target.files[0]) {

        var reader = new FileReader();
  
        reader.readAsDataURL(event.target.files[0]); // read file as data url
  
        reader.onload = (event: any) => {
          this.imagePath = event.target.result;
        };
        this.sendImageEvent.emit(event.target.files[0]);
      }
    }


  imageFullSize() {
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: {imagePath: this.imagePath, buttonClose:true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }


  public delete() {
    this.imagePath = "";
  }

}
