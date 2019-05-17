import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule, MatTooltipModule, MatSnackBarModule, MatTableModule, MatButtonModule, MatGridListModule, MatDividerModule, MatCardModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatRadioModule } from '@angular/material';

import { SponsorService } from './sponsor.service';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileSponsorComponent } from './components/profile-sponsor/profile-sponsor.component';
import { ProfileSocietyComponent } from './components/profile-society/profile-society.component';
import { MatchesSponsorComponent } from './components/matches-sponsor/matches-sponsor.component';
import { MatchesSocietyComponent } from './components/matches-society/matches-society.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EditSocietyComponent } from './components/edit-society/edit-society.component';
import { EditSponsorComponent } from './components/edit-sponsor/edit-sponsor.component';
import { NumbersOnlyDirective } from './numbers-only.directive';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'profileSociety/:id', component: ProfileSocietyComponent },
  { path: 'profileSponsor/:id', component: ProfileSponsorComponent },
  { path: 'editSociety/:id', component: EditSocietyComponent },
  { path: 'editSponsor/:id', component: EditSponsorComponent },
  { path: 'matchesSociety/:id', component: MatchesSocietyComponent },
  { path: 'matchesSponsor/:id', component: MatchesSponsorComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileSponsorComponent,
    ProfileSocietyComponent,
    MatchesSponsorComponent,
    MatchesSocietyComponent,
    WelcomeComponent,
    EditSocietyComponent,
    EditSponsorComponent,
    NumbersOnlyDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatToolbarModule,
    MatTooltipModule, 
    MatSnackBarModule, 
    MatButtonModule, 
    MatGridListModule, 
    MatDividerModule, 
    MatCardModule, 
    MatSlideToggleModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatOptionModule, 
    MatSelectModule, 
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule
  ],
  providers: [SponsorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
