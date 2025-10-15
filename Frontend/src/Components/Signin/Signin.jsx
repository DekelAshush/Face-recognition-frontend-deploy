import React from 'react';
import './Signin.css';

const API_BASE = 'https://face-recognition-backed-deploy.onrender.com';

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            errorMessage: '',
            showError: false,
        };
    }

    onEmailChange = (event) => this.setState({ signInEmail: event.target.value });
    onPasswordChange = (event) => this.setState({ signInPassword: event.target.value });

    saveAuthTokenInSessions = (token) => {
        window.sessionStorage.setItem('token', token);
    };

    showPopup = (message) => {
        this.setState({ errorMessage: message, showError: true });
        setTimeout(() => this.setState({ showError: false }), 3000);
    };

    onSubmitSignIn = (event) => {
        event.preventDefault(); // prevent reload

        const { signInEmail, signInPassword } = this.state;

        if (!signInEmail || !signInPassword) {
            this.showPopup('⚠ Please enter both email and password.');
            return;
        }

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
                    this.showPopup('❌ Wrong email or password. Please try again.');
                }
            })
            .catch((err) => {
                console.error('Signin error:', err);
                this.showPopup('⚠️ Server error. Please try again later.');
            });
    };

    render() {
        const { onRouteChange } = this.props;
        const { showError, errorMessage } = this.state;

        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure" style={{ position: 'relative' }}>
                        {/* Floating popup */}
                        <div className={`popup ${showError ? 'show' : ''}`}>
                            {errorMessage}
                        </div>

                        <form onSubmit={this.onSubmitSignIn}>
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">Sign In</legend>

                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email-address"
                                        id="email-address"
                                        onChange={this.onEmailChange}
                                        className="input-box w-100"
                                    />
                                </div>

                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        onChange={this.onPasswordChange}
                                        className="input-box w-100"
                                    />
                                </div>
                            </fieldset>

                            <div>
                                <input
                                    type="submit"
                                    value="Sign in"
                                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                />
                            </div>
                        </form>

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
