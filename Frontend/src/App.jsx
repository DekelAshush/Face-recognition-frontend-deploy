import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.jsx';
import Navigation from './Components/Navigation/Navigation.jsx';
import Signin from './Components/Signin/Signin.jsx';
import Register from './Components/Register/Register.jsx';
import Logo from './Components/Logo/Logo.jsx';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.jsx';
import Rank from './Components/Rank/Rank.jsx';
import Profile from './Components/Profile/Profile.jsx';
import Modal from './Components/Modal/Modal.jsx';

import './App.css';

const API_BASE = 'https://face-recognition-backed-deploy.onrender.com';

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isProfileOpen: false,
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
        age: 0,
        pet: ''
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        if (token) {
            fetch(`${API_BASE}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data && data.id) {
                        fetch(`${API_BASE}/profile/${data.id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        })
                            .then(response => response.json())
                            .then(user => {
                                if (user && user.email) {
                                    this.loadUser(user)
                                    this.onRouteChange('home');
                                }
                            })
                    }
                })
                .catch(console.log)
        }
    }

    loadUser = (data) => {
        this.setState({user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }})
    }

    calculateFaceLocation = (data) => {
        if (!data?.results?.[0]?.outputs?.[0]?.data?.regions) return [];

        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);

        return data.results[0].outputs[0].data.regions.map(face => {
            const clarifaiFace = face.region_info.bounding_box;
            return {
                leftCol: clarifaiFace.left_col * width,
                topRow: clarifaiFace.top_row * height,
                rightCol: width - (clarifaiFace.right_col * width),
                bottomRow: height - (clarifaiFace.bottom_row * height)
            };
        });
    };


    displayFaceBox = (boxes) => {
        this.setState({boxes: boxes});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onPictureSubmit = () => {
        console.log("🔹 Detect button clicked");
        console.log("Current input:", this.state.input);

        this.setState({ imageUrl: this.state.input });

        fetch(`${API_BASE}/imageurl`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": window.sessionStorage.getItem("token")
            },
            body: JSON.stringify({ input: this.state.input })
        })
            .then(response => response.json())
            .then(response => {
                console.log("Clarifai API Response:", response);

                if (response && response.results) {
                    // ✅ Update user entries count
                    fetch(`${API_BASE}/image`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": window.sessionStorage.getItem("token")
                        },
                        body: JSON.stringify({ id: this.state.user.id })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, { entries: count }));
                        })
                        .catch(console.log);

                    // ✅ Draw face boxes
                    const boxes = this.calculateFaceLocation(response);
                    console.log("Detected face boxes:", boxes);
                    this.displayFaceBox(boxes);
                } else {
                    console.warn("⚠️ No valid face data in response:", response);
                }
            })
            .catch(err => console.error("❌ Error in onPictureSubmit:", err));
    };


    onRouteChange = (route) => {
        if (route === 'signout') {
            return this.setState(initialState)
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }

    toggleModal = () => {
        this.setState(state => ({
            ...state,
            isProfileOpen: !state.isProfileOpen,
        }));
    }

    render() {
        const { isSignedIn, imageUrl, route, boxes, isProfileOpen, user } = this.state;
        return (
            <div className="App">
                <ParticlesBg type="circle" bg={true} />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal}/>
                {
                    isProfileOpen &&
                    <Modal>
                        <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} loadUser={this.loadUser} />
                    </Modal>
                }
                { route === 'home'
                    ?<div>
                        <Logo />

                        <div className="top-section">
                            <Rank
                                name={this.state.user.name}
                                entries={this.state.user.entries}
                            />
                            <ImageLinkForm
                                onInputChange={this.onInputChange}
                                onPictureSubmit={this.onPictureSubmit}
                            />
                        </div>

                        <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
                    </div>
                    : (
                        route === 'signin'
                            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
}

export default App;