import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import * as fs from "fs";
import * as path from "path";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user: any = null;

  constructor() {
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
  }

  async signIn() {
    this.user = await GoogleAuth.signIn();
    console.log('user: ', this.user);
  }

  async refresh() {
    const authCode = await GoogleAuth.refresh();
    console.log('refresh: ', authCode);
    // { accessToken: 'xxx', idToken: 'xxx' }
  }

  async signOut() {
    await GoogleAuth.signOut();
    this.user = null;
  }

}
