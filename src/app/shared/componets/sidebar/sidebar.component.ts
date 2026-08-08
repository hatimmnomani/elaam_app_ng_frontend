import { Router } from '@angular/router';
import { MediaMatcher } from "@angular/cdk/layout";
import { NONE_TYPE } from "@angular/compiler";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { Subscription } from "rxjs";
import { LocalStorageService } from "src/app/auth/service/storage/localstorage.service";
import { SidenavService } from "../../services/sidebar/sidenav.service";
import { QuizService } from '../../services/quiz.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  userRole: any;
  navLinks: any[] = [];
  isQrCode:any=false

  constructor(private LocalService: LocalStorageService, private router: Router, private quizService: QuizService) {}

  ngOnInit(): void {
    this.userRole = this.LocalService.get("role");
    this.isQrCode=localStorage.getItem('isQrCode');

    const data = JSON.parse(this.userRole)
    this.getRoles(data);

    this.quizService.getQuizEligibility().subscribe(isEligible => {
      if (isEligible) {
        this.navLinks.unshift({
          name: "Quiz",
          img: "question.png",
          actimg: "question.png",
          route: "quiz"
        });
      }
    });
  }


  isActive(item: any): boolean {
    return item.route !== 'quiz' && this.router.url === item.route;
  }

  /******************************************************************************
   *
   * @brief handle sidebar navigation click. Clears Dashboard flow state when
   *        navigating to any route other than dashboard variants.
   * @param item: navigation item
   * return none
   *
   ******************************************************************************/
  onNavClick(item: any): boolean {
    if (item.route === 'quiz') {
      const token = this.LocalService.get('token');
      const name = this.LocalService.get('name');
      const role = this.LocalService.get('role');
      const currentUrl = window.location.href;
      window.location.href = `${environment.quizFrontendUrl}?token=${token}&name=${name}&role=${role}&redirectUrl=${encodeURIComponent(currentUrl)}`;
      return false;
    }
    const route = String(item?.route ?? '').toLowerCase();
    // Allow dashboard routes to retain flow state
    if (route.includes('dashboard')) {
      return true;
    }
    this.clearDashboardFlowState();
    return true;
  }

  /******************************************************************************
   *
   * @brief Clear flow state created by TableAndSearchComponent for Dashboard tabs
   *        Keys are the tab names used as storage keys inside TableAndSearch
   * @param none
   * return none
   *
   ******************************************************************************/
  private clearDashboardFlowState(): void {
    const dashboardFlowKeys = ['jamiat', 'jamaat', 'umoor', 'department', 'Niyat', 'niyat'];
    dashboardFlowKeys.forEach(key => this.LocalService.remove(key));
    // Also reset last opened dashboard tab so a fresh session starts clean
    this.LocalService.remove('dashboard_tab');
    // Ensure dashboard does not try to restore flow on next entry
    this.LocalService.remove('dashboard_loaded');
  }



