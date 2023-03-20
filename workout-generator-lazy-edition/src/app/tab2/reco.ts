import { UserProfile } from "../login/login.page"
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { off } from "process";

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
  mood: number = -1 //maybe use
  score:number = 1

  constructor(name:string,description:string,difficulty:number,mood:number){
    this.name = name
    this.description = description
    this.difficulty = difficulty
    this.mood=mood
  }

  compare(a:exercise,b:exercise){
    if(a.score>b.score){
      return 1
    }
    else if(a.score<b.score){
      return -1
    }
    else{
      return 0
    }
  }


}
export class userselections{
    mood: number = 0
    muscle: string = ""
    exeType: number = -1

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

    reset(){
      this.muscFocus = []
      this.exTypeFocus = []
    }
    user_update(user:UserProfile){ //sets as a reset of sorts
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
      this.addExFocus(info.exeType)
    }

    async generate(){
      var workout_plan: exercise[] = []
      console.log("mood is "+this.info.mood)
      switch(+this.info.mood){ //we want a way to priorotize mood based reccomendations
        case 0:// tired
          this.lowerDiff()
          this.addExFocus(1) //strength
          break
        case 1://stress
          this.addExFocus(2) //flexabilty
          
          break
        case 2: //energetic
        console.log("run")
          this.increaseDiff()
          this.addExFocus(0) //cardio
          break

      }
      console.log(this.exTypeFocus)
      workout_plan = await this.get_exercises()
      console.log("workout plan is "+ workout_plan)
      workout_plan = this.score(workout_plan)
      console.log(" new workout plan is "+ workout_plan)
      this.reset()
      return workout_plan
    }

    async get_exercises(){ // gathers and constructs a list of possible exercises for a workout does some pre filtering based on difficuulty
      
      let responce = null
      
      let exercises_list: exercise[] = []
      let offset = Math.floor(Math.random()*4)*10
      var offStr = offset.toString()
      for(const element of this.muscFocus){ //get exercises based on muscle groups requested
        console.log("muscle")
        responce = await fetch('https://api.api-ninjas.com/v1/exercises?muscle='+element+'&difficulty='+this.diff_string+'&offset='+offStr,{headers:{'X-Api-Key': 'bITnT64Du69uoqnCVVs4Pw==Tlcq3HrHFPA3ZUy5'}})
        exercises_list = exercises_list.concat(await responce.json().then((data) => this.formatExercise(data)))
      }
      console.log(this.exTypeFocus+" why empty")
      for(const element of this.exTypeFocus){ // get exercises base on type of exercise
        console.log("types " )
        if(element=="yoga"){
          responce = await fetch('https://yoga-api-nzy4.onrender.com/v1/poses/?level='+this.diff_string)
          exercises_list = exercises_list.concat(await responce.json().then((data) => this.formatYoga(data)))
        }
        responce = await fetch('https://api.api-ninjas.com/v1/exercises?type='+element+'&difficulty='+this.diff_string+'&offset='+offStr,{headers:{'X-Api-Key': 'bITnT64Du69uoqnCVVs4Pw==Tlcq3HrHFPA3ZUy5'}})
        exercises_list = exercises_list.concat(await responce.json().then((data) => this.formatExercise(data)))
      }
      
      console.log("got it" )
      //console.log(exercises_list)
      return exercises_list
    }

    

    

    score(moves:exercise []){ // give remaining exercises a score/weight 
      /* We want to give exercises with most relavency to user
         -At the start we have no info available other then a users profile and questinoaire choices 
          eexercise name: [mood1 mood2 mood ]

        

          -if exercise has been done befor give a score based on mood completed or skipped
          -
      */
      var final_list: exercise[] = []
      console.log("doing magic on size "+moves.length )
      console.log("ex finished "+this.user.exercises_done.size )
      if(this.user.exercises_done.size<10){ //randomely supply exercises to get an idea of what a user likes
        final_list = this.no_score(moves)
        return final_list
        
      }
      console.log("calculating stuff")

      var ex_done = Array.from(this.user.exercises_done.keys())
      var ex_skipped = Array.from(this.user.exercises_skipped.keys())
      for(var i=0;i<moves.length;i++){
        var current_ex = moves[i]
        const done = (element: string | string[]) => element.includes(current_ex.name);
        var good_index = ex_done.findIndex(done) 
        var bad_index = ex_skipped.findIndex(done)
        var x:number = 0
        var y :number = 0
        if(good_index != -1){
          var ex1: number[]  = this.user.exercises_done.get(ex_done[good_index])! //grab most similar exercise
          x = ex1[this.info.mood] // get score of current mood
        }
        if(bad_index != -1){
          var ex2: number[]  = this.user.exercises_skipped.get(ex_skipped[bad_index])! //grab most similar exercise
          y = ex2[this.info.mood] // get score of current mood
        }
        
        moves[i].score += x
        moves[i].score -= y
      }
      moves.sort() // sort by score to get top 5
      console.log(moves)
      
      return moves.slice(0,5)
    }

    no_score(moves:exercise []){ //randomely supply exercises to get an idea of what a user likes
      var final_list: exercise[] = []
      console.log("rand")
        for(var i=0;i<5;i++){
          var x = Math.floor(Math.random()*moves.length)
          if(final_list.includes(moves[x])){ // if it gets a repeat exercise get annother one
            i--
          }
          else{
            final_list.push(moves[x])
          }
        }
      return final_list
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
    addExFocus(extype:number){
      console.log("adding stuff "+extype)
      switch(+extype){
        case -1:
          break
        case 0:
          this.exTypeFocus.push("Cardio")
          break
        case 1:
          this.exTypeFocus.push("Strength")
          break
        case 2:
          this.exTypeFocus.push("stretching")
          this.exTypeFocus.push("yoga")
          break
      }
      console.log(this.exTypeFocus)
      
    }

    formatExercise(exList:any){
      var list: exercise[] = []
      for(const element of exList){
        var move = new exercise(element.name,element.instructions,element.difficulty,this.info.mood)
        list.push(move)
      }
      return list
    }

    formatYoga(exList:any){
      var list: exercise[] = []
      for(const element of exList.poses){
        var move = new exercise(element.english_name,element.pose_description,exList.difficulty,this.info.mood)
        list.push(move)
      }
      
      return list.slice(0,20)
    }

    
}