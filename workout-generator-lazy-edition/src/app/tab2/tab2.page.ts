import { Component, Injectable } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core'
import { OverlayEventDetail } from '@ionic/core/components';

import { format, parseISO } from 'date-fns';
import { Storage } from '@ionic/storage-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

import {event, userselections} from './reco';
import { UserProfile } from '../login/login.page';


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
  progress = .76;
  com = 100;
  currentUser: any;
  event_selection: userselections = new userselections()
  
  

  constructor(private storage: Storage,private http: HttpClient) {
    this.currentUser = null;
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)

    await this.storage.create();
    this.currentUser = await this.storage.get("User");
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.modal.dismiss([this.name,this.starttime,this.date], 'confirm');
    const formattedDate = format(parseISO(this.date), 'MMM d, yyyy');
    
    
    
    
    let headers = new HttpHeaders({'X-Api-Key': 'bITnT64Du69uoqnCVVs4Pw==Tlcq3HrHFPA3ZUy5'});
    this.http.get<any>('https://api.api-ninjas.com/v1/exercises',{headers:headers}).
    subscribe(data=>{this.day_schedule=data,this.com=data.length,this.storage.set(formattedDate,this.day_schedule),console.log(data)});

    
    console.log(this.storage.get("User"))
    
    

    // let headers = new HttpHeaders({'X-Api-Key': 'bITnT64Du69uoqnCVVs4Pw==Tlcq3HrHFPA3ZUy5'});
    // this.http.get<any>('https://yoga-api-nzy4.onrender.com/v1/categories').
    // subscribe(data=>{console.log(data)});
    
  }

  Moodselect(event: any){
    var choice:any = event.detail.value
    this.event_selection.mood = choice

  }

  typeSelect(event: any){
    var choice:any = event.detail.value
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
      this.com=this.day_schedule.length
    }
    
    
  }

  async clear_day(){
    const formattedDate = format(parseISO(this.date), 'MMM d, yyyy');
    await this.storage.remove(formattedDate)
    this.day_schedule = []
  }
  
  async finish_exercise(exercise: never){
    console.log('done')
    let index = this.day_schedule.indexOf(exercise)
    //this.currentUser.exercises_done.push(this.day_schedule[index]) // add exercise to ones fnished
    this.day_schedule.splice(index,1); // update exercise list for that day to not include finished exercise
    await this.storage.set(this.formDate,this.day_schedule)
    
  }

  async skip_exercise(exercise: never){
    console.log('skip')
    let index = this.day_schedule.indexOf(exercise)
    //this.currentUser.exercises_skipped.push(this.day_schedule[index]) // add exercise to ones fnished
    this.day_schedule.splice(index,1);
    await this.storage.set(this.formDate,this.day_schedule)
    
  }


  
}















