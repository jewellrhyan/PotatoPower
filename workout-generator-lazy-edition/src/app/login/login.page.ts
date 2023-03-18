import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Tab1Page } from '../tab1/tab1.page';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  Tab: Tab1Page;
  exp: number=0;
  user: UserProfile;

  constructor(private storage: Storage, public navCtrl: NavController) { 
    this.user = new UserProfile();
  }

  async ngOnInit() {
    await this.storage.create();
  }
  

  signIn() {
      // If you app has Tabs, set root to TabsPage
      this.storage.set("User",this.user)
      this.navCtrl.navigateForward('tabs');
      
  }

  Explevel(event: any){
    this.exp=event.detail.value;
    console.log(this.exp)
  }


}

export class UserProfile{ //holds info regarding user used to create recmendations
  name: string
  age: number
  experience: number; // helps set initial "difficulty"

  exercises_done: string[] = [] // some sort of structure that keeps track of exercises a user has completed?
  exercises_skipped: string[] = [] // a structure that holds exercises a user wasnt able to complete

  muscles_targeted: Map<string,number> = new Map<string,number>() //tracks a users targeted muscle groups
  mood: Map<string,number> = new Map<string,number>()  // keeps track of the average mood of the user idealy this can be used to see when they are felling more active

  constructor(name: string = "bob",age: number = 25,experience: number = 0){
    this.name = name
    this.age = age
    this.experience = experience
  

  }
}