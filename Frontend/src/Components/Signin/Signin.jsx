import React from 'react';
import './Signin.css';

const API_BASE = 'https://face-recognition-backed-deploy.onrender.com';

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            errorMessage: '', // ✅ new state for popup message
        };
    }

    onEmailChange = (event) => this.setState({ signInEmail: event.target.value });
    onPasswordChange = (event) => this.setState({ signInPassword: event.target.value });

    saveAuthTokenInSessions = (token) => {
        window.sessionStorage.setItem('token', token);
    };

    onSubmitSignIn = () => {
        const { signInEmail, signInPassword } = this.state;

        // ✅ Validate empty fields
        if (!signInEmail || !signInPassword) {
            this.setState({ errorMessage: '⚠️ Please enter both email and password.' });
            return;
        }

        // ✅ Clear previous error
        this.setState({ errorMessage: '' });

        // Send login request
        fetch(`${API_BASE}/signin`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.success === true) {
                    this.saveAuthTokenInSessions(data.token);
                    this.props.loadUser(data.user);
                    this.props.onRouteChange('home');
                } else {
                    // ✅ Show popup when wrong email or password
                    this.setState({ errorMessage: '❌ Wrong email or password. Please try again.' });
                }
            })
            .catch((err) => {
                console.error('Signin error:', err);
                this.setState({ errorMessage: '⚠️ Server error. Please try again later.' });
            });
    };

    render() {
        const { onRouteChange } = this.props;
        const { errorMessage } = this.state;

        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">

                        {/* ✅ Popup message box */}
                        {errorMessage && (
                            <div className="bg-washed-red pa2 mb3 br2 tc b">
                                {errorMessage}
                            </div>
                        )}

                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>

                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={this.onEmailChange}
                                />
                            </div>

                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
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
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Sign in"
                            />
                        </div>

                        <div className="lh-copy mt3">
                            <p
                                onClick={() => onRouteChange('register')}
                                className="f6 link dim black db pointer"
                            >
                                Register
                            </p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signin;
