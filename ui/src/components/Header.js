import React, {Component} from 'react';

class Header extends Component {
	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<a className="navbar-brand" href="/">URL Shortner</a>
				<ul className="navbar-nav ml-auto">
					<li className="nav-item">
						<a
							className="btn btn-danger"
							href="/"
							onClick={event => {
								event.preventDefault();
								localStorage.clear();
							}}
						>Clear Storage
						</a>
					</li>
				</ul>
			</nav>
		)
	}
}

export default Header;