/******************************************************************************
 *
 * @brief navigate to default route.
 * @param none
 * return none
 *
 ******************************************************************************/


  navigatetoDefault() {
    let mumin: any = this.LocalService.get('role')
    if(JSON.parse(mumin)  === "Mumin") {
      
      this.router.navigate(['/mumin-dashboard'])
    } else {
      this.router.navigate(['admin/dashboard'])
    }
  }
  

  /******************************************************************************
   *
   * @brief getRoles we are check here to all nav menu bases of user role
   * @param none
   * return navigation menu
   *
   ******************************************************************************/

  getRoles(userRole: any) {
    if(this.isQrCode==="true"){
      switch (userRole) {
        case "Super Admin":
          this.qrCodeRole();
          break;
        default:
          this.qrCodeRole();
          break;
      }
    }else{
    switch (userRole) {
      case "Super Admin":
        this.superAdminRoutes();
        break;

      case "Template Creator":
        this.templateCreator();
        break;

      case "Data Entry Operator":
        this.dataEntryOperator();
        break;

      case "Mumin":
        this.MuminDashboardRoute();
        break;

      case "Khidmat Ramadaniyah":
        this.khidmatRamadaniyahRoles();
        break;

      default:
        this.defaultRoles();
        break;
    }
  }
  }

    /******************************************************************************
   *
   * @brief navigation routes Mumin Dashboard Routes
   * @param none
   * return none
   *
   ******************************************************************************/
  MuminDashboardRoute() {
    this.navLinks = [
      {
        name: "Mumin Dashboard",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "mumin-dashboard",
      },
      {
        name: "Jawaaiz (Prizes)",
        img: "cat.png",
        actimg: "menu_active_icon/cateloge_active.png",
        route: "/catalogue",
      },
    ];
  }

  /******************************************************************************
   *
   * @brief navigation routes Data Entry Operator Routes
   * @param none
   * return none
   *
   ******************************************************************************/
  dataEntryOperator() {
    this.navLinks = [
      {
        name: "Niyat",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/niyat-data",
      },
      {
        name: "Digital Niyat Form",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/niyatCount",
      },
    ];
  }
    /******************************************************************************
   *
   * @brief navigation routes QR Code Routes
   * @param none
   * return none
   *
   ******************************************************************************/
    qrCodeRole() {
      this.navLinks = [
        {
          name: "Niyat",
          img: "dashboard.png",
          actimg: "dashboard_active.png",
          route: "/admin/niyat-data-form",
        },
        
      ];
    }

  /******************************************************************************
   *
   * @brief navigation routes template creator Routes
   * @param none
   * return none
   *
   ******************************************************************************/

  templateCreator() {
    this.navLinks = [
      {
        name: "Niyat Template",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/niyat-template",
      },
    ];
  }

  /******************************************************************************
   *
   * @brief navigation routes template creator Routes
   * @param none
   * return none
   *
   ******************************************************************************/

  defaultRoles() {
    this.navLinks = [
      {
        name: "Dashboard",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/dashboard",
      },
      {
        name: "Jawaaiz (Prizes)",
        img: "cat.png",
        actimg: "menu_active_icon/cateloge_active.png",
        route: "/admin/catalogue-reward",
      },
      {
        name: "Approve Niyat",
        img: "niyat_approve.png",
        actimg: "menu_active_icon/approveniyat_active.png",
        route: "/admin/niyat-approve",
      },  
      {
        name: "Report",
        img: "report.png",
        actimg: "menu_active_icon/report_active.png",
        route: "/admin/report",
      }  
    ];
  }

  /******************************************************************************
   *
   * @brief navigation routes Khidmat Ramadaniyah Routes
   * @param none
   * return none
   *
   ******************************************************************************/
  khidmatRamadaniyahRoles() {
    this.navLinks = [
      {
        name: "Dashboard",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/dashboard",
      },
      {
        name: "Report",
        img: "report.png",
        actimg: "menu_active_icon/report_active.png",
        route: "/admin/report",
      }
    ];
  }

  /******************************************************************************
   *
   * @brief navigation routes Super Admin Routes
   * @param none
   * return none
   *
   ******************************************************************************/
  superAdminRoutes() {
    this.navLinks = [
      {
        name: "Dashboard",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/dashboard",
      },
      {
        name: "FMB",
        img: "fmb.png",
        actimg: "menu_active_icon/fmb_active.png",
        route: "/admin/fmb",
      },
      {
        name: "Mahad al Zahra",
        img: "quran.png",
        actimg: "menu_active_icon/hifz_active.png",
        route: "/admin/quran-hifz",
      },
      {
        name: "HQHB",
        img: "hasan.png",
        actimg: "menu_active_icon/hasana_active.png",
        route: "/admin/qardan-hasanah",
      },
      {
        name: "Jawaaiz (Prizes)",
        img: "cat.png",
        actimg: "menu_active_icon/cateloge_active.png",
        route: "/admin/catalogue",
      },
      {
        name: "Report",
        img: "report.png",
        actimg: "menu_active_icon/report_active.png",
        route: "/admin/report",
      },
      {
        name: "Department",
        img: "department.png",
        actimg: "menu_active_icon/department_active.png",
        route: "/admin/department",
      },
      {
        name: "Umoor",
        img: "umoor.png",
        actimg: "menu_active_icon/umoor_active.png",
        route: "/admin/umoor",
      },
      {
        name: "Khidmat Ramadaniyah",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/khidmat-ramadaniyah",
      },
      // {
      //   name: "Approve Niyat",
      //   img: "niyat_approve.png",
      //   actimg: "menu_active_icon/approveniyat_active.png",
      //   route: "/admin/niyat-approve",
      // },
      {
        name: "Niyat Question",
        img: "question.png",
        actimg: "menu_active_icon/niyatouestion_active.png",
        route: "/admin/niyat-question",
      },
      // {
      //   name: "Test",
      //   img: "question.png",
      //   actimg: "question.png",
      //   route: "/admin/test"
      // },
      {
        name: "Niyat Template",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/niyat-template",
      },
      {
        name: "Niyat",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/niyat-data",
      },
      {
        name: "Digital Niyat Form",
        img: "dashboard.png",
        actimg: "dashboard_active.png",
        route: "/admin/niyatCount",
      },
      
    ];
  }
}
