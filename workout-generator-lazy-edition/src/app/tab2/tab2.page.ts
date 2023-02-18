import { Component } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core'
import { OverlayEventDetail } from '@ionic/core/components';

import { format, parseISO } from 'date-fns';
import { Storage } from '@ionic/storage-angular';


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
  
  
  
  constructor(private storage: Storage) {
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
    let event1= new event(this.name,this.starttime)
    if(stuff2==null){
      await this.storage.set(formattedDate,[event1])
    }
    else{
      stuff2.push(event1)
      await this.storage.set(formattedDate,stuff2)
    }
    //this.storage.set(formattedString,[1,2,3])
    this.day_schedule = stuff2
    console.log(stuff2) 
    

    
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


  
}

class event{
  event_name: string = ""
  time: string = ""

  constructor(en: string,t: string){
    this.event_name = en
    this.time = t
  }

}

