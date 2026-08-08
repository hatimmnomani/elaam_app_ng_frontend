import { ToastrService } from "ngx-toastr";
import jwt_decode from "jwt-decode";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SpinnerService } from "src/app/shared/services/spinner/spinner.service";
import { AuthService } from "../../service/auth.service";
import { MyErrorStateMatcher } from "src/app/shared/models/error-matcher";
import { config } from "src/app/shared/models/validation_config";
import { LocalStorageService } from "../../service/storage/localstorage.service";
import { MatDialog } from "@angular/material/dialog";
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MuminDashboardService } from "src/app/layout/modules/mumin-dashboard/service/mumin-dashboard.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

export class LoginComponent implements OnInit {
  hide = true;
  showlogin = environment.loginFlag;
  //  showlogin = "onelogin";
  isQrCode:any="false";
  loginForm: any = FormGroup;
  rememberCheckbox = false;
  loggedUser: any;
  cred: any;
  isLoggedIn = false;
  listSpinner = false;
  matcher = new MyErrorStateMatcher();

  validationMessages: any = {
    itsId: config.validationMessages.itsId,
    password: config.validationMessages.password,
  };
  isMumin: boolean;
  routerUrl: string;

  token: string;
  data: string;
  userHavingMultpleRole: boolean = false;
  userRoles: any = [];
  decodedToken: any = [];
  event: any;
  getCurrentYear: any = new Date().getFullYear();
  private destroy$ = new Subject();

  date_formate: any = "YYYY-MM-DD";
  startDate = moment().format(this.date_formate);

  help_number_show_hide = false
  constructor(
    private fb: FormBuilder,
    public spinnerServiceSr: SpinnerService,
    private router: Router,
    private dialogRef: MatDialog,
    private authStorage: LocalStorageService,
    private toastservice: ToastrService,
    private LocalService: LocalStorageService,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private muminDashboardSr: MuminDashboardService,

  ) {

    this.routerUrl = this.router.url;
    this.activeRoute.queryParams.subscribe(params => {
      this.token = encodeURIComponent(params['Token']);
      this.data = encodeURIComponent(params['DT']);
    });

    if (this.token !== 'undefined' && this.data !== 'undefined') {
      this.onSubmit();
    }
  }

  ngOnInit(): void {
   let isQrCode = this.activeRoute.snapshot.paramMap.get('id');
   if(isQrCode!==undefined && isQrCode!==null){
    let splitParams:any =  isQrCode?.split('-',2);
    this.isQrCode =splitParams[1]
    this.LocalService.set("isQrCode", splitParams[1]);
    this.LocalService.set("templateId", btoa(splitParams[0]));
   }else{
    if(this.routerUrl?.includes('loginSuccess')){
      let isTrue= this.LocalService.get('isQrCode');
      if(isTrue==='true'){ }else{
        this.isQrCode ="false"
        this.LocalService.set("isQrCode", "false");
        this.LocalService.set("templateId", "null");
      }
    }else{
      this.isQrCode ="false"
      this.LocalService.set("isQrCode", "false");
      this.LocalService.set("templateId", "null");
    }
     
   }
   
    this.getDate(moment().subtract(10, 'years').format(this.date_formate));
    this.dialogRef.closeAll();
    this.authStorage.clear();
    this.loginFm();
  }


  getDate(endDate: string) {
    this.event = { startDate: endDate, endDate: moment().format(this.date_formate) }
  }
  helpNumber() {
    this.help_number_show_hide = true
  }
  closeHelp() {
    this.help_number_show_hide = false
  }

  /******************************************************************************
   *
   * @brief f() is used to get the form controls
   * @param none
   * @return controls of form
   *
   ******************************************************************************/
  get f() {
    return this.loginForm.controls;
  }

  /*******************************************************************************
   * @brief loginFm a login form and pass validation .
   * @param none.
   * @return pass form input and validation .
   ******************************************************************************/
  loginFm() {
    if (this.LocalService.get("remember") == "true") {
      this.rememberCheckbox = true;
    } else {
      this.rememberCheckbox = false;
    }

    this.loginForm = this.fb.group({
      itsId: [
        this.LocalService.get("remember") == "true" ? this.LocalService.get("itsId") : "",
        [
          Validators.required,
          Validators.maxLength(config.validation.itsId.maxLength),
          Validators.minLength(config.validation.itsId.minLength),
          Validators.pattern(config.validation.itsId.regExp),
        ],
      ],
      password: [this.LocalService.get("remember") == "true" ? this.LocalService.get("password") : "",
      [
        Validators.required,
        Validators.maxLength(config.validation.password.maxLength),
      ],
      ],
    });
  }

  /******************************************************************************
   *
   * @brief async function onSubmit , handles if form is invalid, used to signin with amplify and navigates to page based on roles.
   * @param none
   * return none
   *
   ******************************************************************************/
  onSubmit() {
    this.listSpinner = true;
    let obj;
    if (this.showlogin == 'simple') {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        this.listSpinner = false;
        return;
      }
      const itsId = this.f.itsId.value;
      const password = this.f.password.value;

      if (this.routerUrl.includes('admin')) {
        this.isMumin = false
      } else {
        this.isMumin = false
      }
      obj = { 'itsId': itsId, 'password': password, 'isMumin': this.isMumin }
    } else {
      obj = { 'token': this.token, 'data': this.data }
    }

    this.showlogin = 'none';

