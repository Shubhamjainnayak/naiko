
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'ratings',
            loadChildren: () =>
              import('../rating-list/rating-list.module').then(m => m.RatingListPageModule)
          }
        ]
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../orders/orders.module').then(m => m.OrdersPageModule)
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'job_posting',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../job_posting/job.module').then(m => m.JobsPageModule)
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule),
            canActivate: [AuthGuard]},
            {
              path: 'about',
              loadChildren: () =>
                import('../about/about.module').then(m => m.AboutPageModule)
            },
            {
              path: 'contacts',
              loadChildren: () =>
                import('../contacts/contacts.module').then(m => m.ContactsPageModule)
            },
            {
              path: 'faqs',
              loadChildren: () =>
                import('../faqs/faqs.module').then(m => m.FaqsPageModule)
            },
            {
              path: 'help',
              loadChildren: () =>
                import('../help/help.module').then(m => m.HelpPageModule)
            },
            {
              path: 'profile',
              loadChildren: () =>
                import('../profile/profile.module').then(m => m.ProfilePageModule),
              canActivate: [AuthGuard]
            }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
