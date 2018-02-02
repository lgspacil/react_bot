import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      location: null,
      radio: null,
      url: {maps: "https://maps.googleapis.com/maps/api/geocode/json?&address="},
      response: ''
    }
  }

  componentDidMount(){
    console.log('hey I mouted');
  }

  

  handelSubmit(e){
    let current_url;
    if(this.state.radio === 'weather'){
      current_url = "http://api.openweathermap.org/data/2.5/weather?q="+this.refs.text.value+"&units=imperial&APPID=bb928725dc4b57216334e06c6fbafa99";
      $.ajax({
        type: 'GET',
        dataType: 'json',
        cache: false,
        url: current_url,
        success: function(data){
          console.log('i got something back!', data)
          let response = 'The weather in '+data.name+' is currently '+data.main.temp+'. The maximum temperature today will be '+data.main.temp_max+' while the minimum will be '+data.main.temp_min
          this.setState({response: response})
        }.bind(this),
        error: function(err){
          console.log('there was an error', err)
          this.setState({response: 'I am sorry I was not able to understand that, please try again'})
        }.bind(this)
      })
    } else if(this.state.radio === 'latlong'){
      current_url = "https://maps.googleapis.com/maps/api/geocode/json?&address="+this.refs.text.value;
      $.ajax({
        type: 'GET',
        dataType: 'json',
        cache: false,
        url: current_url,
        success: function(data){
          console.log('i got something back!', data)
          if(data.error_message){
            let response = "you have reached the daily request quota for this, try again tomorrow"
            this.setState({response: response})
          }else{
            let response = "The coordinates for "+data.results[0].formatted_address+" is lat: "+data.results[0].geometry.location.lat+" lng: "+data.results[0].geometry.location.lng
          this.setState({response: response})
          }
        }.bind(this),
        error: function(err){
          console.log('there was an error', err)
          this.setState({response: 'I am sorry I was not able to understand that, please try again'})
        }.bind(this)
      })
    }else if(this.state.radio === 'joke'){
      if(this.refs.text1.value.length > 0 && this.refs.text2.value.length > 0){
        current_url = "https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke"
        $.ajax({
          type: 'GET',
          dataType: 'json',
          cache: false,
          url: current_url,
          success: function(data){
            console.log('i got something back!', data)
            let response = "Setup: "+data.setup+" ------------ Punchline: "+data.punchline
            this.setState({response: response})
          }.bind(this),
          error: function(err){
            console.log('there was an error', err)
            this.setState({response: 'I am sorry I was not able to understand that, please try again'})
          }.bind(this)
        })
      }else{
        this.setState({response: 'You need to tell me a joke before you can hear one!'})
      }
    }
      
    e.preventDefault();
  }

  onRadioChange(e){
    console.log('the value is: ', e.currentTarget.value)
    this.setState({radio: e.currentTarget.value})
  }

  reloadPage(){
    window.location.reload();
  }

  render() {

    let dialog = ['Hello, what can I help you with today?']

    let radios;
    if(this.state.radio === null){
      radios = <form className='radio'>
          <input type="radio" name="gender" value="weather"  onChange={this.onRadioChange.bind(this)}/> Weather <br />
          <input type="radio" name="gender" value="latlong" onChange={this.onRadioChange.bind(this)}/> Longitude and Latitude of any location <br />
          <input type="radio" name="gender" value="joke"  onChange={this.onRadioChange.bind(this)}/> I want to hear a random joke!  
        </form> 
    }

    let selection;
    if(this.state.radio === 'weather'){
      selection = <p className='instruction'>Please type in the name of the city you wish to see the temperature in</p>
    }else if(this.state.radio === 'latlong'){
      selection = <p className='instruction'>Please type in the location you wish to know the coordinates for</p>
    }else if(this.state.radio === 'joke'){
      selection = <p className='instruction'>If you tell me a joke, I'll tell you one!</p>
    }

    let input;
    if(this.state.radio === 'weather'){
      input = <p>
        <input className='myText' type='text' ref='text' placeholder='Paris'/>
        <button className='myButton' onClick={this.handelSubmit.bind(this)}>Submit City!</button> 
        </p>
    }else if(this.state.radio === 'latlong'){
      input = <p>
        <input className='myText' type='text' ref='text' placeholder='eiffel tower'/>
        <button className='myButton' onClick={this.handelSubmit.bind(this)}>Submit Location!</button> 
        </p>
    } else if(this.state.radio === 'joke'){
      input = <p>
        Joke: <input className='myText2' type='text' ref='text1' placeholder='why did the chicken cross the road?' />
        PunchLine: <input className='myText2' type='text' ref='text2' placeholder='To get to the other side' />
        <button className='myButton' onClick={this.handelSubmit.bind(this)}>Submit Joke!</button>
        </p>
    }

    let response;
    if(this.state.response !== ''){
      response = <p className='response'>{this.state.response}</p>
    }

    let reload_page;
    if(this.state.response !== ''){
      reload_page = <p>Would you like to make another search?
        <button className='myButton2' onClick={this.reloadPage.bind(this)}>Yes</button>
        <button className='myButton3'>No</button>
      </p>
    }

    return (
      <div className="App">
        <strong><h1>Hello, What do you need help with today?</h1></strong>
        {radios}
        {selection}
        {input}
        {response}
        {reload_page}
      </div>
    );
  }
}

export default App;
