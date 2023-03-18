import { UserProfile } from "../login/login.page"
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

export class event{
    //use this to store events n stuff ( i dunno what we need tho)
    event_name: string = ""
    start_time: string = ""
    end_time: string = ""
  
    constructor(en: string){
      this.event_name = en
      
      
    }
  }

export class exercise{
  description: string;
  name: string;
  difficulty: number;
  score:number = 1

  constructor(name:string,description:string,difficulty:number){
    this.name = name
    this.description = description
    this.difficulty = difficulty
  }


}
export class userselections{
    mood: number = 0
    muscle: string = ""
    exeType: string = ""

    constructor(){
    }


}
export class BigBrain{

    info: userselections  //idealy this'll be a class or structure to hold the info
    user: UserProfile
    mood_module: string = ""
    difficuly: number
    diff_string: string
    muscFocus: string[] = [] //muscles a user wants to work on
    exTypeFocus: string[] = [] //type of exercise a user wants to work on
    

    //difficulty is spread into 3 categories
    // 0 - 2 reps of 10 beginner
    // 1 - 3 reps of 10 intermediate
    // 2 - 4 reps of 10 expert

    // mood determines exercise type priority
    //  2 energetic - more cardio difficulty up
    //  1 stressed - stretching and fleaxability
    //  0 tired - lowers difficulty and adds some strength training
  

    constructor(user:UserProfile,private http: HttpClient){ // this will be the info that a user enters on the question page when getting a workout for the day
      
        this.user = user
        this.difficuly = this.user.experience
        switch(this.difficuly){ 
          case 0:
            this.diff_string="beginner"
            break
          case 1:
            this.diff_string="intermediate"
            break
          case 2:
            this.diff_string="expert"
            break
        }
        
    }

    set_info(info: userselections){ // sets info from form that the user filled out for that day
      this.info = info 
      this.muscFocus.push(info.muscle)
      this.exTypeFocus.push(info.exeType)
    }

    async generate(){
      var workout_plan: string[] = []
      switch(this.info.mood){ //we want a way to priorotize mood based reccomendations
        case 0:
          this.lowerDiff()
          this.addExFocus("strength")
          break
        case 1:
          this.addExFocus("stretching")
          this.addExFocus("Yoga")
          break
        case 2:
          this.increaseDiff()
          this.addExFocus("cardio")
          break

      }
      this.score(await this.get_exercises()) 
      return workout_plan
    }

    async get_exercises(){ // gathers and constructs a list of possible exercises for a workout does some pre filtering based on difficuulty
      let responce = null
      let exercises_list: exercise[] = []
      for(const element of this.muscFocus){
        responce = await fetch('https://api.api-ninjas.com/v1/exercises?muscle='+element+'&difficulty='+this.diff_string,{headers:{'X-Api-Key': 'bITnT64Du69uoqnCVVs4Pw==Tlcq3HrHFPA3ZUy5'}})
        exercises_list = exercises_list.concat(await responce.json().then((data) => this.formatExercise(data)))
      }
      for(const element of this.exTypeFocus){
        responce = await fetch('https://api.api-ninjas.com/v1/exercises?type='+element+'&difficulty='+this.diff_string,{headers:{'X-Api-Key': 'bITnT64Du69uoqnCVVs4Pw==Tlcq3HrHFPA3ZUy5'}})
        exercises_list = exercises_list.concat(await responce.json().then((data) => this.formatExercise(data)))
      }
      console.log("got it" )
      console.log(exercises_list)
      return exercises_list
    }

    

    score(moves:exercise []){ // give remaining exercises a score/weight 
      /* We want to give exercises with most relavency to user
         -At the start we have no info available other then a users profile and questinoaire choices 
      */
      for(const element of moves){
        element.score = 1 //reset score of every exercise just in case 
        
      }
    }

    lowerDiff(){
      if(this.difficuly!=0){
        this.difficuly -= 1
      }
      switch(this.difficuly){ 
        case 0:
          this.diff_string="beginner"
          break
        case 1:
          this.diff_string="intermediate"
          break
        case 2:
          this.diff_string="expert"
          break
      }
    }
    increaseDiff(){
      if(this.difficuly<2){
        this.difficuly += 1
      }
      switch(this.difficuly){ 
        case 0:
          this.diff_string="beginner"
          break
        case 1:
          this.diff_string="intermediate"
          break
        case 2:
          this.diff_string="expert"
          break
      }
    }
    addExFocus(extype:string){
      this.muscFocus.push(extype)
    }

    formatExercise(exList:any){
      var list: exercise[] = []
      for(const element of exList){
        var move = new exercise(element.name,element.instructions,element.difficulty)
        list.push(move)
      }
      return list
    }
}