import React from 'react';
import './Register.css';

const API_BASE = 'https://face-recognition-backed-deploy.onrender.com';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', name: '' };
    }

    onNameChange = e => this.setState({ name: e.target.value });
    onEmailChange = e => this.setState({ email: e.target.value });
    onPasswordChange = e => this.setState({ password: e.target.value });

    handleKeyPress = e => {
        if (e.key === 'Enter') this.onSubmitSignIn();
    };

    onSubmitSignIn = () => {
        const { email, password, name } = this.state;
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

        if (!emailRegex.test(email)) return alert('Invalid email');
        if (!email || !password || !name) return alert('Please fill all fields');

        fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        })
            .then(res => res.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                } else alert('Registration failed');
            })
            .catch(() => alert('Something went wrong'));
    };

    render() {
        return (
            <article className="auth-container">
                <main className="auth-main" onKeyDown={this.handleKeyPress}>
                    <h1>Register</h1>

                    <label>Name</label>
                    <input
                        className="auth-input"
                        type="text"
                        onChange={this.onNameChange}
                    />

                    <label>Email</label>
                    <input
                        className="auth-input"
                        type="email"
                        onChange={this.onEmailChange}
                    />

                    <label>Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        onChange={this.onPasswordChange}
                    />

                    <button className="auth-btn" onClick={this.onSubmitSignIn}>
                        Register
                    </button>

                    <div className="auth-switch">
                        <p>
                            Already have an account?{' '}
                            <span onClick={() => this.props.onRouteChange('signin')}>
                                Sign in
                            </span>
                        </p>
                    </div>
                </main>
            </article>
        );
    }
}

export default Register;
