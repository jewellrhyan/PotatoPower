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
  
  

  exercises_done: Map<string,number[]> = new Map<string,number[]>()// some sort of structure that keeps track of exercises a user has completed?
  exercises_skipped: Map<string,number[]> = new Map<string,number[]>()// a structure that holds exercises a user wasnt able to complete

  // muscles_targeted: Map<string,number> = new Map<string,number>() //tracks a users targeted muscle groups
  // mood: Map<string,number> = new Map<string,number>()  // keeps track of the average mood of the user idealy this can be used to see when they are felling more active

  constructor(name: string = "bob",age: number = 25,experience: number = 0){
    this.name = name
    this.age = age
    this.experience = experience
  }

  add_ex_done=(name:string,mood:number)=>{
    /* The idea here is that each exercise will be done during a certain mood
       ex.) if a user completes an exercise while feeling energetic we'll keep track of that
    */
    console.log("pain")
    if(!this.exercises_done.has(name)){
      this.exercises_done.set(name,[0,0,0]) // if exercise hasnt been added make its entry
    }
    let moods_done:number[]= this.exercises_done.get(name)! // get mood list for exercise
    moods_done[mood] += 1 // increment mood count
    this.exercises_done.set(name,moods_done)

  }

  public add_ex_skipped=(name:string,mood:number)=>{
    /* The idea here is that each exercise will be done during a certain mood
       ex.) if a user skips an exercise while feeling energetic we'll keep track of that
       [0 1.5 0]
       [1  3   0]
       [2   0  1]
    */
   console.log("why")
    if(!this.exercises_skipped.has(name)){
      this.exercises_skipped.set(name,[0,0,0]) // if exercise hasnt been added make its entry
    }
    let moods_done:number[]= this.exercises_skipped.get(name)! // get mood list for exercise
    moods_done[mood] += 1 // increment mood count
    this.exercises_skipped.set(name,moods_done)

  }

  public ok(): void{
    console.log("no") 
  }
  
}

export function add_ex_done(exercises_done:Map<string,number[]>,name:string,mood:number){
  /* The idea here is that each exercise will be done during a certain mood
     ex.) if a user completes an exercise while feeling energetic we'll keep track of that
  */
  
  if(!exercises_done.has(name)){
    exercises_done.set(name,[0,0,0]) // if exercise hasnt been added make its entry
  }
  
  let moods_done:number[]= exercises_done.get(name)! // get mood list for exercise
  moods_done[mood] += 1 // increment mood count
  exercises_done.set(name,moods_done)
  console.log("pain "+exercises_done.size)
  return exercises_done

}

export function add_ex_skipped(exercises_skipped:Map<string,number[]>,name:string,mood:number){
  /* The idea here is that each exercise will be done during a certain mood
     ex.) if a user skips an exercise while feeling energetic we'll keep track of that
     [0 1.5 0]
     [1  3   0]
     [2   0  1]
  */
 console.log("why")
  if(!exercises_skipped.has(name)){
    exercises_skipped.set(name,[0,0,0]) // if exercise hasnt been added make its entry
  }
  let moods_done:number[]= exercises_skipped.get(name)! // get mood list for exercise
  moods_done[mood] += 1 // increment mood count
  exercises_skipped.set(name,moods_done)
  return exercises_skipped
}
