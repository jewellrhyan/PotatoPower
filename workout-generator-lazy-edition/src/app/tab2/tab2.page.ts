import { Component, Injectable } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core'
import { OverlayEventDetail } from '@ionic/core/components';

import { format, parseISO } from 'date-fns';
import { Storage } from '@ionic/storage-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';



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
  day_schedule = []
  
  
  

  constructor(private storage: Storage,private http: HttpClient) {
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)

    
    
    await this.storage.create();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.modal.dismiss([this.name,this.starttime,this.date], 'confirm');
    const formattedDate = format(parseISO(this.date), 'MMM d, yyyy');
    let stuff2 = await this.storage.get(formattedDate)
    let event1= new event(this.name,this.starttime,this.endtime)
    if(stuff2==null){
      await this.storage.set(formattedDate,[event1])
    }
    else{
      stuff2.push(event1)
      await this.storage.set(formattedDate,stuff2)
    }
    this.day_schedule = stuff2
    
    console.log(stuff2) 
    
    let headers = new HttpHeaders({'X-Api-Key': 'bITnT64Du69uoqnCVVs4Pw==Tlcq3HrHFPA3ZUy5'});
    this.http.get<any>('https://api.api-ninjas.com/v1/exercises?muscle='+this.name,{headers:headers}).
    subscribe(data=>{console.log(data)});
    
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
    let stuff2 = await this.storage.get(formattedDate)
    this.day_schedule = stuff2
    
  }

  async clear_day(){
    const formattedDate = format(parseISO(this.date), 'MMM d, yyyy');
    await this.storage.remove(formattedDate)
    this.day_schedule = []
  }
  


  
}

export class event{
  //use this to store events n stuff ( i dunno what we need tho)
  event_name: string = ""
  start_time: string = ""
  end_time: string = ""

  constructor(en: string,st: string,et: string){
    this.event_name = en
    this.start_time = st
    this.end_time = et
    
  }
}













