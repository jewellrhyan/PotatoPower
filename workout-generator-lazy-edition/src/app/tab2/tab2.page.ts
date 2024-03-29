import { Component, Injectable } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core'
import { OverlayEventDetail } from '@ionic/core/components';

import { format, parseISO } from 'date-fns';
import { Storage } from '@ionic/storage-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { LoadingController } from '@ionic/angular';

import {event, userselections,BigBrain,exercise} from './reco';
import { UserProfile,add_ex_skipped,add_ex_done } from '../login/login.page';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page {
  logs: string[] = []; 
  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string = "";
  starttime: string = "";
  endtime: string = "";
  date: string = "";
  formDate: string =""
  day_schedule = []
  progress = 0;
  progressFormated = 0;
  com = 5;
  currentUser: UserProfile = new UserProfile();
  event_selection: userselections = new userselections()
  recommender: any 

 
  

  constructor(private storage: Storage,private http: HttpClient,private loadingCtrl: LoadingController) {
    
   
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
 
    await this.storage.create();
    this.currentUser = await this.storage.get("User");
    this.recommender =  new BigBrain(this.currentUser,this.http)
    
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.modal.dismiss([this.name,this.starttime,this.date], 'confirm');
    const formattedDate = format(parseISO(this.date), 'MMM d, yyyy');
    
    
    const loading = await this.loadingCtrl.create({
      message: '<ion-img src="/assets/spud.gif" alt="loading..."></ion-img>' ,
      
    })
    loading.present()
    
   

    
    //console.log(this.storage.get("User"))
    this.recommender.set_info(this.event_selection)
    this.recommender.user_update(this.currentUser)
    this.day_schedule = await this.recommender.generate()
    console.log("final schedule is: "+ this.day_schedule)
    this.storage.set(formattedDate,this.day_schedule)
    loading.dismiss()
    

    
    
  }

  Moodselect(event: any){
    var choice:any = event.detail.value
    this.event_selection.mood = choice

  }

  typeSelect(event: any){
    var choice:number = event.detail.value
    this.event_selection.exeType = choice

  }

  muscleSelect(event: any){
    var choice:any = event.detail.value
    this.event_selection.muscle = choice

  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    console.log(ev.detail)

    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  async handleChange(e: any) {
    console.log( e.detail.value)
    this.date = e.detail.value
    const formattedDate = format(parseISO(this.date), 'MMM d, yyyy');
    this.formDate = formattedDate
    let stuff2 = await this.storage.get(formattedDate)
    this.day_schedule = stuff2
    if(this.day_schedule !=null ){
      this.com=5
      this.progress = (5-this.day_schedule.length)*.2
      this.progressFormated = 5-this.day_schedule.length
    }
    
    
  }

  async clear_day(){
    const formattedDate = format(parseISO(this.date), 'MMM d, yyyy');
    await this.storage.remove(formattedDate)
    this.day_schedule = []
    this.progress = 0  
    this.progressFormated = 0
  }
  
  async finish_exercise(exer: never){
    console.log('done')
    let index = this.day_schedule.indexOf(exer)
    let ex: exercise = this.day_schedule[index]
    //this.currentUser.exercises_done.push(this.day_schedule[index]) // add exercise to ones fnished
    this.day_schedule.splice(index,1); // update exercise list for that day to not include finished exercise
    await this.storage.set(this.formDate,this.day_schedule)

    
    this.currentUser.exercises_done = add_ex_done(this.currentUser.exercises_done,ex.name,ex.mood)
    console.log("stufffff "+this.currentUser.exercises_done)
    this.progress = (5-this.day_schedule.length)*.2
    this.progressFormated = 5-this.day_schedule.length

    
  }

  async skip_exercise(exercise: never) {
    console.log('skip')
    let index = this.day_schedule.indexOf(exercise)
    let ex: exercise = this.day_schedule[index]
    //this.currentUser.exercises_skipped.push(this.day_schedule[index]) // add exercise to ones fnished
    this.day_schedule.splice(index,1);
    await this.storage.set(this.formDate,this.day_schedule)
    this.currentUser.exercises_skipped = add_ex_skipped(this.currentUser.exercises_skipped,ex.name,ex.mood)
    this.progress = (5-this.day_schedule.length)*.2
    this.progressFormated = 5-this.day_schedule.length
  }


  
}















