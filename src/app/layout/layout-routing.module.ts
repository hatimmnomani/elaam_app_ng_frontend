import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleAuthorizeGuard } from "../auth/guard/role-authorize/role-authorize.guard";
import { ContentLayoutComponent } from "./content-layout/content-layout/content-layout.component";
import { CatalogueRedeemComponent } from "./modules/mumin-dashboard/component/catalogue-redeem/catalogue-redeem.component";
import { NiyatInformationComponent } from "./modules/mumin-dashboard/component/niyat-information/niyat-information.component";


const layout_routes: Routes = 
  [
    {
      path: "",
      component: ContentLayoutComponent,
      children: [
        { path: "", pathMatch: "full", redirectTo: "admin/dashboard" },

        {
          path: "admin/dashboard",
          loadChildren: () =>
            import("./modules/dashboard/dashboard.module").then(
              (m) => m.DashboardModule,
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin", "Jamiat Masool", "Aamil", "Muavin Aamil", "Dept Head", "Umoor Head", "Umoor Coordinator", "Khidmat Ramadaniyah"] }
        },
        {
          path: "admin/niyat-approve",
          loadChildren: () =>
            import("./modules/niyat-approve/niyat-approve.module").then(
              (m) => m.NiyatApproveModule,
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin", "Jamiat Masool", "Aamil", "Muavin Aamil", "Dept Head", "Umoor Head", "Umoor Coordinator", "Khidmat Ramadaniyah"] }
        },

        {
          path: "admin/fmb",
          loadChildren: () =>
            import("./modules/fmb/fmb.module").then((m) => m.FMBModule),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },

        {
          path: "admin/catalogue",
          loadChildren: () =>
            import("./modules/catalogue/catalogue.module").then(
              (m) => m.CatalogueModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },
        {
          path: "admin/umoor",
          loadChildren: () =>
            import("./modules/umoor/umoor.module").then((m) => m.UmoorModule),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },
        {
          path: "admin/quran-hifz",
          loadChildren: () =>
            import("./modules/quran-hifz/quran-hifz.module").then(
              (m) => m.QuranHifzModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },
        {
          path: "admin/qardan-hasanah",
          loadChildren: () =>
            import("./modules/qardan-hasanah/qardan-hasanah.module").then(
              (m) => m.QardanHasanahModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },

        {
          path: "admin/department",
          loadChildren: () =>
            import("./modules/department/department.module").then(
              (m) => m.DepartmentModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },
        {
          path: "admin/umoor",
          loadChildren: () =>
            import("./modules/umoor/umoor.module").then((m) => m.UmoorModule),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },
        {
          path: "admin/niyat-question",
          loadChildren: () =>
            import("./modules/niyat-question/niyat-question.module").then(
              (m) => m.NiyatQuestionModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },
        {
          path: "admin/niyat-data",
          loadChildren: () =>
            import("./modules/niyat-data/niyat-data.module").then(
              (m) => m.NiyatDataModule
            ),
          canActivate: [RoleAuthorizeGuard],
          // data: { roles: ["Super Admin", "Mumin", "Jamiat Masool", "Aamil", "Muavin Aamil", "Dept Head", "Umoor Head", "Umoor Coordinator"] }
          data: { roles: ["Super Admin", "Data Entry Operator"] }
        },
        {
          path: "admin/khidmat-ramadaniyah",
          loadChildren: () =>
            import("./modules/khidmat-ramadaniyah/khidmat-ramadaniyah.module").then(
              (m) => m.KhidmatRamadaniyahModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },

        {
          path: 'admin/niyat-template',
          loadChildren: () => import('./modules/niyat-template/niyat-template.module').then(m => m.NiyatTemplateModule),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin", "Template Creator"] }
        },
        {
          path: "admin/report",
          loadChildren: () =>
            import("./modules/report/report.module").then(
              (m) => m.ReportModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin", "Jamiat Masool", "Aamil", "Muavin Aamil", "Dept Head", "Umoor Head", "Umoor Coordinator", "Khidmat Ramadaniyah"] }
        },
        {
          path: "admin/test",
          loadChildren: () =>
            import("./modules/test/test.module").then((m) => m.TestModule),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin"] }
        },
        {
          path: "mumin-dashboard",
          loadChildren: () =>
            import("./modules/mumin-dashboard/mumin-dashboard.module").then((m) => m.MuminDashboardModule),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Mumin"] }
        },
        {
          path: "catalogue",
          component: CatalogueRedeemComponent,
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Mumin"] }
        },
        {
          path: "notification",
          loadChildren: () =>
            import("./modules/notification/notification.module").then(
              (m) => m.NotificationModule
            ),
        },
        {
          path: "send-message",
          loadChildren: () =>
            import("./modules/send-message/send-message.module").then(
              (m) => m.SendMessageModule
            ),
        },
        {
          path: 'niyat-information/:id',
          component: NiyatInformationComponent,
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Mumin", "Super Admin", "Jamiat Masool", "Aamil", "Muavin Aamil", "Dept Head", "Umoor Head", "Umoor Coordinator", "Khidmat Ramadaniyah"] }
        },
        {
          path: "admin/catalogue-reward",
          loadChildren: () =>
            import("./modules/approver-catalogue/approver-catalogue.module").then(
              (m) => m.ApproverCatalogueModule,
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin", "Jamiat Masool", "Aamil", "Muavin Aamil", "Dept Head", "Umoor Head", "Umoor Coordinator"] }
        },
        {
          path: "admin/niyatCount",
          loadChildren: () =>
            import("./modules/niyat-data-count/niyat-data-count.module").then(
              (m) => m.NiyatDataCountModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin", "Data Entry Operator"] }
        },
        {
          path: "admin/niyat-data-form",
          loadChildren: () =>
            import("./modules/niyat-data/niyat-data.module").then(
              (m) => m.NiyatDataModule
            ),
          canActivate: [RoleAuthorizeGuard],
          data: { roles: ["Super Admin", "Mumin", "Jamiat Masool", "Aamil", "Muavin Aamil", "Dept Head", "Umoor Head", "Umoor Coordinator", "Khidmat Ramadaniyah"] }
        }
      ],
      
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(layout_routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule { }
