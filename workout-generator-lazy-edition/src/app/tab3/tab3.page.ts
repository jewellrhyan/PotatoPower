
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  items: any[] = [];
  keys: string[] = [];
  search_results: any[] = []

  async ngOnInit() {
    await this.generateItems();
  }


  private async generateItems() {
    const count = this.items.length + 1;
   
      var responce = await fetch('https://exercisedb.p.rapidapi.com/exercises',{headers:{'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      'X-RapidAPI-Key': 'c59bca3a32msh3b028cd7612b794p147a04jsnfa225bfcf515'}})
      const data = await responce.json()
      this.keys = Object.keys(data)
      this.items = data
      console.log(this.items[0])
      //this.items.push(searchedExercises); //this is where we would push all the exercises but idk how to connect the api
    
  }

  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  public data = ['items'];
  public results = [...this.data];

  handleChange(event: any) {
    console.log("hello")
    
    const query = event.target.value.toLowerCase();
    console.log(query)
    this.handle_search(query)
    // this.results = this.data.filter(d => d.toLowerCase().indexOf(query) > -1);
    
  }

  handle_search(query:string){
    const searchedExercises = this.items.filter(
      (item) => item.name.toLowerCase().includes(query)
             || item.target.toLowerCase().includes(query)
             || item.equipment.toLowerCase().includes(query)
             || item.bodyPart.toLowerCase().includes(query),
    );
    this.search_results =searchedExercises
  }

}