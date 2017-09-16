import React, {Component} from 'react';

import { apiAuth } from '../feed-wrangler-api';

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.login = this.login.bind(this);
	}
	login(e) {
		e.preventDefault();
		apiAuth(this.email.value, this.password.value);
	}
	render() {
		return (
			<form onSubmit={this.login}>
				<div>
					<input
						ref={(input) => { this.email = input; }}
						name='email'
						type='text'
						placeholder='email address'/>
				</div>
				<div>
					<input
						ref={(input) => { this.password = input; }}
						name='password'
						type='password'
						placeholder='password'/>
				</div>
				<button type='submit'>Login</button>
			</form>

		)
	}
}

export default LoginForm