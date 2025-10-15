import React from 'react';
import './Register.css';

const API_BASE = 'https://face-recognition-backed-deploy.onrender.com';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        };
    }

    onNameChange = (event) => this.setState({ name: event.target.value });
    onEmailChange = (event) => this.setState({ email: event.target.value });
    onPasswordChange = (event) => this.setState({ password: event.target.value });

    onSubmitSignIn = () => {
        const { email, password, name } = this.state;
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address that includes "@" and ends with ".com"');
            return;
        }

        if (!email || !password || !name) {
            alert('Please fill out all fields before registering.');
            return;
        }

        fetch(`${API_BASE}/register`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                } else {
                    alert('Registration failed. Please check your input.');
                }
            })
            .catch(err => {
                console.error('Registration error:', err);
                alert('Something went wrong while registering. Please try again.');
            });
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.onSubmitSignIn();
        }
    };

    render() {
        return (
            <article
                className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center"
                onKeyDown={this.handleKeyDown}
            >
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>

                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input
                                    className="pa2 input-reset ba w-100 normal-input"
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={this.onNameChange}
                                />
                            </div>

                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input
                                    className="pa2 input-reset ba w-100 normal-input"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={this.onEmailChange}
                                />
                            </div>

                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba w-100 normal-input"
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </fieldset>

                        <div>
                            <input
                                onClick={this.onSubmitSignIn}
                                className="b ph3 pv2 input-reset ba b--black bg-white grow pointer f6 dib"
                                type="submit"
                                value="Register"
                            />
                        </div>

                        <div className="lh-copy mt3">
                            <p
                                onClick={() => this.props.onRouteChange('signin')}
                                className="f6 link dim black db pointer"
                            >
                                Already have an account? Sign in
                            </p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Register;

