import { Component } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core'
import { OverlayEventDetail } from '@ionic/core/components';


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
  acttime: string = "";
  date: string = "";

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss([this.name,this.acttime,this.date], 'confirm');
  
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    console.log(ev.detail)
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }


  handleChange(e: any) {
    console.log( e.detail.value)
    this.date = e.detail.value
    
  }

  clickstuff(){
    console.log("click")

  }
}