    this.loggedUser = this.authService.login(obj).subscribe(
      (res) => {
        // this.toastservice.success("Sign in Successful");
        this.listSpinner = false;
        const token: any = this.authStorage.get("token");
        this.decodedToken = jwt_decode(token);
        this.userRoles = this.decodedToken["Roles"];
        this.LocalService.set("itsId", this.decodedToken['sub']);
        let idtsId = this.decodedToken['sub'];
        if (this.userRoles.length > 1) {
          this.muminDashboardSr.getNiyatStatus(this.event, idtsId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              let obj = data.find((o: { name: string; }) => o.name === 'total niyats');
              if (obj.value == 0) {
                this.userRoles = this.decodedToken["Roles"].filter((obj: any) => obj.authority !== 'Mumin');

                this.roleNavigation();
              } else {
                const isQrCode = this.LocalService.get("isQrCode");
                if(isQrCode==="true"){
                  this.roleNavigation();
                }else{
                this.userHavingMultpleRole = true;
                this.LocalService.set("multipleRoles", JSON.stringify(this.userRoles));
                this.LocalService.set("switchLocation", window.location.href);
                window.scrollTo(0, 0);
                }
              }
            })
        } else {
          this.roleNavigation();
        }
      },
      (err) => {
        this.listSpinner = false;
      },
      () => console.log("completed")
    );

    if (this.rememberCheckbox) {
      this.LocalService.set("remember", "true");
      this.LocalService.set("password", this.f.password.value);
    } else {
      this.LocalService.set("remember", "false");
      // this.LocalService.remove("itsId");
      this.LocalService.remove("password");
    }
  }

  /*******************************************************************************
   * @brief will navigate based on token based roles
   * @param array of role.
   * @return none
   ******************************************************************************/
  roleNavigation(): void {
    this.LocalService.set("role", JSON.stringify(this.userRoles[0]['authority']));
    this.LocalService.set("name", this.decodedToken["Name"]);
    this.LocalService.set("itsId", this.decodedToken['sub']);

    if (this.decodedToken['JamaatId'] != undefined) {
      if (this.decodedToken['JamaatId'].length > 1) {
        this.LocalService.set("MultipleJamaatIds", JSON.stringify(this.decodedToken['JamaatId']));
        this.LocalService.set("JamaatId", this.decodedToken['JamaatId'][0]);
      } else {
        this.LocalService.set("JamaatId", this.decodedToken['JamaatId']);
      }
    } else if (this.decodedToken['JamiatId'] != undefined) {
      if (this.decodedToken['JamiatId'].length > 1) {
        this.LocalService.set("MultipleJamiatIds", JSON.stringify(this.decodedToken['JamiatId']));
        this.LocalService.set("JamiatId", this.decodedToken['JamiatId'][0]);
      } else {
        this.LocalService.set("JamiatId", this.decodedToken['JamiatId']);
      }
    } else if (this.decodedToken['DepartmentId'] != undefined) {
      this.LocalService.set("DepartmentId", this.decodedToken['DepartmentId']);
    } else {
      this.LocalService.remove('UmoorId')
      this.LocalService.remove('DepartmentId')
      this.LocalService.remove('JamiatId')
      this.LocalService.remove("JamaatId");
    }

    if (this.decodedToken['UmoorId'] != undefined) {
      if (this.decodedToken['UmoorId'].length > 1) {
        this.LocalService.set("MultipleUmoorIds", JSON.stringify(this.decodedToken['UmoorId']));
        this.LocalService.set("UmoorId", this.decodedToken['UmoorId'][0]);
      } else {
        this.LocalService.set("UmoorId", this.decodedToken['UmoorId']);
      }
    }

    this.userRoles.forEach((roles: any) => {
      const isQrCode = this.LocalService.get("isQrCode");
      if (isQrCode === "true") {
        switch (roles.authority) {
          case "Super Admin":
            this.router.navigate(["/admin/niyat-data-form/add"]);
            window.scrollTo(0, 0);
            break;
          default:
            this.router.navigate(["/admin/niyat-data-form/add"]);
            window.scrollTo(0, 0);
            break;
        }
      } else {
        switch (roles.authority) {
          case "Super Admin":
            this.router.navigate(["/admin/dashboard"]);
            window.scrollTo(0, 0);
            break;

          case "Template Creator":
            this.router.navigate(["/admin/niyat-template"]);
            window.scrollTo(0, 0);
            break;

          case "Data Entry Operator":
            this.router.navigate(["/admin/niyat-data"]);
            window.scrollTo(0, 0);
            break;

          case "Mumin":
            this.router.navigate(["/mumin-dashboard"]);
            window.scrollTo(0, 0);
            break;

          default:
            this.router.navigate(["/admin/dashboard"]);
            window.scrollTo(0, 0);
            break;
        }
      }
    });

  }

  /*******************************************************************************
   * @brief showOptions accepts the event value. checked value of rememeber me
   * @param none.
   * @return checked value.
   ******************************************************************************/
  showOptions(event: any): void {
    this.rememberCheckbox = event.checked;
  }

  /*******************************************************************************
   * @brief redirect is called for redirect in forgotpassword.
   * @param none.
   * @return redirect in other page  .
   ******************************************************************************/

  redirect() {
    this.router.navigate(["./forgot-password"]);
  }


  redirectTo3rdParty() {
    window.location.href = environment.redirectionURL;
  }

  loginByRole(role: any) {
    this.userRoles = this.userRoles.filter((val: any) => {
      return val.authority == role
    });
    this.roleNavigation();
  }

}
