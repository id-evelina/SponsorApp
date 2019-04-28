import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { MatToolbarModule } from '@angular/material';

import { SponsorService } from './sponsor.service';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditSponsorComponent } from './components/edit-sponsor/edit-sponsor.component';
import { EditSocietyComponent } from './components/edit-society/edit-society.component';
import { ProfileSponsorComponent } from './components/profile-sponsor/profile-sponsor.component';
import { ProfileSocietyComponent } from './components/profile-society/profile-society.component';
import { MatchesSponsorComponent } from './components/matches-sponsor/matches-sponsor.component';
import { MatchesSocietyComponent } from './components/matches-society/matches-society.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'profileSociety', component: ProfileSocietyComponent },
  { path: 'profileSponsor', component: ProfileSponsorComponent },
  { path: 'editSociety', component: EditSocietyComponent },
  { path: 'editSponsor', component: EditSponsorComponent },
  { path: 'matchesSociety', component: MatchesSocietyComponent },
  { path: 'matchesSponsor', component: MatchesSponsorComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    EditSponsorComponent,
    EditSocietyComponent,
    ProfileSponsorComponent,
    ProfileSocietyComponent,
    MatchesSponsorComponent,
    MatchesSocietyComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatToolbarModule,
    HttpClientModule
  ],
  providers: [SponsorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
